<?php

namespace App\Http\Controllers;

use App\Events\NotificationSent;
use App\Models\FriendRequest;
use App\Models\Notification;
use App\Models\Profile;
use App\Models\User;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

function areFriends(string $receiverId): bool {
	return Auth::user()->friends()->where('friend_id', $receiverId)->exists();
}

function friendRequestExists(string $senderId, string $receiverId): bool {
	return FriendRequest::where('sender_id', $senderId)
		->where('receiver_id', $receiverId)
		->exists();
}

function getAcceptRequest(string $senderId, string $receiverId): FriendRequest|null {
	return FriendRequest::where('sender_id', $receiverId)
		->where('receiver_id', $senderId)
		->first();
}

class FriendController extends Controller {
	use AuthorizesRequests;

	public function index(Request $request) {
		$validated = $request->validate([
			'userQuery' => [
				'sometimes',
				'string',
				'min:1',
				'max:255',
			],
		]);

		$q = $validated['userQuery'] ?? null;
		$query = User::query();

		if ($q) {
			$query->where('name', 'like', '%' . $q . '%');
		}

		$users = $query
			->where('id', '!=', Auth::id())
			->where('hide_profile', '=', 0)
			->select(['id', 'name', 'avatar'])
			->addSelect([
				'is_friend' => function ($query) {
					$query->selectRaw('COUNT(*) > 0')
						->from('friends')
						->where(function ($q) {
							$q->where(function ($sub) {
								$sub->where('friends.user_id', Auth::id())
									->whereColumn('friends.friend_id', 'users.id');
							})
								->orWhere(function ($sub) {
									$sub->where('friends.friend_id', Auth::id())
										->whereColumn('friends.user_id', 'users.id');
								});
						});
				}
			])
			->with(['profile' => function ($query) {
				$query->select(Profile::$indexFields);
			}])
			->paginate(30, ['*'], 'users');

		$fq = User::query();
		if ($q) {
			$fq->where('name', 'like', '%' . $q . '%');
		}

		$friends = $fq->where(function ($query) {
			$query->whereHas('friendsOf', function ($q) {
				$q->where('user_id', Auth::id());
			})
				->orWhereHas('friends', function ($q) {
					$q->where('friend_id', Auth::id());
				});
		})
			->select(['id', 'name', 'avatar'])
			->with(['profile' => function ($query) {
				$query->select(Profile::$indexFields);
			}])
			->paginate(30, ['*'], 'friends');

		return Inertia::render('users/all', [
			'usersPaginatedResponse' => $users,
			'friendsPaginatedResponse' => $friends,
			'userQuery' => $q,
		]);
	}

	public function create(User $user, Request $request) {
		if (Auth::id() === $user->id) {
			return redirect('u');
		}

		$senderId = Auth::id();
		$receiverId = $user->id;
		$status = null;
		$works = null;

		if ($user->hide_profile === 1 && !areFriends($receiverId)) {
			return redirect('users');
		}

		if (areFriends($receiverId)) {
			$status = 'mutual';
		}
		if (friendRequestExists($senderId, $receiverId)) {
			$status = 'pending';
		}
		if (getAcceptRequest($senderId, $receiverId)) {
			$status = 'expecting';
		}

		if ($status === 'mutual' && $user->private_works === 0) {
			$works = Work::query()
				->where('user_id', $user->id)
				->paginate(15);
		}

		if ($request->get('only_works')) {
			return [
				'worksPaginatedResponse' => $works,
			];
		}

		return Inertia::render('users/user', [
			'profile' => [
				...$user->only(['id', 'name', 'avatar', 'private_works']),
				'info' => Profile::where('user_id', $user->id)->select(Profile::$profileFields)->first(),
			],
			'worksPaginatedResponse' => $works,
			'friendRequestStatus' => $status,
		]);
	}

