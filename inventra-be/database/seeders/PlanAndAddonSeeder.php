<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Domain\Subscription\Models\Plan;
use App\Domain\Subscription\Models\PlanFeature;
use App\Domain\Subscription\Models\Addon;
use App\Domain\Subscription\Models\TenantSubscription;
use App\Models\Business;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PlanAndAddonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Plans
        $starter = Plan::updateOrCreate(['slug' => 'starter'], [
            'name' => 'Starter',
            'price_base_monthly' => 199000,
            'price_base_annual' => 1990000,
            'max_warehouses' => 1,
            'is_custom_quote' => false,
            'description' => 'Ideal untuk UMKM dan toko tunggal yang baru memulai sistem inventaris digital.'
        ]);

        $professional = Plan::updateOrCreate(['slug' => 'professional'], [
            'name' => 'Professional',
            'price_base_monthly' => 499000,
            'price_base_annual' => 4990000,
            'max_warehouses' => 5,
            'is_custom_quote' => false,
            'description' => 'Solusi tepat untuk bisnis berkembang dengan beberapa cabang gudang dan tim operasional.'
        ]);

        $enterprise = Plan::updateOrCreate(['slug' => 'enterprise'], [
            'name' => 'Enterprise',
            'price_base_monthly' => 0,
            'price_base_annual' => 0,
            'max_warehouses' => 999,
            'is_custom_quote' => true,
            'description' => 'Paket skala penuh dengan batas gudang kustom, integrasi ERP, dan fitur AI analitik tingkat lanjut.'
        ]);

        // 2. Seed Plan Features
        $featuresList = [
            'qc_workflow' => ['starter' => false, 'professional' => true, 'enterprise' => true],
            'advanced_export' => ['starter' => false, 'professional' => true, 'enterprise' => true],
            'rbac_granular' => ['starter' => false, 'professional' => true, 'enterprise' => true],
            'ai_forecasting' => ['starter' => false, 'professional' => false, 'enterprise' => true],
            'erp_integration' => ['starter' => false, 'professional' => false, 'enterprise' => true],
        ];

        foreach ($featuresList as $key => $eligibility) {
            PlanFeature::updateOrCreate(['plan_id' => $starter->id, 'feature_key' => $key], ['enabled' => $eligibility['starter']]);
            PlanFeature::updateOrCreate(['plan_id' => $professional->id, 'feature_key' => $key], ['enabled' => $eligibility['professional']]);
            PlanFeature::updateOrCreate(['plan_id' => $enterprise->id, 'feature_key' => $key], ['enabled' => $eligibility['enterprise']]);
        }

        // 3. Seed Addons
        Addon::updateOrCreate(['slug' => 'ai_forecasting'], [
            'name' => 'AI Forecasting',
            'pricing_model' => 'flat',
            'price_monthly' => 150000,
            'price_annual' => 1500000,
            'description' => 'Prediksi kebutuhan stok dan analisis tren penjualan otomatis menggunakan Gemini AI.'
        ]);

        Addon::updateOrCreate(['slug' => 'erp_integration'], [
            'name' => 'ERP Integration API',
            'pricing_model' => 'flat',
            'price_monthly' => 250000,
            'price_annual' => 2500000,
            'description' => 'Akses penuh ke REST API & Webhook untuk menyinkronkan data dengan SAP, Odoo, atau sistem ERP lainnya.'
        ]);

        // 4. Seed 3 Demo Businesses & Users for Testing
        // Starter Demo
        $starterBiz = Business::firstOrCreate(['name' => 'Bisnis Starter Demo'], [
            'address' => 'Jl. Starter No. 1, Jakarta',
            'phone' => '0811111111',
            'email' => 'contact@starterdemo.com',
            'website' => 'www.starterdemo.com',
            'description' => 'Bisnis demo untuk tier Starter'
        ]);
        $starterUser = User::updateOrCreate(['email' => 'starter@demo.com'], [
            'username' => 'Starter Demo User',
            'password' => Hash::make('demo1234'),
            'role' => 'USER',
            'bussiness_id' => $starterBiz->id,
        ]);
        if (method_exists($starterUser, 'syncRoles')) {
            $starterUser->syncRoles(['manager']);
        }
        TenantSubscription::updateOrCreate(['bussiness_id' => $starterBiz->id], [
            'plan_id' => $starter->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'current_period_start' => Carbon::now(),
            'current_period_end' => Carbon::now()->addDays(30),
            'warehouse_count_snapshot' => $starter->max_warehouses,
        ]);

        // Professional Demo
        $proBiz = Business::firstOrCreate(['name' => 'Bisnis Professional Demo'], [
            'address' => 'Jl. Professional No. 5, Surabaya',
            'phone' => '0822222222',
            'email' => 'contact@prodemo.com',
            'website' => 'www.prodemo.com',
            'description' => 'Bisnis demo untuk tier Professional'
        ]);
        $proUser = User::updateOrCreate(['email' => 'pro@demo.com'], [
            'username' => 'Professional Demo User',
            'password' => Hash::make('demo1234'),
            'role' => 'USER',
            'bussiness_id' => $proBiz->id,
        ]);
        if (method_exists($proUser, 'syncRoles')) {
            $proUser->syncRoles(['manager']);
        }
        TenantSubscription::updateOrCreate(['bussiness_id' => $proBiz->id], [
            'plan_id' => $professional->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'current_period_start' => Carbon::now(),
            'current_period_end' => Carbon::now()->addDays(30),
            'warehouse_count_snapshot' => $professional->max_warehouses,
        ]);

        // Enterprise Demo
        $entBiz = Business::firstOrCreate(['name' => 'Bisnis Enterprise Demo'], [
            'address' => 'Jl. Enterprise Tower Lt. 10, Bandung',
            'phone' => '0833333333',
            'email' => 'contact@enterprisedemo.com',
            'website' => 'www.enterprisedemo.com',
            'description' => 'Bisnis demo untuk tier Enterprise'
        ]);
        $entUser = User::updateOrCreate(['email' => 'enterprise@demo.com'], [
            'username' => 'Enterprise Demo User',
            'password' => Hash::make('demo1234'),
            'role' => 'USER',
            'bussiness_id' => $entBiz->id,
        ]);
        if (method_exists($entUser, 'syncRoles')) {
            $entUser->syncRoles(['manager']);
        }
        TenantSubscription::updateOrCreate(['bussiness_id' => $entBiz->id], [
            'plan_id' => $enterprise->id,
            'billing_cycle' => 'annual',
            'status' => 'active',
            'current_period_start' => Carbon::now(),
            'current_period_end' => Carbon::now()->addYear(),
            'warehouse_count_snapshot' => $enterprise->max_warehouses,
        ]);
    }
}
