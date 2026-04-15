<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('inventories', function (Blueprint $table) {
            $table->id();
            $table->string('inventory_code')->unique()->index(); // Used for QR Codes
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('current_status_id')->constrained('inventory_statuses')->restrictOnDelete();
            $table->integer('quantity');
            $table->foreignId('location_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventories');
    }
};
