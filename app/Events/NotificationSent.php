<?php

namespace App\Events;

use App\Models\Notification;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NotificationSent implements ShouldBroadcastNow {
	use Dispatchable, InteractsWithSockets, SerializesModels;

	/**
	 * Create a new event instance.
	 */
	public Notification $notification;

	public function __construct(Notification $notification) {
		$this->notification = $notification;
	}

	/**
	 * Get the channels the event should broadcast on.
	 *
	 * @return array<int, \Illuminate\Broadcasting\Channel>
	 */
	public function broadcastOn() {
		$id = $this->notification->receiver_id;

		return new PrivateChannel("notification.{$id}");
	}

	public function broadcastWith() {
		return [
			'notification' => [
				'id' => $this->notification->id,
				'type' => $this->notification->type,
				'sender_id' => $this->notification->sender_id,
				'receiver_id' => $this->notification->receiver_id,

				'mood' => $this->notification->mood,
				'title' => $this->notification->title,
				'description' => $this->notification->description,
				'image' => $this->notification->image ?? null,

				'created_at' => $this->notification->created_at,
				'updated_at' => $this->notification->updated_at,
			],
		];
	}
}
