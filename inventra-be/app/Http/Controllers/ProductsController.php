<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Products;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache as FacadesCache;
use Symfony\Component\HttpKernel\Attribute\Cache;

use function PHPUnit\Framework\isNumeric;

class ProductsController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createProduct(Request $request)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;


            $rules = [
                'name' => 'required|string|max:255',
                'sku' => 'required|string|max:255|unique:products,sku',
                'selling_price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'category_id' => 'required|integer|exists:categories,id',
                'product_type' => 'required|in:kuliner,barang',
                'unit' => 'required|string|max:255',
                'expired_date' => 'nullable|date',
                'supplier_id' => 'nullable|array',
                'supplier_id.*' => 'integer|exists:suppliers,id',

            ];


            $request->merge(['bussiness_id' => $userbussinessId]);

            $data = $this->requestService->postData(Products::class, $request, $rules);
            if ($request->has('supplier_id')) {
                $data->supplier()->attach($request->input('supplier_id', []));
            }


            if (!$data) {
                return ApiHelper::error('Gagal membuat Data Product', 500);
            } else {
                event(new LoggingEvent('Product with id created successfully', 'products'));
                return ApiHelper::success('Data Product berhasil dibuat', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function getProducts(Request $request)
    {
        try {
            $products = FacadesCache::remember('products', 60, function () {
                return Products::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));
                if (in_array('category', $includes)) {
                    $products->load('category');
                }
                if (in_array('supplier', $includes)) {
                    $products->load('supplier');
                }
            }

            if ($products->isEmpty()) {
                return ApiHelper::error('No products found', 404);
            }
            return ApiHelper::success('Products retrieved successfully', $products, 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }



    public function getProduct($id)
    {
        try {
            $products = Products::with(['category', 'supplier'])->where('id', $id)->where('bussiness_id', auth()->guard('api')->user()->bussiness_id);

            if (!$products) {
                return ApiHelper::error('Product not found', 404);
            }
            return ApiHelper::success('Product retrieved successfully', $products, 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function updateProduct(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'sku' => 'sometimes|required|string|max:255|unique:products,sku,' . $id,
                'selling_price' => 'sometimes|required|numeric|min:0',
                'stock' => 'sometimes|required|integer|min:0',
                'category_id' => 'sometimes|required|integer|exists:categories,id',
                'product_type' => 'sometimes|required|in:kuliner,barang',
                'unit' => 'sometimes|required|string|max:255',
                'expired_date' => 'sometimes|nullable|date',
                'supplier_id' => 'sometimes|nullable|array',
                'supplier_id.*' => 'integer|exists:suppliers,id',

            ];

            $data = $this->requestService->updateDataById(Products::class, $id, $request, $rules);
            if ($request->has('supplier_id')) {
                $data->supplier()->sync($request->input('supplier_id', []));
            }

            if (!$data) {
                return ApiHelper::error('Failed to update product', 500);
            } else {
                event(new LoggingEvent('Product with id ' . $id . ' updated successfully', 'products'));
                return ApiHelper::success('Product updated successfully', $data);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteProduct($id)
    {
        try {
            $product = $this->requestService->deleteDataById(Products::class, $id);
            if (!$product) {
                return ApiHelper::error('Product not found',  404);
            }

            $product->supplier()->detach();
            event(new LoggingEvent('Product with id ' . $id . ' deleted successfully', 'products'));
            return ApiHelper::success('Product deleted successfully', [], 200);
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
