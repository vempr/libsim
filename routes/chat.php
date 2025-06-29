<?php

use App\Http\Controllers\ChatController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'throttle:60,1'])
	->controller(ChatController::class)
	->prefix('chat')
	->group(function () {
		Route::get('/', 'index')->name('chat.index');
		Route::get('{friend}', 'show')->name('chat.show');

		Route::post('{friend}', 'store')->name('chat.store');
		Route::patch('{message}', 'update')->name('chat.update');
		Route::delete('{message}', 'destroy')->name('chat.destroy');
	});
