<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(NotificationController::class)
	->prefix('notifications')
	->group(function () {
		Route::get('/', 'index')->name('notification.index');
		Route::delete('{notification}', 'destroy')->name('notification.destroy');
	});
