<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('document_number')->unique();
            $table->string('type');       // LPB, BAR, SJ, LBB, LRS
            $table->string('title');
            $table->string('file_path');
            $table->unsignedBigInteger('generated_by');
            $table->unsignedBigInteger('bussiness_id');
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->foreign('generated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
