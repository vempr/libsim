<?php

namespace App\Http\Controllers;

use App\Models\CollectionEntry;
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

		$user->favoriteWorks()->attach($id);
		DB::table('collection_entries')->where('work_id', $id)->update(['removed_from_favorites' => false]);

		return back()->with('success', 'You have favorited "' . $work->title . '" by ' . $user->name . '.');
	}

	public function destroy(string $id) {
		$user = Auth::user();
		$work = Work::find($id);

		if ($work === null) {
			return back();
		}

		$user->favoriteWorks()->detach($id);
		DB::table('collection_entries')->where('work_id', $id)->update(['removed_from_favorites' => true]);

		return back()->with('success', 'You have unfavorited "' . $work->title . '" by ' . $user->name . '.');
	}
}
