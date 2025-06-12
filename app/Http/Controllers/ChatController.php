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
		$userId = Auth::id();

		$friends = User::where(function ($query) use ($userId) {
			$query->whereHas('friendsOf', function ($q) use ($userId) {
				$q->where('user_id', $userId);
			})
				->orWhereHas('friends', function ($q) use ($userId) {
					$q->where('friend_id', $userId);
				});
		})
			->select(['id', 'name', 'avatar'])
			->get()
			->map(function ($friend) use ($userId) {
				$friend->latest_message = ChatMessage::where(function ($query) use ($userId, $friend) {
					$query->where('sender_id', $userId)
						->where('receiver_id', $friend->id);
				})
					->orWhere(function ($query) use ($userId, $friend) {
						$query->where('sender_id', $friend->id)
							->where('receiver_id', $userId);
					})
					->orderBy('created_at', 'desc')
					->first();

				return $friend;
			});

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

			->with(['sender' => function ($query) {
				$query->select('id', 'avatar', 'name');
			}])
			->orderBy('created_at', 'asc')
			->get()
			->makeHidden(['sender_id']);

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

	public function destroy(ChatMessage $message) {
		if ($message->sender_id !== Auth::id()) {
			return redirect(route('chat.index'));
		}

		$message->text = '';
		$message->is_deleted = true;
		$message->save();

		broadcast(new MessageSent($message));

		return back();
	}
}
