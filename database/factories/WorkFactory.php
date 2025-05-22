<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Work>
 */
class WorkFactory extends Factory {
	/**
	 * Define the model's default state.
	 *
	 * @return array<string, mixed>
	 */
	public function definition(): array {
		return [
			"user_id" => User::factory(),
			"title" => "Shadow of the Crimson Moon",
			"description" => "In a world haunted by ancient beasts, a lone warrior must uncover forgotten powers to protect a kingdom on the brink of war.",
			"status_publication" => "ongoing",
			"status_reading" => "reading",
			"author" => "Kaito Nakamura",
			"language_original" => "ja",
			"language_translated" => "en",
			"publication_year" => 2023,
			"image" => null,
			"tags" => "action,fantasy,adventure",
			"links" => "https://mangaexample.com/shadow-crimson|https://en.wikipedia.org/wiki/Manga",
		];
	}
}
