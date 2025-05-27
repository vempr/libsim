<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

function areFriends(int $receiverId): bool {
	return Auth::user()->friends()->where('friend_id', $receiverId)->exists();
}

function friendRequestExists(int $senderId, int $receiverId): bool {
	return FriendRequest::where('sender_id', $senderId)
		->where('receiver_id', $receiverId)
		->exists();
}

function getAcceptRequest(int $senderId, int $receiverId): FriendRequest|null {
	return FriendRequest::where('sender_id', $receiverId)
		->where('receiver_id', $senderId)
		->first();
}

class FriendController extends Controller {
	use AuthorizesRequests;

	public function me() {
		return Inertia::render('users/me', [
			'user' => Auth::user()->only(['id', 'name', 'avatar', 'introduction', 'description']),
		]);
	}

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
			->get();

		$user = Auth::user();
		$friends = $user->allFriends();

		return Inertia::render('users/all', [
			'users' => $users->select(['id', 'name', 'avatar', 'introduction']),
			'friends' => $friends->select(['id', 'name', 'avatar', 'introduction']),
			'userQuery' => $q,
		]);
	}

	public function create(User $user) {
		if (Auth::id() === $user->id) {
			return redirect('u');
		}

		$senderId = Auth::id();
		$receiverId = $user->id;
		$status = null;
		$works = null;

		if (areFriends($receiverId)) {
			$status = 'mutual';
		}
		if (friendRequestExists($senderId, $receiverId)) {
			$status = 'pending';
		}
		if (getAcceptRequest($senderId, $receiverId)) {
			$status = 'expecting';
		}


		if ($status === 'mutual') {
			$works = $user->works;
		}


		return Inertia::render('users/user', [
			'user' => $user->only(['id', 'name', 'avatar', 'introduction', 'description']),
			'works' => $works,
			'friendRequestStatus' => $status,
		]);
	}

	public function store(Request $request) {
		$validated = $request->validate([
			'receiver_id' => [
				'required',
				'numeric',
				'exists:users,id',
				'not_in:' . Auth::id(),
				'min:1',
				'max:1000000',
			],
		]);

		$sender = Auth::user();
		$senderId = $sender->id;
		$receiverId = $validated['receiver_id'];

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

			Notification::create([
				'type' => 'reminder',
				'sender_id' => $senderId,
				'receiver_id' => $receiverId,
				'mood' => 'positive',
				'title' => 'Friend request accepted',
				'description' => $sender->name . " and you are now friends. You can both see each other's works.",
				'image' => $sender->avatar,
			]);

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

		Notification::create([
			'type' => 'friend_request',
			'sender_id' => $senderId,
			'receiver_id' => $receiverId,
			'mood' => 'neutral',
			'title' => 'Pending friend request',
			'description' => $sender->name . " has sent you a friend request. They have 'share works' enabled.",
			'image' => $sender->avatar,
		]);

		return back()->with('success', 'Friend request sent.');
	}

	public function destroy(Request $request) {
		$validated = $request->validate([
			'receiver_id' => [
				'required',
				'numeric',
				'exists:users,id',
				'not_in:' . Auth::id(),
				'min:1',
				'max:1000000',
			],
		]);

		$authUser = Auth::user();
		$receiverId = $validated['receiver_id'];
		$user = User::find($receiverId);

		$pendingRequest = FriendRequest::where(function ($q) use ($authUser, $user) {
			$q->where('sender_id', $user->id)->where('receiver_id', $authUser->id);
		})
			->orWhere(function ($q) use ($authUser, $user) {
				$q->where('sender_id', $authUser->id)->where('receiver_id', $user->id);
			})
			->first();

		if ($pendingRequest) {
			$pendingRequest->delete();

			Notification::create([
				'type' => 'reminder',
				'sender_id' => $authUser->id,
				'receiver_id' => $receiverId,
				'mood' => 'negative',
				'title' => 'Friend request declined',
				'description' => $user->name . " has declined your friend request. You can not see each other's works.",
				'image' => $user->avatar,
			]);

			Notification::where('type', 'friend_request')
				->where('sender_id', $receiverId)
				->where('receiver_id', $authUser->id)
				->delete();

			return back()->with('success', 'You have declined ' . $user->name . '\'s friend request.');
		}

		$authUser->friends()->detach($user->id);
		$user->friends()->detach($authUser->id);

		Notification::create([
			'type' => 'reminder',
			'sender_id' => $authUser->id,
			'receiver_id' => $receiverId,
			'mood' => 'negative',
			'title' => 'You have been unfriended',
			'description' => $user->name . " has unfriended you. You can no longer see each other's works.",
			'image' => $user->avatar,
		]);

		return back()->with('success', 'You have unfriended ' . $user->name . '.');
	}
}
