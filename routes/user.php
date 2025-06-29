<?php

use App\Http\Controllers\FriendController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'throttle:60,1'])
	->controller(FriendController::class)
	->prefix('users')
	->group(function () {
		Route::get('/', 'index')->name('users.index');

		Route::get('{user}', 'create')->name('users.create');
		Route::post('/', 'store')->name('users.store');
		Route::delete('/', 'destroy')->name('users.destroy');
	});
