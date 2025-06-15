<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\ChatMessage;
use App\Models\User;
use App\Models\Work;
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
					->with(['work' => function ($query) {
						$query->select('id', 'title', 'description', 'image_self', 'image');
					}])
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

			->with([
				'sender' => function ($query) {
					$query->select('id');
				},
				'work' => function ($query) {
					$query->select('id', 'title', 'description', 'image_self', 'image');
				},
			])
			->orderBy('created_at', 'asc')
			->get()
			->makeHidden(['sender_id']);

		$works = Work::query()->where('user_id', Auth::id())->select('id', 'title', 'description', 'image_self', 'image')->get();

		return Inertia::render('chat/chat', [
			'messages' => $messages,
			'works' => $works,
			'friend' => $friend->only(['id', 'name', 'avatar']),
		]);
	}

	public function store(Request $request, User $friend) {
		$validated = $request->validate(['text' => 'max:1000', 'work_id' => 'exists:works,id']);
		$text = $validated['text'] ?? null;
		$workId = $validated['work_id'] ?? null;

		if ($workId && $text) {
			return back();
		}

		$user = Auth::user();
		if (!$user->allFriends()->contains($friend)) {
			return redirect(route('chat.index'));
		}

		$message = null;

		if ($workId) {
			if (Auth::id() !== Work::find($workId)->user_id) {
				return back();
			}

			$message = ChatMessage::create([
				'sender_id' => Auth::id(),
				'receiver_id' => $friend->id,
				'work_id' => $workId,
			]);
		}

		if ($text) {
			$message = ChatMessage::create([
				'sender_id' => Auth::id(),
				'receiver_id' => $friend->id,
				'text' => $text,
			]);
		}

		broadcast(new MessageSent($message));
		// $message->load([
		// 	'sender:id,name,avatar',
		// 	'work:id,title,description,image,image_self',
		// ]);

		return back();
	}

	public function destroy(ChatMessage $message) {
		if ($message->sender_id !== Auth::id()) {
			return redirect(route('chat.index'));
		}

		$message->text = null;
		$message->work_id = null;
		$message->is_deleted = true;
		$message->save();

		broadcast(new MessageSent($message));

		return back();
	}
}
