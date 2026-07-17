<?php

namespace Tests\Feature\Domain\Purchase;

use App\Models\Business;
use App\Models\User;
use App\Models\Category;
use App\Models\Product;
use App\Models\InventoryStatus;
use App\Domain\Purchase\Models\Supplier;
use App\Domain\Purchase\Models\Purchase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class PurchaseTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Business $business;
    protected Category $category;
    protected Product $product;
    protected Supplier $supplier;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->business = Business::create([
            'name' => 'Test UMKM Purchase',
            'email' => 'purchase@test.com',
            'phone' => '08123456789',
            'address' => 'Jl. Test No. 1',
            'website' => 'https://test.com',
        ]);

        $this->user = User::factory()->create([
            'bussiness_id' => $this->business->id,
        ]);

        foreach (['Tambah Supplier', 'Lihat Supplier', 'Ubah Supplier', 'Hapus Supplier', 'Tambah Pembelian', 'Lihat Pembelian'] as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'api']);
        }

        $this->user->givePermissionTo(['Tambah Supplier', 'Lihat Supplier', 'Ubah Supplier', 'Hapus Supplier', 'Tambah Pembelian', 'Lihat Pembelian']);

        $this->token = JWTAuth::fromUser($this->user);

        $this->category = Category::create([
            'name' => 'Bahan Baku Purchase',
            'bussiness_id' => $this->business->id,
        ]);

        $this->product = Product::create([
            'name' => 'Tepung Mentah',
            'sku' => 'TPG-PUR-001',
            'selling_price' => 15000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'kg',
            'bussiness_id' => $this->business->id,
        ]);

        InventoryStatus::firstOrCreate([
            'code' => 'UNRELEASED'
        ], [
            'name' => 'Belum Dirilis',
            'description' => 'Stok baru masuk belum dirilis'
        ]);

        $this->supplier = Supplier::create([
            'name' => 'PT Supplier Utama',
            'phone' => '0899999999',
            'address' => 'Jl. Supplier No. 10',
            'bussiness_id' => $this->business->id,
        ]);
    }

    public function test_can_create_supplier(): void
    {
        $payload = [
            'name'    => 'CV Mitra Sejati',
            'phone'   => '0888888888',
            'address' => 'Jl. Mitra No. 5',
        ];

        $response = $this->withToken($this->token)->postJson('/api/suppliers', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.name', 'CV Mitra Sejati');

        $this->assertDatabaseHas('suppliers', [
            'name' => 'CV Mitra Sejati',
            'bussiness_id' => $this->business->id,
        ]);
    }

    public function test_can_create_purchase(): void
    {
        $payload = [
            'supplier_id'   => $this->supplier->id,
            'purchase_date' => '2026-07-16',
            'notes'         => 'Pembelian stok awal',
            'items'         => [
                [
                    'product_id' => $this->product->id,
                    'quantity'   => 50,
                    'price'      => 12000,
                ]
            ],
        ];

        $response = $this->withToken($this->token)->postJson('/api/purchases', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('data.total_amount', '600000.00');

        $this->assertDatabaseHas('purchases', [
            'supplier_id' => $this->supplier->id,
            'bussiness_id' => $this->business->id,
        ]);

        $this->assertDatabaseHas('purchase_items', [
            'product_id' => $this->product->id,
            'quantity' => 50,
        ]);
    }
}
