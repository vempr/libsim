<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model {
	/** @use HasFactory<\Database\Factories\WorkFactory> */
	use HasFactory;

	protected $fillable = [
		'user_id',
		'title',
		'description',
		'status',
		'author',
		'language_original',
		'language_translated',
		'publication_year',
		'image',
	];

	public function user() {
		return $this->belongsTo(User::class);
	}

	public function originalLanguage() {
		return $this->belongsTo(Language::class, 'language_original', 'code');
	}

	public function translatedLanguage() {
		return $this->belongsTo(Language::class, 'language_translated', 'code');
	}
}
