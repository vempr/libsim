<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreWorkRequest extends FormRequest {
	/**
	 * Determine if the user is authorized to make this request.
	 */
	public function authorize(): bool {
		return true;
	}

	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
	 */
	public function rules(): array {
		$languages = 'ja,en,es,fr,pt,de,it,zh,ko,ru,th,id,vi,pl,tr';

		return [
			'title' => 'required|string|min:1|max:255',
			'description' => 'nullable|string|max:2000',
			'status_publication' => 'nullable|in:unknown,ongoing,completed,hiatus,cancelled',
			'status_reading' => 'required|in:reading,completed,on hold,dropped',
			'author' => 'nullable|string|max:255',
			'language_original' => 'nullable|string|in:' . $languages,
			'language_translated' => 'nullable|string|in:' . $languages,
			'publication_year' => 'nullable|integer|min:-5000|max:5000',
			'image_self' => 'nullable|string|max:255',
			'image' => 'nullable|file|mimetypes:image/png,image/webp,image/jpeg,image/avif|max:16384',
			'tags' => 'nullable|string|max:1000',
			'links' => 'nullable|string|max:3000',
		];
	}
}
