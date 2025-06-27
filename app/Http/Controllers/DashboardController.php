<?php

namespace App\Http\Controllers;

use App\Models\Work;
use App\Models\Collection;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

function sortByValue(array $data, ?string $key = null): array {
	if ($key === null) {
		uksort($data, function ($a, $b) use ($data) {
			$valA = $data[$a];
			$valB = $data[$b];

			if ($valA !== $valB) {
				return $valB <=> $valA;
			}

			return strcmp((string)$a, (string)$b);
		});
	} else {
		uasort($data, function ($a, $b) use ($key) {
			$valA = $a[$key];
			$valB = $b[$key];

			if ($valA !== $valB) {
				return $valB <=> $valA;
			}

			return strcmp($a['name'] ?? '', $b['name'] ?? '');
		});
	}
	return $data;
}

class DashboardController extends Controller {
	public function __invoke() {
		$user = Auth::user();
		$works = Work::where('user_id', $user->id)->get();

		$worksCount = $works->count();
		if ($worksCount === 0) {
			return Inertia::render('dashboard', [
				'dashboardData' => null
			]);
		}

		$latestWork = $works->sortByDesc('created_at')->first()->toArray();

		$publicationStatuses = ['unknown', 'ongoing', 'completed', 'hiatus', 'cancelled'];
		$publicationStatuses = $works->groupBy(fn($w) => $w->status_publication ?? 'unknown')
			->map->count()
			->only($publicationStatuses)
			->toArray();

		$readingStatuses = ['reading', 'completed', 'on hold', 'dropped'];
		$readingStatuses = $works->groupBy('status_reading')
			->map->count()
			->only($readingStatuses)
			->toArray();

		$originalLanguages = $works->groupBy('language_original')
			->map->count()
			->toArray();

		$translatedLanguages = $works->groupBy('language_translated')
			->map->count()
			->toArray();

		$collections = Collection::where('user_id', $user->id)
			->withCount('collectionEntries')
			->get();

		$collectionsData = $collections->mapWithKeys(function ($collection) {
			return [$collection->id => [
				'name' => $collection->name,
				'count' => $collection->collection_entries_count,
			]];
		})->toArray();

		$tags = $works->pluck('tags')
			->filter()
			->flatMap(function ($tags) {
				return collect(explode(',', $tags));
			})
			->filter()
			->countBy()
			->toArray();

		$sortedPublicationStatuses = sortByValue($publicationStatuses);
		$sortedReadingStatuses = sortByValue($readingStatuses);
		$sortedOriginalLanguages = sortByValue($originalLanguages);
		$sortedTranslatedLanguages = sortByValue($translatedLanguages);
		$sortedCollectionsData = sortByValue($collectionsData, 'count');
		$sortedTags = sortByValue($tags);

		return Inertia::render('dashboard', [
			'dashboardData' => [
				'worksCount' => $worksCount,
				'latestWork' => $latestWork,
				'publicationStatuses' => $sortedPublicationStatuses,
				'readingStatuses' => $sortedReadingStatuses,
				'originalLanguages' => $sortedOriginalLanguages,
				'translatedLanguages' => $sortedTranslatedLanguages,
				'collectionsData' => $sortedCollectionsData,
				'tags' => $sortedTags,
			]
		]);
	}
}
