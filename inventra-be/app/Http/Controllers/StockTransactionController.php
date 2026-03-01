<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Products;
use App\Models\StockTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockTransactionController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createStockTransaction(Request $request)
    {
        try {
            $rules = [
                'product_id' => 'required|integer|exists:products,id',
                'quantity'   => 'required|integer',
                'type'       => 'required|string|in:IN,OUT,ADJUST',
                'note'       => 'sometimes|nullable|string',
            ];

            $request->merge([
                'bussiness_id' => auth()->guard('api')->user()->bussiness_id,
                'user_id'      => auth()->guard('api')->user()->id,
            ]);

            return DB::transaction(function () use ($request, $rules) {
                $data    = $this->requestService->postData(StockTransactions::class, $request, $rules);
                $product = Products::findOrFail($request->product_id);

                if ($request->type === 'IN') {
                    $product->increment('stock', $request->quantity);
                } elseif ($request->type === 'OUT') {
                    $product->decrement('stock', $request->quantity);
                } elseif ($request->type === 'ADJUST') {
                    $product->stock = $request->quantity;
                    $product->save();
                }

                if (!$data) {
                    return ApiHelper::error('Failed to create stock transaction', 500);
                } else {
                    return ApiHelper::success('Stock transaction was successfully created', $data, 201);
                }
            });
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateStockTransaction(Request $request, $id)
    {
        try {
            $rules = [
                'product_id' => 'sometimes|integer|exists:products,id',
                'quantity'   => 'sometimes|integer',
                'type'       => 'sometimes|string|in:IN,OUT,ADJUST',
                'note'       => 'sometimes|nullable|string',
            ];

            return DB::transaction(function () use ($request, $rules, $id) {
                $stockTransaction = StockTransactions::findOrFail($id);
                $product          = Products::findOrFail($request->product_id ?? $stockTransaction->product_id);

                // Revert stock lama sebelum update
                if ($stockTransaction->type === 'IN') {
                    $product->decrement('stock', $stockTransaction->quantity);
                } elseif ($stockTransaction->type === 'OUT') {
                    $product->increment('stock', $stockTransaction->quantity);
                }

                $data = $this->requestService->updateDataById(StockTransactions::class, $id, $request, $rules);

                // Terapkan stock baru
                $type     = $request->type ?? $stockTransaction->type;
                $quantity = $request->quantity ?? $stockTransaction->quantity;

                if ($type === 'IN') {
                    $product->increment('stock', $quantity);
                } elseif ($type === 'OUT') {
                    $product->decrement('stock', $quantity);
                } elseif ($type === 'ADJUST') {
                    $product->stock = $quantity;
                    $product->save();
                }

                if (!$data) {
                    return ApiHelper::error('Failed to update stock transaction', 500);
                } else {
                    return ApiHelper::success('Stock transaction was successfully updated', $data, 200);
                }
            });
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteStockTransaction($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $stockTransaction = StockTransactions::findOrFail($id);
                $product          = Products::findOrFail($stockTransaction->product_id);

                // Revert stock sebelum delete
                if ($stockTransaction->type === 'IN') {
                    $product->decrement('stock', $stockTransaction->quantity);
                } elseif ($stockTransaction->type === 'OUT') {
                    $product->increment('stock', $stockTransaction->quantity);
                }

                $data = $this->requestService->deleteDataById(StockTransactions::class, $id);

                if (!$data) {
                    return ApiHelper::error('Failed to delete stock transaction', 500);
                } else {
                    return ApiHelper::success('Stock transaction was successfully deleted', null, 200);
                }
            });
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllStockTransaction()
    {
        try {
            $data = StockTransactions::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->get();

            if (!$data) {
                ApiHelper::error('Failed to get stock transactions', 500);
            } else {
                ApiHelper::success('Stock transactions was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getStockTransactionById($id)
    {
        try {
            $data = StockTransactions::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->first();

            if (!$data) {
                ApiHelper::error('Stock transaction not found', 404);
            } else {
                ApiHelper::success('Stock transaction was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
