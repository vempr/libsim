<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Work;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PublicProfileController extends Controller {
	public function index() {
		$auth = Auth::user();

		return Inertia::render('users/me', [
			'profile' => [
				...$auth->only(['id', 'name', 'avatar']),
				'info' => Profile::where('user_id', $auth->id)->select(Profile::$ownFields)->first(),
			],
			'worksPaginatedResponse' => $auth->works()->orderByDesc('updated_at')->paginate(15),
		]);
	}

	public function edit() {
		return Inertia::render('users/edit', [
			'info' => Profile::where('user_id', Auth::id())->select(Profile::$profileFields)->first(),
		]);
	}

	public function update(Request $request) {
		$validated = $request->validate([
			'introduction' => 'nullable|string|max:255',
			'description' => 'nullable|string|max:2000',
			'good_tags' => 'nullable|string|max:255',
			'neutral_tags' => 'nullable|string|max:255',
			'bad_tags' => 'nullable|string|max:255',
		]);

		DB::table('profiles')->where('user_id', '=', Auth::id())->update($validated);

		return redirect(route('u.index'))->with('success', 'Your profile settings have been updated!');
	}
}
