<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventory_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // UNRELEASED, ON_HOLD, REJECT, READY
            $table->string('name');
            $table->boolean('is_usable')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_statuses');
    }
};
