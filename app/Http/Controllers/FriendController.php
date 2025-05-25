<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FriendController extends Controller {
	use AuthorizesRequests;

	public function me() {
		return Inertia::render('users/me', [
			'user' => Auth::user()->only(['id', 'name', 'avatar', 'introduction', 'description']),
		]);
	}

	/**
	 * Display a listing of the resource.
	 */
	public function index(Request $request) {
		return Inertia::render('users/all', ['users' => User::all()->select(['id', 'name', 'avatar', 'introduction'])]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create() {
		return Inertia::render('users/user');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	// public function store(StoreWorkRequest $request): RedirectResponse {
	// 	$requestWork = $request->validated();
	// 	$requestWork['user_id'] = Auth::id();

	// 	$work = Work::create($requestWork);

	// 	return redirect('works/' . $work->id)->with('success', 'Your work "' . $work->title . '" has been created.');
	// }

	/**
	 * Display the specified resource.
	 */
	public function show(User $user) {
		// $this->authorize('view', $user);

		return Inertia::render('users/user', [
			'user' => $user->only(['id', 'name', 'avatar', 'introduction', 'description']),
		]);
	}

	/**
	 * Remove the specified resource from storage.
	 */
	// public function destroy(Work $work) {
	// 	$this->authorize('delete', $work);

	// 	$work->delete();

	// 	return redirect('works')->with('success', 'Your work "' . $work->title . '" has been deleted.');
	// }
}
