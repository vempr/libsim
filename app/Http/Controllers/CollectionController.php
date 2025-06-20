<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CollectionController extends Controller {
	public function index() {
		$collections = Collection::select([
			'collections.id',
			'collections.name',
			'collections.created_at',
		])
			->where('user_id', Auth::id())
			->withCount('activeWorks as works_count')
			->leftJoin('collection_entries', 'collections.id', '=', 'collection_entries.collection_id')
			->selectRaw('MAX(collection_entries.created_at) as updated_at')
			->groupBy('collections.id', 'collections.name', 'collections.created_at')
			->paginate(30);

		return Inertia::render('collections/all', [
			'collectionsPaginatedResponse' => $collections,
		]);
	}

	public function view(Collection $collection) {
		if ($collection->user_id !== Auth::id()) {
			abort(404);
		}

		$works = $collection
			->works()
			->wherePivot('removed_from_favorites', false)
			->paginate(15);

		return Inertia::render('collections/collection', [
			'collection' => $collection->only(['id', 'name']),
			'worksPaginatedResponse' => $works,
			'worksForCollection' => Auth::user()->works()->select('id', 'title', 'author')->with('collections:id,name')->get(),
		]);
	}

	public function store(Request $request) {
		$validated = $request->validate([
			'name' => 'required|string|min:1|max:255',
		]);

		$name = $validated['name'];
		$userId = Auth::id();

		if (Collection::where('user_id', $userId)->where('name', $name)->exists()) {
			return back()->with('error', 'The collection "' . $name . '" already exists. Please choose another name.');
		}

		Collection::create([
			'user_id' => $userId,
			'name' => $name
		]);

		return back()->with('success', 'Your collection "' . $name . '" has been created.');
	}

	public function update(Collection $collection, Request $request) {
		$validated = $request->validate([
			'name' => 'required|string|min:1|max:255',
		]);
		$name = $validated['name'];

		if (Collection::where('user_id', Auth::id())->where('name', $name)->exists()) {
			return back()->with('error', 'The collection "' . $name . '" already exists. Please choose another name.');
		}

		$collection->update(['name' => $name]);

		return back()->with('success', 'Your collection has been renamed to "' . $name . '".');
	}

	public function destroy(Collection $collection) {
		if ($collection->user_id !== Auth::id()) {
			abort(404);
		}

		$collection->delete();

		return redirect(route('collection.index'))->with('success', 'Your collection "' . $collection->name . '" has been deleted.');
	}
}
