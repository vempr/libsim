<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model {
	protected $fillable = ['sender_id', 'receiver_id', 'mood', 'title', 'description', 'image'];
}
