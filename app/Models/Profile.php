<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model {
	use HasFactory;

	protected $fillable = [
		'user_id',
		'introduction',
		'description',
		'good_tags',
		'neutral_tags',
		'bad_tags',
	];

	public static $indexFields = [
		'user_id',
		'introduction',
		'good_tags',
	];

	public static $profileFields = [
		'user_id',
		'introduction',
		'description',
		'good_tags',
		'neutral_tags',
		'bad_tags',
	];

	public static $ownFields = [
		'user_id',
		'introduction',
		'description',
		'good_tags',
		'neutral_tags',
		'bad_tags',
		'updated_at'
	];
}
