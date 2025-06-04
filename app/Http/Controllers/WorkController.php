<?php

namespace App\Http\Controllers;

use App\Http\Requests\ShowWorkRequest;
use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;
use App\Models\Collection;
use App\Models\User;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\Relation;

function search(Builder | Relation $query, array $state): Builder | Relation {
	if ($state['q']) {
		$query->where('title', 'like', "%{$state['q']}%");
	}

	if ($state['author']) {
		$authorsArray = explode(',', $state['author']);
		foreach ($authorsArray as $author) {
			$query->where('author', 'like', '%' . trim($author) . '%');
		}
	}

	if ($state['tags']) {
		$tagsArray = explode(',', $state['tags']);
		foreach ($tagsArray as $tag) {
			$query->where('tags', 'like', '%' . trim($tag) . '%');
		}
	}

	if ($state['language_original']) {
		$query->where('language_original', $state['language_original']);
	}

	if ($state['language_translated']) {
		$query->where('language_translated', $state['language_translated']);
	}

	if ($state['status_publication']) {
		$query->where('status_publication', $state['status_publication']);
	}

	if ($state['status_reading']) {
		$query->where('status_reading', $state['status_reading']);
	}

	if ($state['publication_year']) {
		$query->where('publication_year', $state['publication_year']);
	}

	return $query;
}

function getBreadcrumbs(ShowWorkRequest $request, Work $work): array {
	$defaultBreadcrumbs = [[
		'title' => 'Saved works',
		'href' => '/works',
	]];

	$validated = $request->validated();
	$collectionId = $validated['collection'] ?? null;
	$userId = $validated['user'] ?? null;
	$favorite = $validated['favorite'] ?? null;

	$authUser = Auth::user();

	if ($collectionId) {
		$collection = Collection::find($collectionId);

		if (!$collection || $collection->user_id !== $authUser->id) {
			return $defaultBreadcrumbs;
		}

		return [[
			'title' => 'Collections',
			'href' => '/collections',
		], [
			'title' => $collection->name,
			'href' => "/collections/$collectionId",
		]];
	}

	if ($userId) {
		$user = User::find($userId);

		if (!$authUser->allFriends()->contains($user)) {
			return $defaultBreadcrumbs;
		}

		return [[
			'title' => 'Members',
			'href' => '/users',
		], [
			'title' => $user->name,
			'href' => "/users/$userId",
		]];
	}

	if ($favorite) {
		if (!$authUser->favoriteWorks()->where('work_id', $work->id)->exists()) {
			return $defaultBreadcrumbs;
		}

		return [[
			'title' => 'Favorited works',
			'href' => '/works',
		]];
	}

	return $defaultBreadcrumbs;
}

class WorkController extends Controller {
	use AuthorizesRequests;

	public function index(Request $request) {
		$state = [
			'searchIncludeFavorites' => $request->input('searchIncludeFavorites'),
			'q' => $request->input('q'),
			'author' => $request->input('author'),
			'tags' => $request->input('tags'),
			'language_original' => $request->input('language_original'),
			'language_translated' => $request->input('language_translated'),
			'status_publication' => $request->input('status_publication'),
			'status_reading' => $request->input('status_reading'),
			'publication_year' => $request->input('publication_year'),
		];

		$user = Auth::user();
		$worksQuery = Work::query()->where('user_id', $user->id);
		$works = search($worksQuery, $state)->paginate(15, ['*'], 'saved');

		$favoritedWorks = null;
		if (filter_var($request->input('searchIncludeFavorites', false), FILTER_VALIDATE_BOOLEAN)) {
			$favoriteQuery = $user->favoriteWorks();
			$favoritedWorks = search($favoriteQuery, $state)->paginate(15, ['*'], 'favorited');
		} else {
			$favoritedWorks = $user->favoriteWorks()->paginate(15, ['*'], 'favorited');
		}

		return Inertia::render('works/all', [
			'worksPaginatedResponse' => $works,
			'favoritesPaginatedResponse' => $favoritedWorks,
			'searchState' => $state,
		]);
	}

	public function create() {
		return Inertia::render('works/new');
	}

	public function store(StoreWorkRequest $request): RedirectResponse {
		$requestWork = $request->validated();
		$requestWork['user_id'] = Auth::id();

		$work = Work::create($requestWork);

		return redirect('works/' . $work->id)->with('success', 'Your work "' . $work->title . '" has been created.');
	}

	public function show(ShowWorkRequest $request, Work $work) {
		$this->authorize('view', $work);

		$user = User::find($work->user_id);
		$authUser = Auth::user();

		$profile = null;
		if ($user->id === $authUser->id) {
			$profile = $user->only(['id', 'name', 'avatar', 'introduction', 'description']);
		}

		$breadcrumbs = getBreadcrumbs($request, $work);

		return Inertia::render('works/work', [
			'work' => [
				...$work->toArray(),
				'collections' => $work->collections->map->only(['id', 'name']),
			],
			'profile' => $profile,
			'favorited' => $authUser->favoriteWorks()->where('work_id', $work->id)->exists(),
			'collections' => $authUser->collections->map->only(['id', 'name']),
			'breadcrumbs' => $breadcrumbs,
		]);
	}

	public function edit(Work $work) {
		$this->authorize('edit', $work);

		return Inertia::render('works/edit', [
			'work' => $work,
		]);
	}

	public function update(UpdateWorkRequest $request, Work $work) {
		$this->authorize('update', $work);

		$work->update($request->validated());

		return redirect('works/' . $work->id)->with('success', 'Your work "' . $work->title . '" has been updated.');
	}

	public function destroy(Work $work) {
		$this->authorize('delete', $work);

		$work->delete();

		return redirect('works')->with('success', 'Your work "' . $work->title . '" has been deleted.');
	}
}
