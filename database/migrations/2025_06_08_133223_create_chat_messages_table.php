<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	/**
	 * Run the migrations.
	 */
	public function up(): void {
		Schema::create('chat_messages', function (Blueprint $table) {
			$table->uuid('id')->primary();
			$table->foreignUuid('sender_id')->constrained('users')->onDelete('cascade');
			$table->foreignUuid('receiver_id')->constrained('users')->onDelete('cascade');
			$table->text('text')->nullable();
			$table->boolean('is_deleted')->default(false);

			$table->timestamps();
		});
	}

	/**
	 * Reverse the migrations.
	 */
	public function down(): void {
		Schema::dropIfExists('chat_messages');
	}
};
