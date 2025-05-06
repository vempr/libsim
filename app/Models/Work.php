<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Work extends Model {
	/** @use HasFactory<\Database\Factories\WorkFactory> */
	use HasFactory;

	public function user() {
		return $this->belongsTo(User::class);
	}
}
