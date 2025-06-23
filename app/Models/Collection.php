<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Collection extends Model {
	use HasUuids;

	protected $fillable = [
		'user_id',
		'name',
		'updated_at',
	];

	protected $hidden = ['pivot'];

	public function works(): BelongsToMany {
		return $this->belongsToMany(Work::class, 'collection_entries', 'collection_id', 'work_id')
			->withPivot('removed_from_favorites')
			->withTimestamps();
	}

	public function activeWorks(): BelongsToMany {
		return $this->belongsToMany(Work::class, 'collection_entries', 'collection_id', 'work_id')
			->wherePivot('removed_from_favorites', false)
			->withPivot('removed_from_favorites')
			->withTimestamps();
	}

	public function collectionEntries() {
		return $this->hasMany(CollectionEntry::class);
	}
}
