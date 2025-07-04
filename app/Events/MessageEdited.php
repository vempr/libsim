<?php

namespace App\Events;

use App\Models\ChatMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MessageEdited implements ShouldBroadcastNow {
	use Dispatchable;
	use InteractsWithSockets;
	use SerializesModels;

	/**
	 * Create a new event instance.
	 */
	public function __construct(public ChatMessage $message) {
		//
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return array<int, \Illuminate\Broadcasting\Channel>
	 */
	public function broadcastOn() {
		return new PrivateChannel("chat.{$this->message->receiver_id}");
	}

	public function broadcastWith() {
		return [
			'message' => [
				'id' => $this->message->id,
				'receiver_id' => $this->message->receiver_id,
				'text' => $this->message->text,
				'work_id' => null,
				'created_at' => $this->message->created_at,
				'updated_at' => $this->message->updated_at,
				'is_deleted' => $this->message->is_deleted,
				'sender' => [
					'id' => $this->message->sender->id,
					'name' => $this->message->sender->name,
					'avatar' => $this->message->sender->avatar,
				],
			],
		];
	}
}
