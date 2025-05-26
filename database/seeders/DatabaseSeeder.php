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

		$staticUser = User::factory()->create([
			'name' => 'static user 123',
			'email' => 'static@example.com',
		]);

		$staticUser = User::factory()->create([
			'name' => 'static user 124',
			'email' => 'static2@example.com',
		]);

		$randomUsers = User::factory(3)->create();

		Work::factory(50)
			->recycle(array_merge([$staticUser], $randomUsers->all()))
			->create();
	}
}
