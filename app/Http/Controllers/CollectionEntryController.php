<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CollectionEntryController extends Controller {
	public function __invoke(Request $request) {
		$validated = $request->validate([
			'collection_ids' => 'required|array',
			'collection_ids.*' => 'exists:collections,id',
			'work_id' => 'required|exists:works,id',
		]);

		$collectionIds = $validated['collection_ids'];
		$workId = $validated['work_id'];
		$userId = Auth::id();

		$userCollections = Collection::where('user_id', $userId)
			->whereIn('id', $collectionIds)
			->pluck('name', 'id')
			->toArray();

		if (count($userCollections) !== count($collectionIds)) {
			return back()->with('error', 'Some collections were not found or don\'t belong to you.');
		}

		$existingEntries = DB::table('collection_entries')
			->where('work_id', $workId)
			->whereIn('collection_id', $collectionIds)
			->pluck('collection_id')
			->toArray();

		$newCollectionIds = array_diff($collectionIds, $existingEntries);

		if (empty($newCollectionIds)) {
			$collectionNames = implode('", "', $userCollections);
			return back()->with('error', "This work is already in all selected collections: \"$collectionNames\".");
		}

		$dataToInsert = array_map(function ($collectionId) use ($workId) {
			return [
				'collection_id' => $collectionId,
				'work_id' => $workId,
			];
		}, $newCollectionIds);

		DB::table('collection_entries')->insert($dataToInsert);

		$addedCollectionNames = array_intersect_key($userCollections, array_flip($newCollectionIds));
		$namesList = implode('", "', $addedCollectionNames);
		$count = count($newCollectionIds);

		return back()->with(
			'success',
			"Work added to $count collection(s): \"$namesList\"."
		);
	}
}
