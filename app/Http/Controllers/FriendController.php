<?php

namespace App\Http\Controllers;

use App\Models\FriendRequest;
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

function acceptRequest(int $senderId, int $receiverId): FriendRequest|null {
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
		$users = null;

		if ($q) {
			$users = User::query()
				->where('name', 'like', '%' . $q . '%')
				->get();
		} else {
			$users = User::all();
		}

		return Inertia::render('users/all', [
			'users' => $users->select(['id', 'name', 'avatar', 'introduction']),
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

		if (areFriends($receiverId)) {
			$status = 'mutual';
		}
		if (friendRequestExists($senderId, $receiverId)) {
			$status = 'pending';
		}
		if (acceptRequest($senderId, $receiverId)) {
			$status = 'expecting';
		}

		return Inertia::render('users/user', [
			'user' => $user->only(['id', 'name', 'avatar', 'introduction', 'description']),
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

		$senderId = Auth::id();
		$receiverId = $validated['receiver_id'];

		if (areFriends($receiverId)) {
			return back()->with('error', 'You are already friends.');
		}
		if (friendRequestExists($senderId, $receiverId)) {
			return back()->with('error', 'Friend request already sent.');
		}

		$acceptRequest = acceptRequest($senderId, $receiverId);
		if ($acceptRequest) {
			Auth::user()->friends()->attach($receiverId);
			User::find($receiverId)->friends()->attach($senderId);
			$acceptRequest->delete();

			return back()->with('success', 'Friend request accepted!');
		}

		FriendRequest::create([
			'sender_id' => $senderId,
			'receiver_id' => $receiverId,
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
			return back()->with('success', 'You have declined ' . $user->name . '\'s friend request.');
		}

		$authUser->friends()->detach($user->id);
		$user->friends()->detach($authUser->id);

		return back()->with('success', 'You have unfriended ' . $user->name . '.');
	}
}
