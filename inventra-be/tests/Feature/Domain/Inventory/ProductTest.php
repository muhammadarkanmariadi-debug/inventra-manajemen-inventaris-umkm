<?php

namespace Tests\Feature\Domain\Inventory;

use App\Models\Business;
use App\Models\User;
use App\Domain\Inventory\Models\Category;
use App\Domain\Inventory\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Business $business;
    protected Category $category;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->business = Business::create([
            'name' => 'Test UMKM',
            'email' => 'umkm@test.com',
            'phone' => '08123456789',
            'address' => 'Jl. Test No. 1',
            'website' => 'https://test.com',
        ]);

        $this->user = User::factory()->create([
            'bussiness_id' => $this->business->id,
        ]);

        foreach (['Tambah Produk', 'Lihat Produk', 'Ubah Produk', 'Hapus Produk'] as $perm) {
            Permission::firstOrCreate(['name' => $perm, 'guard_name' => 'api']);
        }

        $this->user->givePermissionTo(['Tambah Produk', 'Lihat Produk', 'Ubah Produk', 'Hapus Produk']);

        $this->token = JWTAuth::fromUser($this->user);

        $this->category = Category::create([
            'name' => 'Bahan Baku',
            'bussiness_id' => $this->business->id,
        ]);
    }

    public function test_can_create_product(): void
    {
        $payload = [
            'name' => 'Tepung Terigu 1kg',
            'sku' => 'TPG-001',
            'selling_price' => 15000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'kg',
        ];

        $response = $this->withToken($this->token)->postJson('/api/products', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['status', 'message', 'data' => ['id', 'name', 'sku']]);

        $this->assertDatabaseHas('products', [
            'sku' => 'TPG-001',
            'bussiness_id' => $this->business->id,
        ]);
    }

    public function test_can_list_products(): void
    {
        Product::create([
            'name' => 'Gula Pasir 1kg',
            'sku' => 'GL-001',
            'selling_price' => 18000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'kg',
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonPath('data.data.0.sku', 'GL-001');
    }

    public function test_can_show_product(): void
    {
        $product = Product::create([
            'name' => 'Minyak Goreng 2L',
            'sku' => 'MYK-001',
            'selling_price' => 35000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'liter',
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->getJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Minyak Goreng 2L');
    }

    public function test_can_update_product(): void
    {
        $product = Product::create([
            'name' => 'Kopi Bubuk 250g',
            'sku' => 'KP-001',
            'selling_price' => 25000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'pack',
            'bussiness_id' => $this->business->id,
        ]);

        $payload = [
            'name' => 'Kopi Bubuk Premium 250g',
            'sku' => 'KP-001',
            'selling_price' => 30000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'pack',
        ];

        $response = $this->withToken($this->token)->putJson("/api/products/{$product->id}", $payload);

        $response->assertStatus(200)
            ->assertJsonPath('data.name', 'Kopi Bubuk Premium 250g');

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'selling_price' => 30000,
        ]);
    }

    public function test_can_delete_product(): void
    {
        $product = Product::create([
            'name' => 'Garam Dapur 500g',
            'sku' => 'GRM-001',
            'selling_price' => 5000,
            'category_id' => $this->category->id,
            'product_type' => 'kuliner',
            'unit' => 'pack',
            'bussiness_id' => $this->business->id,
        ]);

        $response = $this->withToken($this->token)->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    public function test_cannot_access_products_unauthenticated(): void
    {
        $response = $this->getJson('/api/products');
        $response->assertStatus(401);
    }
}
