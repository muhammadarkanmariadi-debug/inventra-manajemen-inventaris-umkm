<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new product.
     */
    public function store(Request $request)
    {
        try {
            $userBusinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name'          => 'required|string|max:255',
                'sku'           => 'required|string|max:255|unique:products,sku',
                'selling_price' => 'required|numeric|min:0',
                'stock'         => 'required|integer|min:0',
                'category_id'   => 'required|integer|exists:categories,id',
                'product_type'  => 'required|in:kuliner,barang',
                'unit'          => 'required|string|max:255',
                'expired_date'  => 'nullable|date',
                'supplier_id'   => 'nullable|array',
                'supplier_id.*' => 'integer|exists:suppliers,id',
            ];

            $request->merge(['bussiness_id' => $userBusinessId]);

            $data = $this->requestService->postData(Product::class, $request, $rules);

            if ($request->has('supplier_id')) {
                $data->suppliers()->attach($request->input('supplier_id', []));
            }

            if (!$data) {
                return ApiHelper::error('Gagal membuat Data Product', 500);
            }

            event(new LoggingEvent('Product created successfully', 'products'));

            return ApiHelper::success('Data Product berhasil dibuat', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all products.
     */
    public function index(Request $request)
    {
        try {
            $products = Cache::remember('products', 60, function () {
                return Product::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                if (in_array('category', $includes)) {
                    $products->load('category');
                }
                if (in_array('suppliers', $includes)) {
                    $products->load('suppliers');
                }
            }

            if ($products->isEmpty()) {
                return ApiHelper::error('No products found', 404);
            }

            return ApiHelper::success('Products retrieved successfully', $products, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a product by ID.
     */
    public function show($id)
    {
        try {
            $product = Product::with(['category', 'suppliers'])
                ->where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$product) {
                return ApiHelper::error('Product not found', 404);
            }

            return ApiHelper::success('Product retrieved successfully', $product, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a product by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'          => 'sometimes|required|string|max:255',
                'sku'           => 'sometimes|required|string|max:255|unique:products,sku,' . $id,
                'selling_price' => 'sometimes|required|numeric|min:0',
                'stock'         => 'sometimes|required|integer|min:0',
                'category_id'   => 'sometimes|required|integer|exists:categories,id',
                'product_type'  => 'sometimes|required|in:kuliner,barang',
                'unit'          => 'sometimes|required|string|max:255',
                'expired_date'  => 'sometimes|nullable|date',
                'supplier_id'   => 'sometimes|nullable|array',
                'supplier_id.*' => 'integer|exists:suppliers,id',
            ];

            $data = $this->requestService->updateDataById(Product::class, $id, $request, $rules);

            if ($request->has('supplier_id')) {
                $data->suppliers()->sync($request->input('supplier_id', []));
            }

            if (!$data) {
                return ApiHelper::error('Failed to update product', 500);
            }

            event(new LoggingEvent('Product with id ' . $id . ' updated successfully', 'products'));

            return ApiHelper::success('Product updated successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a product by ID.
     */
    public function destroy($id)
    {
        try {
            $product = $this->requestService->deleteDataById(Product::class, $id);

            if (!$product) {
                return ApiHelper::error('Product not found', 404);
            }

            $product->suppliers()->detach();

            event(new LoggingEvent('Product with id ' . $id . ' deleted successfully', 'products'));

            return ApiHelper::success('Product deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
