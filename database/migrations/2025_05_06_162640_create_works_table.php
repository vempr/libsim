<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void {
		Schema::create('works', function (Blueprint $table) {
			$table->uuid('id')->primary();
			$table->foreignUuid('user_id')
				->constrained()
				->onDelete('cascade');

			$table->string("title");
			$table->text("description")->nullable();
			$table->string("status_publication")->nullable();
			$table->string("status_reading");
			$table->string("author")->nullable();

			$table->string("language_original")->nullable();
			$table->foreign('language_original')->references('code')->on('languages');

			$table->string("language_translated")->nullable();
			$table->foreign('language_translated')->references('code')->on('languages');

			$table->integer("publication_year")->nullable();
			$table->string("tags", 1000)->nullable();
			$table->string("links", 3000)->nullable();

			$table->string("image_self")->nullable();
			$table->string("image")->nullable();
			$table->string("image_public_id")->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void {
		Schema::dropIfExists('works');
	}
};
