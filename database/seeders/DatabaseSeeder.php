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

		Work::factory(20)->recycle(User::factory(2)->create())->create();
	}
}
