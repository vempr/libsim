<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Language extends Model {
	public function worksAsOriginal() {
		return $this
			->hasMany(Work::class, 'language_original', 'code')
			->where('user_id', Auth::id());
	}

	public function worksAsTranslated() {
		return $this
			->hasMany(Work::class, 'language_translated', 'code')
			->where('user_id', Auth::id());
	}
}
