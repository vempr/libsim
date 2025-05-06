<?php

use App\Http\Controllers\WorkController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(WorkController::class)
	->prefix('works')
	->group(function () {
		Route::get('all', 'index');
		Route::get('{work}', 'show');
	});
