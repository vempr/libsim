<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void {
		Schema::create('profiles', function (Blueprint $table) {
			$table->foreignUuid('user_id')->primary()->constrained('users')->cascadeOnDelete();

			$table->string('introduction')->nullable();
			$table->string('description')->nullable();

			$table->string('good_tags')->nullable();
			$table->string('neutral_tags')->nullable();
			$table->string('bad_tags')->nullable();

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void {
		Schema::dropIfExists('profiles');
	}
};
