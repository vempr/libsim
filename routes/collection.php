<?php

use App\Http\Controllers\CollectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
	->controller(CollectionController::class)
	->prefix('collections')
	->group(function () {
		Route::get('/', 'index')->name('collection.index');
		Route::post('/', 'store')->name('collection.store');
		Route::delete('/', 'destroy')->name('collection.destroy');

		Route::get('{collection}', 'view')->name('collection.view');
		Route::put('{collection}', 'update')->name('collection.update');
	});
