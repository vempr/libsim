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
			'name' => 'static user 123',
			'email' => 'static@example.com',
		]);

		$staticUser2 = User::factory()->create([
			'name' => 'static user 124',
			'email' => 'static2@example.com',
		]);

		$randomUsers = User::factory(3)->create();

		Work::factory(50)
			->recycle(array_merge([$staticUser1, $staticUser2], $randomUsers->all()))
			->create();
	}
}
