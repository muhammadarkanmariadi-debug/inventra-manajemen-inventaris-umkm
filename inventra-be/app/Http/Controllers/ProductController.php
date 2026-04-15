<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Services\RequestService;
use Illuminate\Http\Request;

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
        $rules = [
            'name'          => 'required|string|max:255',
            'image'         => 'nullable|string',
            'sku'           => 'required|string|max:255|unique:products,sku',
            'selling_price' => 'required|numeric|min:0',
            'category_id'   => 'required|integer|exists:categories,id',
            'product_type'  => 'required|in:kuliner,barang',
            'unit'          => 'required|string|max:255',
            'expired_date'  => 'nullable|date',
        ];

        $request->merge(['bussiness_id' => auth()->guard('api')->user()->bussiness_id]);

        $data = $this->requestService->postData(Product::class, $request, $rules);

        event(new LoggingEvent('Product created successfully', 'products'));

        return ApiHelper::success('Data Product berhasil dibuat', $data, 201);
    }

    /**
     * Get all products.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $query   = Product::where('bussiness_id', auth()->guard('api')->user()->bussiness_id);

        if ($request->has('include')) {
            $includes = explode(',', $request->query('include'));

            if (in_array('category', $includes)) {
                $query->with('category');
            }
        }

        $products = $query->paginate($perPage);

        if ($products->isEmpty()) {
            return ApiHelper::error('No products found', 404);
        }

        return ApiHelper::success('Products retrieved successfully', $products, 200);
    }

    /**
     * Get a product by ID.
     */
    public function show($id)
    {
        $product = Product::with(['category'])
            ->where('id', $id)
            ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->first();

        if (!$product) {
            return ApiHelper::error('Product not found', 404);
        }

        return ApiHelper::success('Product retrieved successfully', $product, 200);
    }

    /**
     * Update a product by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name'          => 'sometimes|required|string|max:255',
            'image'         => 'sometimes|nullable|string',
            'sku'           => 'sometimes|required|string|max:255|unique:products,sku,' . $id,
            'selling_price' => 'sometimes|required|numeric|min:0',
            'category_id'   => 'sometimes|required|integer|exists:categories,id',
            'product_type'  => 'sometimes|required|in:kuliner,barang',
            'unit'          => 'sometimes|required|string|max:255',
            'expired_date'  => 'sometimes|nullable|date',
        ];

        $data = $this->requestService->updateDataById(Product::class, $id, $request, $rules);

        event(new LoggingEvent('Product with id ' . $id . ' updated successfully', 'products'));

        return ApiHelper::success('Product updated successfully', $data, 200);
    }

    /**
     * Delete a product by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(Product::class, $id);

        event(new LoggingEvent('Product with id ' . $id . ' deleted successfully', 'products'));

        return ApiHelper::success('Product deleted successfully', null, 200);
    }
}
