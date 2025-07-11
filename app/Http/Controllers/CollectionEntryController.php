<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use App\Models\CollectionEntry;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CollectionEntryController extends Controller {
	public function updateMultiple(Request $request, Collection $collection) {
		if ($collection->user_id !== Auth::id()) {
			return back()->with('error', 'You do not own this collection!');
		}

		$validated = $request->validate([
			'work_ids' => 'nullable|array',
			'work_ids.*' => 'exists:works,id',
		]);

		$workIds = $validated['work_ids'] ?? [];
		if (Auth::user()->works()->whereIn('id', $workIds)->count() < count($workIds)) {
			return back();
		}

		$existingWorkIds = CollectionEntry::where('collection_id', $collection->id)
			->pluck('work_id')
			->toArray();

		$toAdd = array_values(array_diff($workIds, $existingWorkIds));
		$toRemove = array_values(array_diff($existingWorkIds, $workIds));

		if ($toAdd) {
			foreach ($toAdd as $workId) {
				CollectionEntry::create([
					'collection_id' => $collection->id,
					'work_id' => $workId,
				]);
			}
		}

		if ($toRemove) {
			CollectionEntry::where('collection_id', $collection->id)
				->whereIn('work_id', $toRemove)
				->delete();
		}

		$collection->updated_at = now();
		$collection->save();

		return back()->with('success', 'Collection successfully updated!');
	}

	public function updateSingle(Request $request, Work $work) {
		$validated = $request->validate([
			'collection_ids' => 'nullable|array',
			'collection_ids.*' => 'exists:collections,id',
		]);

		$collectionIds = $validated['collection_ids'] ?? null;
		$userCollectionIds = Collection::where('user_id', Auth::id())
			->pluck('id')
			->toArray();

		if ($collectionIds) {
			if (array_diff($collectionIds, $userCollectionIds)) return back();
		}

		if (!$collectionIds) {
			$collection_entries = CollectionEntry::where('work_id', $work->id);

			Collection::whereIn('id', $collection_entries->pluck('collection_id')->toArray())->update(['updated_at' => now()]);

			$collection_entries->delete();
			return back()->with('success', 'Collections successfully updated!');
		}

		$toAdd = array_values(
			array_diff(
				$collectionIds,
				CollectionEntry::where('work_id', $work->id)
					->pluck('collection_id')
					->toArray()
			)
		);

		$toRemove = array_values(
			array_diff(
				CollectionEntry::where('work_id', $work->id)
					->whereIn('collection_id', $userCollectionIds)
					->pluck('collection_id')
					->toArray(),
				$collectionIds
			)
		);

		if ($toAdd) {
			foreach ($toAdd as $collectionId) {
				if (in_array($collectionId, $userCollectionIds)) {
					CollectionEntry::create([
						'collection_id' => $collectionId,
						'work_id' => $work->id,
					]);
				}
			}
		}

		if ($toRemove) {
			CollectionEntry::where('work_id', $work->id)
				->whereIn('collection_id', $toRemove)
				->delete();
		}

		Collection::whereIn('id', $toAdd)->update(['updated_at' => now()]);
		Collection::whereIn('id', $toRemove)->update(['updated_at' => now()]);

		return back()->with('success', 'Collections successfully updated!');
	}
}
