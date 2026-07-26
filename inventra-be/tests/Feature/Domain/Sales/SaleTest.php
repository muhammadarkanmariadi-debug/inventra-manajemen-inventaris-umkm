<?php

namespace Tests\Feature\Domain\Sales;

use App\Models\Business;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\Inventory;
use App\Models\InventoryStatus;
use App\Domain\Sales\Models\Sale;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class SaleTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Business $business;
    protected Category $category;
    protected Product $product;
    protected Inventory $inventory;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->business = Business::create([
            'name' => 'Test UMKM Sales',
            'email' => 'sales@test.com',
            'phone' => '08123456789',
            'address' => 'Jl. Test No. 1',
            'website' => 'https://test.com',
        ]);

        $this->user = User::factory()->create([
            'bussiness_id' => $this->business->id,
        ]);

        foreach (['Tambah Penjualan', 'Lihat Penjualan', 'Ubah Penjualan', 'Hapus Penjualan'] as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'api']);
        }

        $this->user->givePermissionTo(['Tambah Penjualan', 'Lihat Penjualan', 'Ubah Penjualan', 'Hapus Penjualan']);

        $this->token = JWTAuth::fromUser($this->user);

        $this->category = Category::create([
            'name' => 'Produk Jadi',
            'bussiness_id' => $this->business->id,
        ]);

        $this->product = Product::create([
            'name' => 'Kue Kering',
            'sku' => 'KUE-001',
            'selling_price' => 50000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'box',
            'bussiness_id' => $this->business->id,
        ]);

        $readyStatus = InventoryStatus::firstOrCreate([
            'code' => 'READY'
        ], [
            'name' => 'Siap Jual',
            'description' => 'Siap untuk dijual'
        ]);

        $this->inventory = Inventory::create([
            'inventory_code' => 'INV-READY-001',
            'product_id' => $this->product->id,
            'current_status_id' => $readyStatus->id,
            'quantity' => 100,
        ]);
    }

    public function test_can_create_sale(): void
    {
        $payload = [
            'inventory_id'  => $this->inventory->id,
            'quantity'      => 5,
            'selling_price' => 50000,
            'buyer_name'    => 'Pelanggan 1',
        ];

        $response = $this->withToken($this->token)->postJson('/api/sales', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['status', 'message', 'data' => ['id', 'quantity', 'total_price']]);

        $this->assertDatabaseHas('sales', [
            'inventory_id' => $this->inventory->id,
            'quantity' => 5,
            'bussiness_id' => $this->business->id,
        ]);

        $this->assertDatabaseHas('inventories', [
            'id' => $this->inventory->id,
            'quantity' => 95,
        ]);
    }

    public function test_can_list_sales(): void
    {
        Sale::create([
            'product_id' => $this->product->id,
            'inventory_id' => $this->inventory->id,
            'quantity' => 2,
            'selling_price' => 50000,
            'total_price' => 100000,
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->getJson('/api/sales');

        $response->assertStatus(200)
            ->assertJsonPath('data.data.0.quantity', 2);
    }

    public function test_can_show_sale(): void
    {
        $sale = Sale::create([
            'product_id' => $this->product->id,
            'inventory_id' => $this->inventory->id,
            'quantity' => 3,
            'selling_price' => 50000,
            'total_price' => 150000,
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->getJson("/api/sales/{$sale->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $sale->id);
    }

    public function test_can_delete_sale_and_return_stock(): void
    {
        $sale = Sale::create([
            'product_id' => $this->product->id,
            'inventory_id' => $this->inventory->id,
            'quantity' => 4,
            'selling_price' => 50000,
            'total_price' => 200000,
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->deleteJson("/api/sales/{$sale->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('sales', [
            'id' => $sale->id,
        ]);
    }
}
