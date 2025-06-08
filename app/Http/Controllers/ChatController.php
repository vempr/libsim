<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ChatController extends Controller {
	public function index() {
		$friends = User::where(function ($query) {
			$query->whereHas('friendsOf', function ($q) {
				$q->where('user_id', Auth::id());
			})
				->orWhereHas('friends', function ($q) {
					$q->where('friend_id', Auth::id());
				});
		})
			->select(['id', 'name', 'avatar'])
			->get();

		return Inertia::render('chat/all', [
			'friends' => $friends,
		]);
	}

	public function show(User $friend) {
		$messages = ChatMessage::query()
			->where(function ($query) use ($friend) {
				$query->where('sender_id', Auth::id())
					->where('receiver_id', $friend->id);
			})
			->orWhere(function ($query) use ($friend) {
				$query->where('sender_id', $friend->id)
					->where('receiver_id', Auth::id());
			})
			->with(['sender', 'receiver'])
			->orderBy('created_at', 'asc')
			->get();

		return Inertia::render('chat/chat', [
			'messages' => $messages,
			'friend' => $friend->only(['id', 'name', 'avatar']),
		]);
	}

	public function store(Request $request, User $friend) {
		$text = $request->validate(['text' => 'required|min:1|max:1000'])['text'];
		$user = Auth::user();

		if (!$user->allFriends()->contains($friend)) {
			return redirect(route('chat.index'));
		}

		$message = ChatMessage::create([
			'sender_id' => Auth::id(),
			'receiver_id' => $friend->id,
			'text' => $text,
		]);

		broadcast(new MessageSent($message));

		return back();
	}

	public function destroy(ChatMessage $chatMessage) {
		if ($chatMessage->sender_id !== Auth::id()) {
			return redirect(route('chat.index'));
		}

		$chatMessage->text = null;
		$chatMessage->update();

		return back();
	}
}
