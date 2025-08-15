<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Work;
use App\Models\Profile;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder {
	/**
	 * Seed the application's database.
	 */
	public function run(): void {
		$this->call([
			LanguageSeeder::class,
		]);

		// for testing
		$staticUser1 = User::factory()->create([
			'name' => '1',
			'email' => 'static@example.com',
		]);

		$staticUser2 = User::factory()->create([
			'name' => '2',
			'email' => 'static2@example.com',
		]);

		$randomUsers = User::factory(18)->create();
		$friends = $randomUsers
			->whereNotIn('id', [$staticUser1->id])
			->random(10);

		$staticUser1->friends()->attach($friends->pluck('id'));

		$allUsers = collect([$staticUser1, $staticUser2])->merge($randomUsers);
		$allUsers->each(function ($user) {
			$user->profile()->create(Profile::factory()->make()->toArray());
		});

		User::factory()->create(['name' => 'empty', 'email' => 'empty@example.com'])->profile()->create(Profile::factory()->make()->toArray());

		Work::factory(500)
			->recycle($allUsers->all())
			->create();
	}
}
