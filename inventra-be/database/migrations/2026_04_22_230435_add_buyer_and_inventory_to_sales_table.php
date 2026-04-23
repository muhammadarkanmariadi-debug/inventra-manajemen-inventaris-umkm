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
        Schema::table('sales', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_id')->nullable()->after('product_id');
            $table->string('buyer_name')->nullable()->after('inventory_id');
            $table->string('buyer_phone')->nullable()->after('buyer_name');
            $table->text('buyer_address')->nullable()->after('buyer_phone');

            $table->foreign('inventory_id')->references('id')->on('inventories')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['inventory_id']);
            $table->dropColumn(['inventory_id', 'buyer_name', 'buyer_phone', 'buyer_address']);
        });
    }
};
