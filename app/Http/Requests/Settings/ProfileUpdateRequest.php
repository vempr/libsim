<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest {
	/**
	 * Get the validation rules that apply to the request.
	 *
	 * @return array<string, ValidationRule|array<mixed>|string>
	 */
	public function rules(): array {
		$id = Auth::id();

		return [
			'name' => [
				'required',
				'string',
				'min:3',
				'max:30',
				Rule::unique(User::class)->ignore($id)
			],
			'email' => [
				'required',
				'string',
				'lowercase',
				'email',
				'max:255',
				Rule::unique(User::class)->ignore($id),
			],
		];
	}
}
