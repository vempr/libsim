<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{id}', function ($user, $id) {
	return (string) $user->id === (string) $id;
});

Broadcast::channel('notification.{id}', function ($user, $id) {
	return (string) $user->id === (string) $id;
});
