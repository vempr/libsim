<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;

class WorkPolicy {
	public function viewAny(User $user): bool {
		return false;
	}

	public function view(User $user, Work $work): bool {
		$creatorId = $work->user_id;

		$isOwnWork = $user->id === $creatorId;
		if ($isOwnWork) {
			return true;
		}

		$creator = User::find($creatorId);
		$isFriend = $user->allFriends()->contains($creator);
		return $isFriend && $creator->private_works === 0 && $creator->hide_profile === 0;
	}

	public function edit(User $user, Work $work): bool {
		return $user->id === $work->user_id;
	}

	public function update(User $user, Work $work): bool {
		return $user->id === $work->user_id;
	}

	public function delete(User $user, Work $work): bool {
		return $user->id === $work->user_id;
	}
}
