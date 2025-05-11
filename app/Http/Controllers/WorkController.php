<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;

class WorkController extends Controller {
	use AuthorizesRequests;
	/**
	 * Display a listing of the resource.
	 */
	public function index() {
		return Inertia::render('works/all', [
			'works' => Auth::user()->works,
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

		return redirect()->route('work', ['work' => $work->id]);
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Work $work) {
		$this->authorize('view', $work);

		return Inertia::render('works/work', [
			'work' => $work,
		]);
	}

	/**
	 * Show the form for editing the specified resource.
	 */
	public function edit(Work $work) {
		//
	}

	/**
	 * Update the specified resource in storage.
	 */
	public function update(UpdateWorkRequest $request, Work $work) {
		//
	}

	/**
	 * Remove the specified resource from storage.
	 */
	public function destroy(Work $work) {
		//
	}
}
