<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
	public function up(): void {
		Schema::create('collection_entries', function (Blueprint $table) {
			$table->foreignUuid('collection_id')->constrained()->cascadeOnDelete();
			$table->foreignUuid('work_id')->constrained()->cascadeOnDelete();
			$table->timestamps();

			$table->primary(['collection_id', 'work_id']);
		});
	}

	public function down(): void {
		Schema::dropIfExists('collection_entries');
	}
};
