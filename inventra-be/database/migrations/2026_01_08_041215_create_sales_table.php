<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('selling_price', 12, 2);
            $table->decimal('total_price', 14, 2);
            $table->decimal('hpp', 14, 2);
            $table->decimal('profit', 14, 2);
            $table->timestamps();
            $table->unsignedBigInteger('bussiness_id');
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
