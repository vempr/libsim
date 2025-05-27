<?php

use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Route;

Route::get('notifications', NotificationController::class)->middleware(['auth', 'verified']);
