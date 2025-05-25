<?php

use App\Http\Controllers\FriendController;
use Illuminate\Support\Facades\Route;

Route::get('/u', [FriendController::class, 'me'])
	->middleware(['auth', 'verified'])
	->name('users.me');

Route::middleware(['auth', 'verified'])
	->controller(FriendController::class)
	->prefix('users')
	->group(function () {
		Route::get('/', 'index')->name('users.index');

		Route::get('{user}', 'show')->name('users.show');
		// Route::post('{user}', 'store')->name('users.store');
		// Route::delete('{user}', 'destroy')->name('users.destroy');
	});
