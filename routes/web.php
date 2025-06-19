<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
	return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard', DashboardController::class)
	->middleware(['auth', 'verified'])->name('dashboard');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/work.php';
require __DIR__ . '/user.php';
require __DIR__ . '/notification.php';
require __DIR__ . '/favorite.php';
require __DIR__ . '/collection.php';
require __DIR__ . '/chat.php';
require __DIR__ . '/channels.php';
require __DIR__ . '/profile.php';
