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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Starter, Professional, Enterprise
            $table->string('slug')->unique(); // starter, professional, enterprise
            $table->unsignedBigInteger('price_base_monthly')->default(0);
            $table->unsignedBigInteger('price_base_annual')->default(0);
            $table->integer('max_warehouses')->default(1);
            $table->boolean('is_custom_quote')->default(false);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('plan_features', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained('plans')->onDelete('cascade');
            $table->string('feature_key'); // mis. qc_workflow, advanced_export, rbac_granular, ai_forecasting, erp_integration
            $table->boolean('enabled')->default(true);
            $table->timestamps();
            $table->unique(['plan_id', 'feature_key']);
        });

        Schema::create('addons', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // AI Forecasting, ERP Integration API
            $table->string('slug')->unique(); // ai_forecasting, erp_integration
            $table->string('pricing_model')->default('flat'); // flat, per_warehouse, per_sku
            $table->unsignedBigInteger('price_monthly')->default(0);
            $table->unsignedBigInteger('price_annual')->default(0);
            $table->text('description')->nullable();
            $table->timestamps();
        });

        Schema::create('tenant_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bussiness_id')->unique();
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
            $table->foreignId('plan_id')->constrained('plans')->onDelete('restrict');
            $table->string('billing_cycle')->default('monthly'); // monthly, annual
            $table->string('status')->default('active'); // active, trial, past_due, canceled
            $table->timestamp('current_period_start')->nullable();
            $table->timestamp('current_period_end')->nullable();
            $table->integer('warehouse_count_snapshot')->default(1);
            $table->timestamps();
        });

        Schema::create('tenant_addon_subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bussiness_id');
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
            $table->foreignId('addon_id')->constrained('addons')->onDelete('cascade');
            $table->string('status')->default('active'); // active, canceled
            $table->timestamp('activated_at')->nullable();
            $table->timestamps();
            $table->unique(['bussiness_id', 'addon_id']);
        });

        Schema::create('usage_logs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('bussiness_id');
            $table->foreign('bussiness_id')->references('id')->on('bussinesses')->onDelete('cascade');
            $table->string('metric_key'); // warehouse_count, sku_count
            $table->integer('value')->default(0);
            $table->string('period')->nullable(); // mis. 2026-07
            $table->timestamps();
            $table->index(['bussiness_id', 'metric_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usage_logs');
        Schema::dropIfExists('tenant_addon_subscriptions');
        Schema::dropIfExists('tenant_subscriptions');
        Schema::dropIfExists('addons');
        Schema::dropIfExists('plan_features');
        Schema::dropIfExists('plans');
    }
};
