<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller {
	public function store(string $id) {
		$user = Auth::user();
		$user->favoriteWorks()->attach($id);

		$work = Work::find($id);
		return back()->with('success', 'You have favorited "' . $work->title . '" by ' . $user->name . '.');
	}

	public function destroy(string $id) {
		$user = Auth::user();
		$user->favoriteWorks()->detach($id);

		$work = Work::find($id);
		return back()->with('success', 'You have unfavorited "' . $work->title . '" by ' . $user->name . '.');
	}
}
