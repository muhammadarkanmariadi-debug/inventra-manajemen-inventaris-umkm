<?php

namespace Tests\Feature\Domain\Subscription;

use App\Models\Business;
use App\Models\User;
use App\Domain\Subscription\Models\Plan;
use App\Domain\Subscription\Models\PlanFeature;
use App\Domain\Subscription\Models\TenantSubscription;
use App\Domain\Inventory\Models\Location;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;
use Carbon\Carbon;

class SubscriptionTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Business $business;
    protected Plan $starterPlan;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->business = Business::create([
            'name' => 'Test Subscription UMKM',
            'email' => 'sub@test.com',
            'phone' => '081122334455',
            'address' => 'Jl. Langganan No. 1',
            'website' => 'https://test.com',
        ]);

        $this->user = User::factory()->create([
            'bussiness_id' => $this->business->id,
            'role' => 'USER',
        ]);

        Permission::firstOrCreate(['name' => 'Tambah Produk', 'guard_name' => 'api']);
        $this->user->givePermissionTo('Tambah Produk');

        $this->token = JWTAuth::fromUser($this->user);

        $this->starterPlan = Plan::create([
            'name' => 'Starter',
            'slug' => 'starter',
            'price_base_monthly' => 199000,
            'max_warehouses' => 1,
        ]);
    }

    public function test_can_retrieve_plans(): void
    {
        $response = $this->getJson('/api/v1/plans');

        $response->assertStatus(200)
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.0.slug', 'starter');
    }

    public function test_can_retrieve_tenant_subscription_and_usage(): void
    {
        TenantSubscription::create([
            'bussiness_id' => $this->business->id,
            'plan_id' => $this->starterPlan->id,
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'current_period_start' => Carbon::now(),
            'current_period_end' => Carbon::now()->addDays(30),
            'warehouse_count_snapshot' => 1,
        ]);

        $response = $this->withToken($this->token)->getJson('/api/v1/tenant/subscription');

        $response->assertStatus(200)
            ->assertJsonPath('status', true)
            ->assertJsonPath('data.usage.max_warehouses', 1);
    }

    public function test_ensure_warehouse_limit_blocks_when_exceeded(): void
    {
        TenantSubscription::create([
            'bussiness_id' => $this->business->id,
            'plan_id' => $this->starterPlan->id, // max_warehouses = 1
            'billing_cycle' => 'monthly',
            'status' => 'active',
            'current_period_start' => Carbon::now(),
            'current_period_end' => Carbon::now()->addDays(30),
            'warehouse_count_snapshot' => 1,
        ]);

        // Create first location (reaches limit of 1)
        Location::create([
            'name' => 'Gudang Utama',
            'bussiness_id' => $this->business->id,
        ]);

        // Try to create second location via API
        $response = $this->withToken($this->token)->postJson('/api/locations', [
            'name' => 'Gudang Cabang 2',
        ]);

        $response->assertStatus(403)
            ->assertJsonPath('status', false)
            ->assertJsonPath('error_code', 'WAREHOUSE_LIMIT_REACHED');
    }
}
