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
	];

	public function works(): BelongsToMany {
		return $this->belongsToMany(Work::class, 'collection_entries', 'collection_id', 'work_id')
			->withTimestamps();
	}
}
