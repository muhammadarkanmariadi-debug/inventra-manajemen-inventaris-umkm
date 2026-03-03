<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\Products;
use App\Models\StockTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

use function PHPSTORM_META\type;

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
                'transactions'             => 'required|array|min:1',
                'transactions.*.product_id' => 'required|integer|exists:products,id',
                'transactions.*.quantity'   => 'required|integer',
                'transactions.*.type'       => 'required|string|in:IN,OUT,ADJUST',
                'transactions.*.note'       => 'sometimes|nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }

            return DB::transaction(function () use ($request) {

                $data = [];
                foreach ($request->transactions as $transaction) {
                    $data[] = [
                        'product_id'   => $transaction['product_id'],
                        'quantity'     => $transaction['quantity'],
                        'type'         => $transaction['type'],
                        'note'         => $transaction['note'] ?? null,
                        'bussiness_id' => auth()->guard('api')->user()->bussiness_id,
                        'user_id'      => auth()->guard('api')->user()->id,
                    ];
                }

                $insert = StockTransactions::insert($data);

                foreach ($data as $d) {
                    $product  = Products::findOrFail($d['product_id']);
                    $type     = $d['type'];
                    $quantity = $d['quantity'];

                    if ($type === 'IN') {
                        $product->increment('stock', $quantity);
                    } elseif ($type === 'OUT') {
                        $product->decrement('stock', $quantity);
                    } elseif ($type === 'ADJUST') {
                        $product->stock = $quantity;
                        $product->save();
                    }
                }

                if (!$insert) {
                    return ApiHelper::error('Failed to create stock transaction', 500);
                }

                event(new LoggingEvent('Stock transaction was successfully created', 'stockTransactions'));
                return ApiHelper::success('Stock transaction was successfully created', $insert, 201);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }


    public function updateStockTransaction(Request $request, $id)
    {
        try {
            $rules = [
                'transactions'             => 'required|array|min:1',
                'transactions.*.product_id' => 'required|integer|exists:products,id',
                'transactions.*.quantity'   => 'required|integer',
                'transactions.*.type'       => 'required|string|in:IN,OUT,ADJUST',
                'transactions.*.note'       => 'sometimes|nullable|string',
            ];

            $validator = Validator::make($request->all(), $rules);
            if ($validator->fails()) {
                throw new \Illuminate\Validation\ValidationException($validator);
            }
            return DB::transaction(function () use ($request, $rules, $id) {
                $stockTransaction = StockTransactions::findOrFail($id);

                $data = [];
                foreach ($request->transactions as $transaction) {
                    $data[] = [
                        'product_id'   => $transaction['product_id'],
                        'quantity'     => $transaction['quantity'],
                        'type'         => $transaction['type'],
                        'note'         => $transaction['note'] ?? null,
                        'bussiness_id' => auth()->guard('api')->user()->bussiness_id,
                        'user_id'      => auth()->guard('api')->user()->id,
                    ];
                }


                $insert =      StockTransactions::insert($data);

                foreach ($data as $d) {
                    $product = Products::findOrFail($d['product_id']);
                    $validator =   Validator::make($d, $rules);
                    if ($validator->fails()) {
                        throw new \Illuminate\Validation\ValidationException($validator);
                    }
                    $type     = $d['type'] ?? $stockTransaction->type;
                    $quantity = $d['quantity'] ?? $stockTransaction->quantity;

                    if ($type === 'IN') {
                        $product->increment('stock', $quantity);
                    } elseif ($type === 'OUT') {
                        $product->decrement('stock', $quantity);
                    } elseif ($type === 'ADJUST') {
                        $product->stock = $quantity;
                        $product->save();
                    }
                }

                if (!$insert) {
                    return ApiHelper::error('Failed to update stock transaction', 500);
                } else {
                    event(new LoggingEvent('Stock transaction with id: ' . $id . ' updated successfully', 'stockTransactions'));
                    return ApiHelper::success('Stock transaction was successfully updated', $insert, 200);
                }
            });
        } catch (\Exception $e) {
            return  ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteStockTransaction($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $stockTransaction = StockTransactions::findOrFail($id);
                $product          = Products::findOrFail($stockTransaction->product_id);

                if ($stockTransaction->type === 'IN') {
                    $product->decrement('stock', $stockTransaction->quantity);
                } elseif ($stockTransaction->type === 'OUT') {
                    $product->increment('stock', $stockTransaction->quantity);
                }

                $data = $this->requestService->deleteDataById(StockTransactions::class, $id);

                if (!$data) {
                    return ApiHelper::error('Failed to delete stock transaction', 500);
                } else {
                    event(new LoggingEvent('Stock transaction with id: ' . $id . ' deleted successfully', 'stockTransactions'));
                    return ApiHelper::success('Stock transaction was successfully deleted', null, 200);
                }
            });
        } catch (\Exception $e) {
            return  ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllStockTransaction()
    {
        try {
            $data = Cache::remember('stock_transactions', 7200, function () {
                return StockTransactions::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->with('product')
                    ->get();
            });


            if (!$data) {
                return  ApiHelper::error('Failed to get stock transactions', 500);
            } else {
                return  ApiHelper::success('Stock transactions was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            return  ApiHelper::error($e->getMessage(), 500);
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
                return  ApiHelper::error('Stock transaction not found', 404);
            } else {
                return  ApiHelper::success('Stock transaction was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            return  ApiHelper::error($e->getMessage(), 500);
        }
    }
}
