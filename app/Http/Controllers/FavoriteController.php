<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Support\Facades\Auth;

class FavoriteController extends Controller {
	public function store(string $id) {
		$user = Auth::user();
		$work = Work::find($id);

		if ($work === null) {
			return back();
		}

		$user->favoriteWorks()->attach($id);
		return back()->with('success', 'You have favorited "' . $work->title . '" by ' . $user->name . '.');
	}

	public function destroy(string $id) {
		$user = Auth::user();
		$work = Work::find($id);

		if ($work === null) {
			return back();
		}

		$user->favoriteWorks()->detach($id);
		return back()->with('success', 'You have unfavorited "' . $work->title . '" by ' . $user->name . '.');
	}
}
