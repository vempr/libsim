<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller {
	public function index() {
		$user = Auth::user();

		return Inertia::render('notifications', [
			'notifications' => $user->notifications,
		]);
	}

	public function destroy(Notification $notification) {
		$notification->delete();
		return back();
	}
}
