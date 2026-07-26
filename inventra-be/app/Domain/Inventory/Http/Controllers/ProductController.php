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

            // Always include category if requested or by default for UI consistency
            $includes = $request->has('include') ? explode(',', $request->query('include')) : ['category'];
            if (in_array('category', $includes)) {
                $query->with('category');
            }

            // Compute total_stock via subquery for accurate stock filtering and sorting
            $query->withSum(['inventories as total_stock' => function ($q) {
                $q->whereHas('status', function ($sq) {
                    $sq->where('is_usable', true);
                });
            }], 'quantity');

            // Search filter
            if ($request->filled('search')) {
                $search = $request->query('search');
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('sku', 'like', "%{$search}%");
                });
            }

            // Category filter
            if ($request->filled('category_id')) {
                $query->where('category_id', $request->query('category_id'));
            } elseif ($request->filled('category')) {
                $query->where('category_id', $request->query('category'));
            }

            // Product type filter
            if ($request->filled('product_type') && in_array($request->query('product_type'), ['kuliner', 'barang'], true)) {
                $query->where('product_type', $request->query('product_type'));
            } elseif ($request->filled('type') && in_array(strtolower($request->query('type')), ['kuliner', 'barang'], true)) {
                $query->where('product_type', strtolower($request->query('type')));
            }

            // Stock status filter
            if ($request->filled('stock_status')) {
                $stockStatus = strtolower($request->query('stock_status'));
                if ($stockStatus === 'habis' || $stockStatus === 'out_of_stock' || $stockStatus === '0') {
                    $query->havingRaw('COALESCE(total_stock, 0) <= 0');
                } elseif ($stockStatus === 'kritis' || $stockStatus === 'critical') {
                    $query->havingRaw('COALESCE(total_stock, 0) > 0 AND COALESCE(total_stock, 0) <= 5');
                } elseif ($stockStatus === 'rendah' || $stockStatus === 'low') {
                    $query->havingRaw('COALESCE(total_stock, 0) > 5 AND COALESCE(total_stock, 0) <= 15');
                } elseif ($stockStatus === 'sedang' || $stockStatus === 'medium') {
                    $query->havingRaw('COALESCE(total_stock, 0) > 15 AND COALESCE(total_stock, 0) <= 50');
                } elseif ($stockStatus === 'aman' || $stockStatus === 'safe') {
                    $query->havingRaw('COALESCE(total_stock, 0) > 50');
                }
            }

            // Sorting with strict allow-list validation
            $allowedSorts = ['name', 'sku', 'selling_price', 'price', 'stock', 'created_at', 'expired_date'];
            $sort = $request->query('sort');
            $order = strtolower($request->query('order', 'desc')) === 'asc' ? 'asc' : 'desc';

            if ($sort && in_array($sort, $allowedSorts, true)) {
                if ($sort === 'price') {
                    $query->orderBy('selling_price', $order);
                } elseif ($sort === 'stock') {
                    $query->orderByRaw("COALESCE(total_stock, 0) {$order}");
                } else {
                    $query->orderBy($sort, $order);
                }
            } else {
                $query->latest('id');
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
