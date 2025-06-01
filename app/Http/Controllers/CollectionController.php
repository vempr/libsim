<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class CollectionController extends Controller {
	public function index() {
		$collections = Collection::select(['id', 'name'])
			->where('user_id', Auth::id())
			->paginate(15);

		return Inertia::render('collections/all', [
			'collectionsPaginatedResponse' => $collections,
		]);
	}

	public function view(Collection $collection) {
		if ($collection->user_id !== Auth::id()) {
			abort(404);
		}

		$works = $collection->works()->paginate(15);

		return Inertia::render('collections/collection', [
			'collection' => $collection->only(['id', 'name']),
			'worksPaginatedResponse' => $works,
		]);
	}

	public function store(Request $request) {
		$validated = $request->validate([
			'name' => 'required|string|min:1|max:255',
			'work_id' => 'optional|exists:works,id',
		]);

		$name = $validated['name'];
		$workId = $validated['work_id'] ?? null;
		$userId = Auth::id();

		$collectionExistsBefore = Collection::where('user_id', $userId)->where('name', $name)->exists();
		$collection = Collection::firstOrCreate(
			['user_id' => $userId, 'name' => $name]
		);

		if ($workId === null) {
			if ($collectionExistsBefore) {
				return back()->with('error', 'The collection "' . $name . '" already exists. Please choose another name.');
			}

			return back()->with('success', 'Your collection "' . $name . '" has been created.');
		}

		if (DB::table('collection_entries')
			->where('collection_id', $collection->id)
			->where('work_id', $workId)
			->exists()
		) {
			return back()->with('info', 'This work is already in your collection "' . $name . '".');
		}

		DB::table('collection_entries')->insert([
			'collection_id' => $collection->id,
			'work_id' => $workId,
		]);

		return back()->with('success', 'Work added to your collection "' . $name . '".');
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

	public function destroy(Request $request) {
		$validated = $request->validate([
			'collection_id' => 'exists:collections,id',
			'work_id' => 'nullable|exists:works,id',
		]);

		$collectionId = $validated['collection_id'];
		$workId = $validated['work_id'] ?? null;

		$collection = Collection::find($collectionId);
		$work = Work::find($workId);

		if (!$collection || $collection->user_id !== Auth::id()) {
			abort(404);
		}

		if ($workId) {
			if ($work->user_id !== Auth::id()) {
				abort(404);
			}

			DB::table('collection_entries')
				->where('collection_id', $collectionId)
				->where('work_id', $workId)
				->delete();

			return back()->with('success', 'The work "' . $work->title . '" has been deleted from your collection "' . $collection->name . '".');
		}

		$collection->delete();

		return redirect(route('collection.index'))->with('success', 'Your collection "' . $collection->name . '" has been deleted.');
	}
}
