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
			$table->id();
			$table->foreignIdFor(\App\Models\User::class);
			$table->string("title");
			$table->text("description")->nullable();
			$table->string("status")->nullable();
			$table->string("author")->nullable();
			$table->string("language_original")->nullable();
			$table->string("language_translated")->nullable();
			$table->integer("publication_year")->nullable();
			$table->string("image")->nullable();
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
