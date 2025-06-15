<?php

use App\Http\Controllers\PublicProfileController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(PublicProfileController::class)
	->prefix('u')
	->group(function () {
		Route::get('/', 'index')->name('u.index');
		Route::get('/edit', 'edit')->name('u.edit');
		Route::put('/edit', 'update')->name('u.update');
	});
