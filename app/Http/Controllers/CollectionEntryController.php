<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\User;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

function allowWork(String $id): bool {
	$work = Work::find($id);

	$creator = User::find($work->user_id);
	$authUser = Auth::user();

	return $creator->id === $authUser->id || $authUser->allFriends()->contains($creator);
}

class CollectionEntryController extends Controller {
	public function __invoke(Request $request) {
		$validated = $request->validate([
			'collection_ids' => 'array',
			'collection_ids.*' => 'exists:collections,id',
			'work_id' => 'required|exists:works,id',
		]);

		$collectionIds = $validated['collection_ids'] ?? [];
		$workId = $validated['work_id'];
		$userId = Auth::id();

		if (!allowWork($workId)) {
			return back()->with('error', 'You don\'t have collection access to this work.');
		}

		$allUserCollections = Collection::where('user_id', $userId)
			->pluck('name', 'id')
			->toArray();

		if (count(array_intersect_key($allUserCollections, array_flip($collectionIds))) !== count($collectionIds)) {
			return back()->with('error', 'Some collections were not found or don\'t belong to you.');
		}

		$existingEntries = DB::table('collection_entries')
			->where('work_id', $workId)
			->whereIn('collection_id', array_keys($allUserCollections))
			->pluck('collection_id')
			->toArray();

		$newCollectionIds = array_diff($collectionIds, $existingEntries);
		$collectionsToRemove = array_diff($existingEntries, $collectionIds);

		if (!empty($collectionsToRemove)) {
			DB::table('collection_entries')
				->where('work_id', $workId)
				->whereIn('collection_id', $collectionsToRemove)
				->delete();
		}

		$addedCollectionNames = [];
		if (!empty($newCollectionIds)) {
			$dataToInsert = array_map(function ($collectionId) use ($workId) {
				return [
					'collection_id' => $collectionId,
					'work_id' => $workId,
				];
			}, $newCollectionIds);

			DB::table('collection_entries')->insert($dataToInsert);
			$addedCollectionNames = array_intersect_key($allUserCollections, array_flip($newCollectionIds));
		}

		$message = [];
		if (!empty($collectionsToRemove)) {
			$removedNames = array_intersect_key($allUserCollections, array_flip($collectionsToRemove));
			$message[] = 'Removed from: "' . implode('", "', $removedNames) . '"';
		}
		if (!empty($addedCollectionNames)) {
			$message[] = 'Added to: "' . implode('", "', $addedCollectionNames) . '"';
		}

		return back()->with(
			'success',
			$message ? implode('. ', $message) : 'No changes made.'
		);
	}
}
