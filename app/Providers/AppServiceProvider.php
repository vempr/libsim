<?php

namespace App\Providers;

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
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
		$this->app[Kernel::class]->prependMiddleware(
			function (Request $request, $next) {
				$request->setTrustedProxies(
					['*'], // Trust all proxies
					Request::HEADER_X_FORWARDED_FOR |
						Request::HEADER_X_FORWARDED_HOST |
						Request::HEADER_X_FORWARDED_PORT |
						Request::HEADER_X_FORWARDED_PROTO |
						Request::HEADER_X_FORWARDED_AWS_ELB
				);
				return $next($request);
			}
		);

		if ($this->app->environment('production')) {
			URL::forceScheme('https');
		}
	}
}
