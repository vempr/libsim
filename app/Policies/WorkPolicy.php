<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;

class WorkPolicy {
	public function view(User $user, Work $work): bool {
		$creatorId = $work->user_id;

		$isOwnWork = $user->id === $creatorId;
		if ($isOwnWork) {
			return true;
		}

		$creator = User::find($creatorId);
		$isFriend = $user->allFriends()->contains($creator);

		if ($creator->private_works === 1) {
			return false;
		}

		return $isFriend || $creator->hide_profile === 0;
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
