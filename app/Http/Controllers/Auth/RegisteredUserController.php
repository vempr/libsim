<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller {
	/**
	 * Show the registration page.
	 */
	public function create(): Response {
		return Inertia::render('auth/register');
	}

	/**
	 * Handle an incoming registration request.
	 *
	 * @throws \Illuminate\Validation\ValidationException
	 */
	public function store(Request $request): RedirectResponse {
		$request->validate([
			'name' => 'required|string|min:3|max:30|unique:' . User::class,
			'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
			'password' => ['required', Password::defaults()],
		]);

		$user = User::create([
			'hide_profile' => false,
			'private_works' => false,
			'name' => $request->name,
			'email' => $request->email,
			'password' => Hash::make($request->password),
		]);

		event(new Registered($user));

		Auth::login($user);

		return to_route('dashboard');
	}
}
