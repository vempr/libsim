<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model {
	/** @use HasFactory<\Database\Factories\WorkFactory> */
	use HasFactory, HasUuids;

	protected $fillable = [
		'user_id',
		'title',
		'description',
		'status_publication',
		'status_reading',
		'author',
		'language_original',
		'language_translated',
		'publication_year',
		'image_self',
		'image',
		'image_public_id',
		'tags',
		'links',
	];

	protected $hidden = ['pivot'];

	public function user() {
		return $this->belongsTo(User::class);
	}

	public function collections() {
		return $this->belongsToMany(Collection::class, 'collection_entries');
	}

	public function originalLanguage() {
		return $this->belongsTo(Language::class, 'language_original', 'code');
	}

	public function translatedLanguage() {
		return $this->belongsTo(Language::class, 'language_translated', 'code');
	}
}
