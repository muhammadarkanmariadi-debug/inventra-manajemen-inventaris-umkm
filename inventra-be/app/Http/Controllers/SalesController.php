<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Products;
use App\Models\Sales;
use App\Models\HppComponents;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createSale(Request $request)
    {
        try {
            $request->validate([
                'product_id'    => 'required|exists:products,id',
                'quantity'      => 'required|integer|min:1',
                'selling_price' => 'required|numeric|min:0',
                'bussiness_id'  => 'required|exists:bussinesses,id',
            ]);

            return DB::transaction(function () use ($request) {
                $product = Products::findOrFail($request->product_id);

                if ($product->stock < $request->quantity) {
                    return ApiHelper::error('Stock tidak cukup', 422);
                }

                $hppPerUnit = HppComponents::where('product_id', $request->product_id)
                    ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->sum('cost');

                if ($hppPerUnit <= 0) {
                    return ApiHelper::error('HPP belum diset untuk produk ini', 422);
                }

                $totalPrice = $request->selling_price * $request->quantity;
                $totalHpp   = $hppPerUnit * $request->quantity;
                $profit     = $totalPrice - $totalHpp;

                $data = Sales::create([
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
                } else {
                    return ApiHelper::success('Sale was successfully created', $data, 201);
                }
            });
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateSale(Request $request, $id)
    {
        try {
            $request->validate([
                'product_id'    => 'sometimes|exists:products,id',
                'quantity'      => 'sometimes|integer|min:1',
                'selling_price' => 'sometimes|numeric|min:0',
                'bussiness_id'  => 'sometimes|exists:bussinesses,id',
            ]);

            return DB::transaction(function () use ($request, $id) {
                $sale    = Sales::findOrFail($id);
                $product = Products::findOrFail($request->product_id ?? $sale->product_id);

                if ($product->stock + $sale->quantity < $request->quantity) {
                    return ApiHelper::error('Stock tidak cukup', 422);
                }

                $hppPerUnit = HppComponents::where('product_id', $product->id)
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

                $data = $sale->update([
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

                if (!$data) {
                    return ApiHelper::error('Failed to update sale', 500);
                } else {
                    return ApiHelper::success('Sale was successfully updated', $sale->fresh(), 200);
                }
            });
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteSale($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Sales::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete sale', 500);
            } else {
                ApiHelper::success('Sale was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllSale(Request $request)
    {
        try {
            $data = Sales::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->get();



        

            if (!$data) {
                ApiHelper::error('Failed to get sales', 500);
            } else {
                ApiHelper::success('Sales was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getSaleById($id)
    {
        try {
            $data = Sales::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->first();

            if (!$data) {
                ApiHelper::error('Sale not found', 404);
            } else {
                ApiHelper::success('Sale was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
