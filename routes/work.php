<?php

use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(WorkController::class)
	->prefix('works')
	->group(function () {
		Route::get('/', 'index')->name('work.index');

		Route::get('new', 'create')->name('work.create');
		Route::post('new', 'store')->name('work.post');

		Route::get('{work}', 'show')->name('work');
		Route::get('{work}/edit', 'edit');
		Route::post('{work}/edit', 'update')->name('work.update');
		Route::delete('{work}', 'destroy')->name('work.destroy');
	});
