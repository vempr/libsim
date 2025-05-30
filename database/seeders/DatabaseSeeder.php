<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Work;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
	/**
	 * Seed the application's database.
	 */
	public function run(): void {
		$this->call([
			LanguageSeeder::class,
		]);

		$staticUser1 = User::factory()->create([
			'name' => '1',
			'email' => 'static@example.com',
		]);

		$staticUser2 = User::factory()->create([
			'name' => '2',
			'email' => 'static2@example.com',
		]);

		$randomUsers = User::factory(48)->create();
		foreach ($randomUsers as $user) {
			$friends = $randomUsers
				->whereNotIn('id', [$user->id])
				->random(35);

			$user->friends()->attach($friends->pluck('id'));
		}

		Work::factory(500)
			->recycle(array_merge([$staticUser1, $staticUser2], $randomUsers->all()))
			->create();
	}
}
