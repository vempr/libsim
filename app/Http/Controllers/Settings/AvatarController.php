<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AvatarController extends Controller {
	public function update(Request $request) {
		$image = $request->validate([
			'file' => 'required|string|max:16777216'
		])['file'];

		$cloudinary = new Cloudinary([
			'cloud' => [
				'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
				'api_key'  => env('CLOUDINARY_API_KEY'),
				'api_secret' => env('CLOUDINARY_API_SECRET'),
				'url' => [
					'secure' => true
				]
			]
		]);

		try {
			$result = $cloudinary->uploadApi()->upload($image);

			$user = Auth::user();
			$user->avatar = $result['secure_url'];
			$user->avatar_public_id = $result['public_id'];
			$user->update();

			return back()->with('success', 'Avatar successfully updated.');
		} catch (\Exception $e) {
			return back()->with('error', 'An error occured while updating your avatar: \'' . $e->getMessage() . '\'.');
		}
	}

	public function destroy() {
		$cloudinary = new Cloudinary([
			'cloud' => [
				'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
				'api_key'  => env('CLOUDINARY_API_KEY'),
				'api_secret' => env('CLOUDINARY_API_SECRET'),
				'url' => [
					'secure' => true
				]
			]
		]);

		$user = Auth::user();

		if ($user->avatar === null) {
			return back()->with('error', 'There is no avatar to delete.');
		}

		try {
			$cloudinary->uploadApi()->destroy(Auth::user()->avatar_public_id);

			$user->avatar = null;
			$user->avatar_public_id = null;
			$user->update();

			return back()->with('success', 'Avatar successfully deleted.');
		} catch (\Exception $e) {
			return back()->with('error', 'An error occured while deleting your avatar: \'' . $e->getMessage() . '\'.');
		}
	}
}
