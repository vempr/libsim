<?php

namespace App\Providers;

use App\Models\Work;
use App\Policies\WorkPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Validation\Rules\Password;

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
		Password::defaults(function () {
			return Password::min(8)
				->max(255)
				->letters()
				->mixedCase()
				->numbers()
				->symbols()
				->uncompromised();
		});

		$this->registerPolicies();
	}
}
