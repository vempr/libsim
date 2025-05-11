<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model {
	public function worksAsOriginal() {
		return $this->hasMany(Work::class, 'language_original', 'code');
	}

	public function worksAsTranslated() {
		return $this->hasMany(Work::class, 'language_translated', 'code');
	}
}
