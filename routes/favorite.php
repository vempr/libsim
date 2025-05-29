<?php

use App\Http\Controllers\FavoriteController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(FavoriteController::class)
	->prefix('favorites')
	->group(function () {
		Route::post('{favorite}', 'store')->name('favorite.store');
		Route::delete('{favorite}', 'destroy')->name('favorite.destroy');
	});
