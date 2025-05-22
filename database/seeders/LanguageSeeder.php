<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder {
	/**
	 * Seed the application's database.
	 */
	public function run(): void {
		$languages = [
			['code' => 'ja', 'name' => 'Japanese'],
			['code' => 'en', 'name' => 'English'],
			['code' => 'es', 'name' => 'Spanish; Castilian'],
			['code' => 'fr', 'name' => 'French'],
			['code' => 'pt', 'name' => 'Portuguese'],
			['code' => 'de', 'name' => 'German'],
			['code' => 'it', 'name' => 'Italian'],
			['code' => 'zh', 'name' => 'Chinese'],
			['code' => 'ko', 'name' => 'Korean'],
			['code' => 'ru', 'name' => 'Russian'],
			['code' => 'th', 'name' => 'Thai'],
			['code' => 'id', 'name' => 'Indonesian'],
			['code' => 'vi', 'name' => 'Vietnamese'],
			['code' => 'pl', 'name' => 'Polish'],
			['code' => 'tr', 'name' => 'Turkish'],
		];

		DB::table('languages')->insert($languages);
	}
}
