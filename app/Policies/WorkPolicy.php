<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Work;
use Illuminate\Auth\Access\Response;

class WorkPolicy {
	/**
	 * Determine whether the user can view any models.
	 */
	public function viewAny(User $user): bool {
		return false;
	}

	/**
	 * Determine whether the user can view the model.
	 */
	public function view(User $user, Work $work): bool {
		return $user->id === $work->user_id;
	}

	/**
	 * Determine whether the user can create models.
	 */
	public function create(User $user): bool {
		return false;
	}

	/**
	 * Determine whether the user can update the model.
	 */
	public function update(User $user, Work $work): bool {
		return false;
	}

	/**
	 * Determine whether the user can delete the model.
	 */
	public function delete(User $user, Work $work): bool {
		return false;
	}

	/**
	 * Determine whether the user can restore the model.
	 */
	public function restore(User $user, Work $work): bool {
		return false;
	}

	/**
	 * Determine whether the user can permanently delete the model.
	 */
	public function forceDelete(User $user, Work $work): bool {
		return false;
	}
}
