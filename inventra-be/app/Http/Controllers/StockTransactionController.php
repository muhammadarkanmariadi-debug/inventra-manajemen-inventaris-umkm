<?php

namespace App\Http\Controllers;

use App\Events\StockTransactionEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\StockTransactions;
use Illuminate\Http\Request;

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
            $userId = auth()->guard('api')->user()->id;
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'product_id' => 'required|integer|exists:products,id',
                'quantity' => 'required|integer',
                'type' => 'required|string|in:IN,OUT',

            ];

            $request->merge(['bussiness_id' => $userbussinessId]);
            $request->merge(['user_id' => $userId]);


            $data = $this->requestService->postData(StockTransactions::class, $request, $rules);

            if (!$data instanceof StockTransactions) {
                return ApiHelper::error('Failed to create stock transaction', 500);
            }


            event(new StockTransactionEvent($data));
            if (!$data) {
                return ApiHelper::error('Failed to create stock transaction', 500);
            } else {
                return ApiHelper::success('Stock transaction created successfully', $data, 201);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function getStockTransactions()
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $data = StockTransactions::where('bussiness_id', $userbussinessId)->get();

            if (count($data) == 0) {
                return ApiHelper::error('No stock transactions found', 404);
            }
            return ApiHelper::success('Stock transactions retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function getStockTransaction($id)
    {
        try {
            $userbussinessId = auth()->guard('api')->user()->bussiness_id;

            $data = StockTransactions::where('bussiness_id', $userbussinessId)->find($id);

            if (!$data) {
                return ApiHelper::error('Stock transaction not found', 404);
            }
            return ApiHelper::success('Stock transaction retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function updateStockTransaction(Request $request, $id)
    {
        try {



            $rules = [
                'product_id' => 'sometimes|required|integer|exists:products,id',
                'quantity' => 'sometimes|required|integer',
                'note' => 'sometimes|nullable|string',
            ];

            $request->merge(['type' => 'ADJUST']);

            $data = $this->requestService->updateDataById(StockTransactions::class, $id, $request, $rules);
            event(new StockTransactionEvent($data));
            if (!$data) {
                return ApiHelper::error('Failed to update stock transaction', 500);
            } else {
                return ApiHelper::success('Stock transaction updated successfully', $data, 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }

    public function deleteStockTransaction($id)
    {
        try {
            $data = $this->requestService->deleteDataById(StockTransactions::class, $id);
            if (!$data) {
                return ApiHelper::error('Failed to delete stock transaction', 500);
            } else {
                return ApiHelper::success('Stock transaction deleted successfully', [], 200);
            }
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', $e->getMessage(), 500);
        }
    }
}
