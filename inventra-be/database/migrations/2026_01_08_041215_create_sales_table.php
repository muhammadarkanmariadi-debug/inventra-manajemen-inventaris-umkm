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
            
            $table->unsignedBigInteger('inventory_id')->nullable();
            $table->foreign('inventory_id')->references('id')->on('inventories')->onDelete('set null');

            $table->integer('quantity');
            $table->decimal('selling_price', 12, 2);
            $table->decimal('total_price', 14, 2);
            
            $table->string('buyer_name')->nullable();
            $table->string('buyer_phone')->nullable();
            $table->text('buyer_address')->nullable();
            
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
