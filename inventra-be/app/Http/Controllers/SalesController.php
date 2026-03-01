<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Products;
use Illuminate\Http\Request;
use App\Models\Sale;

use App\Models\HppComponents;
use App\Models\Sales;
use DeepCopy\f001\A;
use Google\Service\ApigeeRegistry\Api;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
    protected $requestService;
    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }


    public function createSales(Request $request)
    {
        try {
            $request->validate([
                'product_id' => 'required|exists:products,id',
                'quantity' => 'required|integer|min:1',
                'selling_price' => 'required|numeric|min:0',
                'bussiness_id' => 'required|exists:bussinesses,id',
            ]);

            return DB::transaction(function () use ($request) {

                $product = Products::findOrFail($request->product_id);


                if ($product->stock < $request->quantity) {
                    return response()->json([
                        'message' => 'Stock tidak cukup'
                    ], 422);
                }


                $hppPerUnit = HppComponents::where('product_id', $request->product_id)
                    ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->sum('cost');

                if ($hppPerUnit <= 0) {
                    ApiHelper::error('HPP belum diset untuk produk ini', 422);
                }


                $totalPrice = $request->selling_price * $request->quantity;
                $totalHpp = $hppPerUnit * $request->quantity;
                $profit = $totalPrice - $totalHpp;


                $sale = Sales::create([
                    'product_id' => $request->product_id,
                    'user_id' => auth()->guard('api')->user()->id,
                    'quantity' => $request->quantity,
                    'selling_price' => $request->selling_price,
                    'total_price' => $totalPrice,
                    'hpp' => $totalHpp,
                    'profit' => $profit,
                    'bussiness_id' => $request->bussiness_id,
                ]);


                $product->decrement('stock', $request->quantity);

                return ApiHelper::success('Sale created successfully', $sale, 201);
            });
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
    public function getSales(Request $request)
    {
        try {
            $sales = Sales::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->get();
            if ($sales->isEmpty()) {
                return ApiHelper::error('No sales found', 404);
            }

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));
                if (in_array('product', $includes)) {
                    $sales->load('product');
                }
            }


            return ApiHelper::success('Sales retrieved successfully', $sales);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
    public function getSale($id)
    {
        try {

            $sales = Sales::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->find($id);

            if (!$sales) {
                return ApiHelper::error('Sales not found', 404);
            }

            return ApiHelper::success('Sales retrieved successfully', $sales);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function deleteSale($id)
    {
        try {
            $sale = $this->requestService->deleteDataById(Sales::class, $id);

            if (!$sale) {
                return ApiHelper::error('Sale not found', 404);
            }

            $sale->delete();

            return ApiHelper::success('Sale deleted successfully');
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
}
