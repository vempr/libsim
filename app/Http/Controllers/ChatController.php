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
			->select(['id', 'name', 'avatar', 'private_works'])
			->get();

		$friendIds = $friends->pluck('id');

		$messages = ChatMessage::where(function ($q) use ($userId, $friendIds) {
			$q->where('sender_id', $userId)
				->whereIn('receiver_id', $friendIds);
		})
			->orWhere(function ($q) use ($userId, $friendIds) {
				$q->whereIn('sender_id', $friendIds)
					->where('receiver_id', $userId);
			})
			->orderBy('created_at', 'desc')
			->with([
				'work' => function ($query) {
					$query->select('id', 'title', 'description', 'image_self', 'image');
				}
			])
			->get()
			->groupBy(function ($message) use ($userId) {
				return $message->sender_id === $userId ? $message->receiver_id : $message->sender_id;
			});

		$friends->transform(function ($friend) use ($messages) {
			$latestMessage = $messages->get($friend->id)?->first();

			if ($latestMessage && $friend->private_works) {
				$latestMessage->unsetRelation('work');
			}

			$friend->latest_message = $latestMessage;

			return $friend;
		});

		return Inertia::render('chat/all', [
			'friends' => $friends,
		]);
	}

	public function show(User $friend, Request $request) {
		if (!Auth::user()->allFriends()->contains($friend)) {
			return redirect(route('chat.index'));
		}

		$query = ChatMessage::query()
			->where(function ($query) use ($friend) {
				$query->where('sender_id', Auth::id())
					->where('receiver_id', $friend->id);
			})
			->orWhere(function ($query) use ($friend) {
				$query->where('sender_id', $friend->id)
					->where('receiver_id', Auth::id());
			})
			->with([
				'sender:id',
			]);

		if (!$friend->private_works) {
			$query->with([
				'work' => function ($query) {
					$query->select('id', 'title', 'description', 'image_self', 'image');
				}
			]);
		}

		$messages = $query->orderBy('created_at', 'desc')
			->paginate(20)
			->through(function ($message) {
				return $message->makeHidden(['sender_id']);
			});
		$messages->setCollection($messages->getCollection()->reverse()->values());

		if ($request->get('only_works')) {
			return ['messagesPaginatedResponse' => $messages];
		}

		$works = Work::query()->where('user_id', Auth::id())->select('id', 'title', 'description', 'image_self', 'image')->get();

		return Inertia::render('chat/chat', [
			'messagesPaginatedResponse' => $messages,
			'worksForChat' => $works,
			'friend' => $friend->only(['id', 'name', 'avatar', 'private_works']),
		]);
	}

	public function store(Request $request, User $friend) {
		$user = Auth::user();
		if (!$user->allFriends()->contains($friend)) {
			return redirect(route('chat.index'));
		}

		$validated = $request->validate(['text' => 'max:1000', 'work_id' => 'exists:works,id']);
		$text = $validated['text'] ?? null;
		$workId = $validated['work_id'] ?? null;

		if ($workId && $text) {
			return back();
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

		return back();
	}

	public function destroy(ChatMessage $message) {
		if ($message->sender_id !== Auth::id()) {
			return redirect(route('chat.index'));
		}

		if ($message->is_deleted === true) {
			return back()->with('error', 'Message already deleted.');
		}

		$message->text = null;
		$message->work_id = null;
		$message->is_deleted = true;
		$message->save();

		broadcast(new MessageSent($message));

		return back();
	}
}
