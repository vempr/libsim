<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreWorkRequest;
use App\Http\Requests\UpdateWorkRequest;
use App\Models\Work;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class WorkController extends Controller {
	/**
	 * Display a listing of the resource.
	 */
	public function index() {
		$id = Auth::id();

		return Inertia::render('works/all', [
			'works' => Work::where('user_id', $id)->get(),
		]);
	}

	/**
	 * Show the form for creating a new resource.
	 */
	public function create() {
		//
	}

	/**
	 * Store a newly created resource in storage.
	 */
	public function store(StoreWorkRequest $request) {
		//
	}

	/**
	 * Display the specified resource.
	 */
	public function show(Work $work) {
		if (Auth::id() !== $work->user_id) return redirect('works/all');

		return Inertia::render('works/id', [
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
