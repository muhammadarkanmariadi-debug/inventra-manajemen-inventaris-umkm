<?php

namespace App\Domain\Inventory\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Inventory\Models\Product;
use App\Domain\Inventory\Http\Requests\ProductRequest;
use App\Domain\Inventory\Actions\CreateProductAction;
use App\Domain\Inventory\Actions\UpdateProductAction;
use App\Services\RequestService;
use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    protected RequestService $requestService;
    protected CreateProductAction $createProductAction;
    protected UpdateProductAction $updateProductAction;

    public function __construct(
        RequestService $requestService,
        CreateProductAction $createProductAction,
        UpdateProductAction $updateProductAction
    ) {
        $this->requestService = $requestService;
        $this->createProductAction = $createProductAction;
        $this->updateProductAction = $updateProductAction;
    }

    public function store(ProductRequest $request)
    {
        try {
            $user = auth()->guard('api')->user();
            $data = $request->validated();
            
            $product = $this->createProductAction->execute($data, $user->bussiness_id, $user->id);

            event(new LoggingEvent('Product created successfully', 'products'));

            return ApiHelper::success('Data Product berhasil dibuat', $product, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $query = Product::where('bussiness_id', auth()->guard('api')->user()->bussiness_id);

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
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $product = Product::with(['category'])
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

    public function update(ProductRequest $request, $id)
    {
        try {
            $user = auth()->guard('api')->user();
            $product = $this->updateProductAction->execute((int) $id, $request->validated(), $user->bussiness_id);

            event(new LoggingEvent('Product with id ' . $id . ' updated successfully', 'products'));

            return ApiHelper::success('Product updated successfully', $product, 200);
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;
            return ApiHelper::error($e->getMessage(), $code);
        }
    }

    public function destroy($id)
    {
        try {
            /** @var Product|null $product */
            $product = Product::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$product) {
                return ApiHelper::error('Product not found', 404);
            }

            $product->delete();

            event(new LoggingEvent('Product with id ' . $id . ' deleted successfully', 'products'));

            return ApiHelper::success('Product deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
