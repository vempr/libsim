<?php

use App\Http\Controllers\CollectionController;
use App\Http\Controllers\CollectionEntryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'throttle:60,1'])
	->controller(CollectionEntryController::class)
	->prefix('collections-entries')
	->group(function () {
		Route::put('{collection}', 'updateMultiple')->name('collection.entry.update.multiple');
		Route::put('/works/{work}', 'updateSingle')->name('collection.entry.update.single');
	});

Route::middleware(['auth', 'verified', 'throttle:60,1'])
	->controller(CollectionController::class)
	->prefix('collections')
	->group(function () {
		Route::get('/', 'index')->name('collection.index');
		Route::post('/', 'store')->name('collection.store');

		Route::get('{collection}', 'view')->name('collection.view');
		Route::put('{collection}', 'update')->name('collection.update');
		Route::delete('{collection}', 'destroy')->name('collection.destroy');
	});
