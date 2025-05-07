<?php

namespace App\Providers;

use App\Models\Work;
use App\Policies\WorkPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider {
	protected $policies = [
		Work::class => WorkPolicy::class,
	];

	/**
	 * Register any application services.
	 */
	public function register(): void {
		//
	}

	/**
	 * Bootstrap any application services.
	 */
	public function boot(): void {
		$this->registerPolicies();
	}
}
