<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Cloudinary\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

function fileIsAllowed(string $image): bool {
	return str_starts_with($image, 'data:image/avif') || str_starts_with($image, 'data:image/jpeg') || str_starts_with($image, 'data:image/png') || str_starts_with($image, 'data:image/webp');
}

class AvatarController extends Controller {
	private Cloudinary $cloudinary;

	public function __construct() {
		$this->cloudinary = new Cloudinary([
			'cloud' => [
				'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
				'api_key'  => env('CLOUDINARY_API_KEY'),
				'api_secret' => env('CLOUDINARY_API_SECRET'),
				'url' => [
					'secure' => true
				]
			]
		]);
	}

	public function update(Request $request) {
		$image = $request->validate([
			'file' => 'required|string|max:16777216'
		])['file'];

		if (!fileIsAllowed($image)) {
			return back()->with('error', 'File data type not allowed.');
		}

		$user = Auth::user();

		try {
			if ($user->avatar) {
				$this->cloudinary->uploadApi()->destroy($user->avatar_public_id);

				$user->avatar = null;
				$user->avatar_public_id = null;
				$user->update();
			}

			$result = $this->cloudinary->uploadApi()->upload($image);

			$user->avatar = $result['secure_url'];
			$user->avatar_public_id = $result['public_id'];
			$user->update();

			return back()->with('success', 'Avatar successfully updated!');
		} catch (\Exception $e) {
			return back()->with('error', 'An error occurred while updating your avatar: \'' . $e->getMessage() . '\'.');
		}
	}

	public function destroy() {
		$user = Auth::user();

		if ($user->avatar === null) {
			return back()->with('error', 'There is no avatar to delete.');
		}

		try {
			$this->cloudinary->uploadApi()->destroy($user->avatar_public_id);

			$user->avatar = null;
			$user->avatar_public_id = null;
			$user->update();

			return back()->with('success', 'Avatar successfully deleted.');
		} catch (\Exception $e) {
			return back()->with('error', 'An error occurred while deleting your avatar: \'' . $e->getMessage() . '\'.');
		}
	}
}
