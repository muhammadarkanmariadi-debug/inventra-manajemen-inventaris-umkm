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
        Schema::table('logs', function (Blueprint $table) {
            $table->string('categories')->change();
            $table->unsignedBigInteger('bussiness_id')->after('user_id')->nullable();
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
            $table->index(['user_id', 'bussiness_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('logs', function (Blueprint $table) {
            $table->dropForeign(['bussiness_id']);
            $table->dropColumn('bussiness_id');
            // Reverting to enum might be tricky if data exists, but we'll try to revert to the previous enum set
            // DB::statement("ALTER TABLE logs MODIFY COLUMN categories ENUM('users', 'products', 'suppliers', 'categories', 'financialTransactions', 'hppComponents', 'stockTransactions', 'financialCategories', 'sales', 'purchases') NOT NULL");
        });
    }
};
