<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CollectionEntry extends Model {
	protected $table = 'collection_entries';

	protected $fillable = [
		'collection_id',
		'work_id',
	];
}
