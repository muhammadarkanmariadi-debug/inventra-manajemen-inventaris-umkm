<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Disable foreign key constraints to allow truncating
        Schema::disableForeignKeyConstraints();
        DB::table('transaction_items')->truncate();
        DB::table('transactions')->truncate(); 
        Schema::enableForeignKeyConstraints();
        
        DB::statement("ALTER TABLE transactions MODIFY COLUMN type ENUM('ADJUSTMENT_ADD', 'ADJUSTMENT_SUB') NOT NULL");
    }

    public function down(): void
    {
        Schema::disableForeignKeyConstraints();
        DB::table('transaction_items')->truncate();
        DB::table('transactions')->truncate(); 
        Schema::enableForeignKeyConstraints();
        DB::statement("ALTER TABLE transactions MODIFY COLUMN type ENUM('IN', 'OUT') NOT NULL");
    }
};
