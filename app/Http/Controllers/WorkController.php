<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;
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

class WorkController extends Controller {
	use AuthorizesRequests;
	/**
	 * Display a listing of the resource.
	 */
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
			'worksPagiationResponse' => $works,
			'favoritesPagiationResponse' => $favoritedWorks,
			'searchState' => $state,
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create() {
		return Inertia::render('works/new');
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreWorkRequest $request): RedirectResponse {
		$requestWork = $request->validated();
		$requestWork['user_id'] = Auth::id();

		$work = Work::create($requestWork);

		return redirect('works/' . $work->id)->with('success', 'Your work "' . $work->title . '" has been created.');
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Work $work) {
		$this->authorize('view', $work);

		$user = User::find($work->user_id);

		return Inertia::render('works/work', [
			'work' => $work,
			'profile' => $user->only(['id', 'name', 'avatar', 'introduction', 'description']),
			'favorited' => Auth::user()->favoriteWorks()->where('work_id', $work->id)->exists(),
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Work $work) {
		$this->authorize('edit', $work);

		return Inertia::render('works/edit', [
			'work' => $work,
		]);
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateWorkRequest $request, Work $work) {
		$this->authorize('update', $work);

		$work->update($request->validated());

		return redirect('works/' . $work->id)->with('success', 'Your work "' . $work->title . '" has been updated.');
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Work $work) {
		$this->authorize('delete', $work);

		$work->delete();

		return redirect('works')->with('success', 'Your work "' . $work->title . '" has been deleted.');
	}
}
