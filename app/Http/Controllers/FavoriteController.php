<?php

namespace App\Http\Controllers;

use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FavoriteController extends Controller {
	public function store(string $id) {
		$user = Auth::user();
		$work = Work::find($id);

		if ($work === null) {
			return back();
		}

		if (!Auth::user()->friends()->where('friend_id', $work->user_id)->exists()) {
			return back()->with('error', 'You can only favorite entries created by your friends.');
		}

		$user->favoriteWorks()->attach($id);
		DB::table('collection_entries')->where('work_id', $id)->update(['removed_from_favorites' => false]);

		return back()->with('success', 'You favorited "' . $work->title . '" by ' . $user->name . '!');
	}

	public function destroy(string $id) {
		$user = Auth::user();
		$work = Work::find($id);

		if ($work === null) {
			return back();
		}

		$user->favoriteWorks()->detach($id);
		DB::table('collection_entries')->where('work_id', $id)->update(['removed_from_favorites' => true]);

		return back()->with('success', 'You unfavorited "' . $work->title . '" by ' . $user->name . '.');
	}
}