	public function store(Request $request) {
		$validated = $request->validate([
			'receiver_id' => [
				'required',
				'string',
				'exists:users,id',
				'not_in:' . Auth::id(),
				'max:255',
			],
		]);

		$sender = Auth::user();
		$senderId = $sender->id;
		$receiverId = $validated['receiver_id'];
		$receiver = User::find($receiverId);

		if ($sender->hide_profile === 1) {
			return back()->with('error', 'Please make your profile public to send friend requests.');
		}
		if ($receiver === null) {
			return redirect('users');
		}

		if (areFriends($receiverId)) {
			return back()->with('error', 'You are already friends.');
		}
		if (friendRequestExists($senderId, $receiverId)) {
			return back()->with('error', 'Friend request already sent.');
		}

		$acceptRequest = getAcceptRequest($senderId, $receiverId);
		if ($acceptRequest) {
			Auth::user()->friends()->attach($receiverId);
			User::find($receiverId)->friends()->attach($senderId);
			$acceptRequest->delete();

			$notification = Notification::create([
				'type' => 'friend_request_response',
				'sender_id' => $senderId,
				'receiver_id' => $receiverId,
				'mood' => 'positive',
				'title' => 'Friend request accepted',
				'description' => $sender->name . " and you are now friends. You can both see each other's works.",
				'image' => $sender->avatar,
			]);

			broadcast(new NotificationSent($notification));

			Notification::where('type', 'friend_request')
				->where('sender_id', $receiverId)
				->where('receiver_id', $senderId)
				->delete();

			return back()->with('success', 'Friend request accepted!');
		}

		FriendRequest::create([
			'sender_id' => $senderId,
			'receiver_id' => $receiverId,
		]);

		$notification = Notification::create([
			'type' => 'friend_request',
			'sender_id' => $senderId,
			'receiver_id' => $receiverId,
			'mood' => 'neutral',
			'title' => 'Pending friend request',
			'description' => $sender->name . " has sent you a friend request. They have 'share works' enabled.",
			'image' => $sender->avatar,
		]);

		broadcast(new NotificationSent($notification));

		return back()->with('success', 'Friend request sent.');
	}

	public function destroy(Request $request) {
		$validated = $request->validate([
			'receiver_id' => [
				'required',
				'string',
				'exists:users,id',
				'not_in:' . Auth::id(),
				'max:255',
			],
		]);

		$authUser = Auth::user();
		$receiverId = $validated['receiver_id'];
		$user = User::find($receiverId);

		if ($user === null) {
			return back();
		}

		$pendingRequest = FriendRequest::where(function ($q) use ($authUser, $user) {
			$q->where('sender_id', $user->id)->where('receiver_id', $authUser->id);
		})
			->orWhere(function ($q) use ($authUser, $user) {
				$q->where('sender_id', $authUser->id)->where('receiver_id', $user->id);
			})
			->first();

		if ($pendingRequest) {
			$pendingRequest->delete();

			$notification = Notification::create([
				'type' => 'friend_request_response',
				'sender_id' => $authUser->id,
				'receiver_id' => $receiverId,
				'mood' => 'negative',
				'title' => 'Friend request declined',
				'description' => $user->name . " has declined your friend request. You can not see each other's works.",
				'image' => $user->avatar,
			]);

			broadcast(new NotificationSent($notification));

			Notification::where('type', 'friend_request')
				->where('sender_id', $receiverId)
				->where('receiver_id', $authUser->id)
				->delete();

			return back()->with('success', 'You have declined ' . $user->name . '\'s friend request.');
		}

		$authUser->friends()->detach($user->id);
		$user->friends()->detach($authUser->id);

		$notification = Notification::create([
			'type' => 'friend_request_response',
			'sender_id' => $authUser->id,
			'receiver_id' => $receiverId,
			'mood' => 'negative',
			'title' => 'You have been unfriended',
			'description' => $user->name . " has unfriended you. You can no longer see each other's works.",
			'image' => $user->avatar,
		]);

		broadcast(new NotificationSent($notification));

		return back()->with('success', 'You have unfriended ' . $user->name . '.');
	}
}
