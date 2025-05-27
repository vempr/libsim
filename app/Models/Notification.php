<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model {
	protected $fillable = ['type', 'sender_id', 'receiver_id', 'mood', 'title', 'description', 'image'];
}
