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
        if (!Schema::hasColumn('locations', 'bussiness_id')) {
            Schema::table('locations', function (Blueprint $table) {
                $table->unsignedBigInteger('bussiness_id')->nullable()->after('id');
                $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
                $table->index('bussiness_id');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('locations', 'bussiness_id')) {
            Schema::table('locations', function (Blueprint $table) {
                $table->dropForeign(['bussiness_id']);
                $table->dropColumn('bussiness_id');
            });
        }
    }
};
