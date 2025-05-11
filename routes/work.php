<?php

use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(WorkController::class)
	->prefix('works')
	->group(function () {
		Route::get('/', 'index');

		Route::get('new', 'create');
		Route::post('new', 'store');

		Route::get('{work}', 'show')->name('work');
		Route::get('{work}/edit', 'edit');
		Route::put('{work}/edit', 'update')->name('work.update');
	});
