<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model {
	use HasFactory, HasUuids;

	protected $fillable = [
		'sender_id',
		'receiver_id',
		'text',
		'work_id',
	];

	public function sender() {
		return $this->belongsTo(User::class, 'sender_id');
	}

	public function receiver() {
		return $this->belongsTo(User::class, 'receiver_id');
	}

	public function work() {
		return $this->belongsTo(Work::class, 'work_id');
	}
}
