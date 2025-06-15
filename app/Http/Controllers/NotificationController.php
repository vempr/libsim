<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller {
	public function index() {
		$notifications = Notification::where('receiver_id', Auth::id())->paginate(20);

		return Inertia::render('notifications', [
			'notificationsPaginatedResponse' => $notifications,
		]);
	}

	public function destroy(Notification $notification) {
		$notification->delete();
		return back();
	}
}
