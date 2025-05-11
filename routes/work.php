<?php

use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'web'])
	->controller(WorkController::class)
	->prefix('works')
	->group(function () {
		Route::get('/', 'index')->name('all');
		Route::get('new', 'create');
		Route::post('new', 'store');
		Route::get('{work}', 'show')->name('work');
	});
