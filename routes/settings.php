<?php

use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\AvatarController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'throttle:60,1'])->group(function () {
	Route::redirect('settings', 'settings/profile');

	Route::post('settings/profile/avatar', [AvatarController::class, 'update'])->name('profile.avatar.update');
	Route::delete('settings/profile/avatar', [AvatarController::class, 'destroy'])->name('profile.avatar.destroy');

	Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
	Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
	Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

	Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');
	Route::put('settings/password', [PasswordController::class, 'update'])->name('password.update');

	Route::get('settings/appearance', function () {
		return Inertia::render('settings/appearance');
	})->name('appearance');
});
