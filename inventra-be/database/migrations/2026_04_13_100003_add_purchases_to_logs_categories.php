<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE logs MODIFY COLUMN categories ENUM('users', 'products', 'suppliers', 'categories', 'financialTransactions', 'hppComponents', 'stockTransactions', 'financialCategories', 'sales', 'purchases') NOT NULL");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE logs MODIFY COLUMN categories ENUM('users', 'products', 'suppliers', 'categories', 'financialTransactions', 'hppComponents', 'stockTransactions', 'financialCategories', 'sales') NOT NULL");
    }
};
