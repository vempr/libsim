<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Work>
 */
class WorkFactory extends Factory {
	public static $tags = [
		'action',
		'fantasy',
		'adventure',
		'comedy',
		'drama',
		'horror',
		'mystery',
		'romance',
		'thriller',
		'sci-fi',
		'animation',
		'crime',
		'documentary',
		'family',
		'history',
		'music',
		'war',
		'western',
		'biography',
		'sport'
	];

	public static $languages = [
		'ja',
		'en',
		'es',
		'fr',
		'pt',
		'de',
		'it',
		'zh',
		'ko',
		'ru',
		'th',
		'id',
		'vi',
		'pl',
		'tr'
	];

	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array {
		return [
			"user_id" => User::factory(),
			"title" => fake()->sentence(),
			"description" => fake()->paragraph(),
			"status_publication" => fake()->randomElement(['unknown', 'ongoing', 'completed', 'hiatus', 'cancelled']),
			"status_reading" => fake()->randomElement(['reading', 'completed', 'on hold', 'dropped']),
			"author" => fake()->lastName(),
			"language_original" => fake()->randomElement(self::$languages),
			"language_translated" => fake()->randomElement(self::$languages),
			"publication_year" => fake()->year(),
			"image" => null,
			"tags" => implode(',', fake()->randomElements(self::$tags, fake()->numberBetween(1, 5))),
			"links" => "https://mangaexample.com/shadow-crimson|https://en.wikipedia.org/wiki/Manga",
		];
	}
}
