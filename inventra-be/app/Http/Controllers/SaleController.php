<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\HppComponent;
use App\Models\Product;
use App\Models\Sale;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SaleController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new sale.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'product_id'    => 'required|exists:products,id',
                'quantity'      => 'required|integer|min:1',
                'selling_price' => 'required|numeric|min:0',
                'bussiness_id'  => 'required|exists:bussinesses,id',
            ]);

            return DB::transaction(function () use ($request) {
                $product = Product::findOrFail($request->product_id);

                if ($product->stock < $request->quantity) {
                    return ApiHelper::error('Stock tidak cukup', 422);
                }

                $hppPerUnit = HppComponent::where('product_id', $request->product_id)
                    ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->sum('cost');

                if ($hppPerUnit <= 0) {
                    return ApiHelper::error('HPP belum diset untuk produk ini', 422);
                }

                $totalPrice = $request->selling_price * $request->quantity;
                $totalHpp   = $hppPerUnit * $request->quantity;
                $profit     = $totalPrice - $totalHpp;

                $data = Sale::create([
                    'product_id'    => $request->product_id,
                    'user_id'       => auth()->guard('api')->user()->id,
                    'quantity'      => $request->quantity,
                    'selling_price' => $request->selling_price,
                    'total_price'   => $totalPrice,
                    'hpp'           => $totalHpp,
                    'profit'        => $profit,
                    'bussiness_id'  => $request->bussiness_id,
                ]);

                $product->decrement('stock', $request->quantity);

                if (!$data) {
                    return ApiHelper::error('Failed to create sale', 500);
                }

                event(new LoggingEvent('Sale was successfully created', 'sales'));

                return ApiHelper::success('Sale was successfully created', $data, 201);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a sale by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'product_id'    => 'sometimes|exists:products,id',
                'quantity'      => 'sometimes|integer|min:1',
                'selling_price' => 'sometimes|numeric|min:0',
                'bussiness_id'  => 'sometimes|exists:bussinesses,id',
            ]);

            return DB::transaction(function () use ($request, $id) {
                $sale    = Sale::findOrFail($id);
                $product = Product::findOrFail($request->product_id ?? $sale->product_id);

                if ($product->stock + $sale->quantity < $request->quantity) {
                    return ApiHelper::error('Stock tidak cukup', 422);
                }

                $hppPerUnit = HppComponent::where('product_id', $product->id)
                    ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->sum('cost');

                if ($hppPerUnit <= 0) {
                    return ApiHelper::error('HPP belum diset untuk produk ini', 422);
                }

                $sellingPrice = $request->selling_price ?? $sale->selling_price;
                $quantity     = $request->quantity ?? $sale->quantity;
                $totalPrice   = $sellingPrice * $quantity;
                $totalHpp     = $hppPerUnit * $quantity;
                $profit       = $totalPrice - $totalHpp;

                $product->increment('stock', $sale->quantity);

                $sale->update([
                    'product_id'    => $product->id,
                    'user_id'       => auth()->guard('api')->user()->id,
                    'quantity'      => $quantity,
                    'selling_price' => $sellingPrice,
                    'total_price'   => $totalPrice,
                    'hpp'           => $totalHpp,
                    'profit'        => $profit,
                    'bussiness_id'  => $request->bussiness_id ?? $sale->bussiness_id,
                ]);

                $product->decrement('stock', $quantity);

                event(new LoggingEvent('Sale with id: ' . $id . ' updated successfully', 'sales'));

                return ApiHelper::success('Sale was successfully updated', $sale->fresh(), 200);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a sale by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(Sale::class, $id);

            event(new LoggingEvent('Sale with id: ' . $id . ' deleted successfully', 'sales'));

            return ApiHelper::success('Sale was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all sales.
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = Sale::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No sales found', 404);
            }

            return ApiHelper::success('Sales retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a sale by ID.
     */
    public function show($id)
    {
        try {
            $data = Sale::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->first();

            if (!$data) {
                return ApiHelper::error('Sale not found', 404);
            }

            return ApiHelper::success('Sale retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
