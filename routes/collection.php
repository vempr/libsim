<?php

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CollectionEntryController;
use Illuminate\Support\Facades\Route;

Route::put('/collections/work-update', CollectionEntryController::class)
	->middleware(['auth', 'verified'])
	->name('collection.entry.update');

Route::middleware(['auth', 'verified'])
	->controller(CollectionController::class)
	->prefix('collections')
	->group(function () {
		Route::get('/', 'index')->name('collection.index');
		Route::post('/', 'store')->name('collection.store');

		Route::get('{collection}', 'view')->name('collection.view');
		Route::put('{collection}', 'update')->name('collection.update');
		Route::delete('{collection}', 'destroy')->name('collection.destroy');
	});
