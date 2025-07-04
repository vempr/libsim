<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail {
	/** @use HasFactory<\Database\Factories\UserFactory> */
	use HasFactory, Notifiable, HasUuids;

	/**
	 * The attributes that are mass assignable.
	 *
	 * @var list<string>
	 */
	protected $fillable = [
		'hide_profile',
		'private_works',
		'name',
		'email',
		'password',
	];

	/**
	 * The attributes that should be hidden for serialization.
	 *
	 * @var list<string>
	 */
	protected $hidden = [
		'password',
		'remember_token',
	];

	/**
	 * Get the attributes that should be cast.
	 *
	 * @return array<string, string>
	 */
	protected function casts(): array {
		return [
			'email_verified_at' => 'datetime',
			'password' => 'hashed',
		];
	}

	public function works() {
		return $this->hasMany(Work::class);
	}

	public function notifications() {
		return $this->hasMany(Notification::class, 'receiver_id', 'id');
	}

	public function collections() {
		return $this->hasMany(Collection::class, 'user_id', 'id');
	}

	public function friends() {
		return $this->belongsToMany(User::class, 'friends', 'user_id', 'friend_id')->withTimestamps();
	}

	public function friendsOf() {
		return $this->belongsToMany(User::class, 'friends', 'friend_id', 'user_id')->withTimestamps();
	}

	public function allFriends() {
		return $this->friends->merge($this->friendsOf);
	}

	public function favoriteWorks() {
		return $this->belongsToMany(Work::class, 'favorites')->withTimestamps();
	}

	public function profile() {
		return $this->hasOne(Profile::class);
	}
}
