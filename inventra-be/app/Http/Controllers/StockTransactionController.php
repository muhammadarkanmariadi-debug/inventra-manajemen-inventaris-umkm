<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StockTransactionController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new stock transaction.
     */
    public function store(Request $request)
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

                $insert = StockTransaction::insert($data);

                foreach ($data as $d) {
                    $product  = Product::findOrFail($d['product_id']);
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

    /**
     * Update a stock transaction by ID.
     */
    public function update(Request $request, $id)
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

            return DB::transaction(function () use ($request, $id) {
                $stockTransaction = StockTransaction::findOrFail($id);

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

                $insert = StockTransaction::insert($data);

                foreach ($data as $d) {
                    $product  = Product::findOrFail($d['product_id']);
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
                    return ApiHelper::error('Failed to update stock transaction', 500);
                }

                event(new LoggingEvent('Stock transaction with id: ' . $id . ' updated successfully', 'stockTransactions'));

                return ApiHelper::success('Stock transaction was successfully updated', $insert, 200);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a stock transaction by ID.
     */
    public function destroy($id)
    {
        try {
            return DB::transaction(function () use ($id) {
                $stockTransaction = StockTransaction::findOrFail($id);
                $product          = Product::findOrFail($stockTransaction->product_id);

                if ($stockTransaction->type === 'IN') {
                    $product->decrement('stock', $stockTransaction->quantity);
                } elseif ($stockTransaction->type === 'OUT') {
                    $product->increment('stock', $stockTransaction->quantity);
                }

                $data = $this->requestService->deleteDataById(StockTransaction::class, $id);

                if (!$data) {
                    return ApiHelper::error('Failed to delete stock transaction', 500);
                }

                event(new LoggingEvent('Stock transaction with id: ' . $id . ' deleted successfully', 'stockTransactions'));

                return ApiHelper::success('Stock transaction was successfully deleted', null, 200);
            });
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all stock transactions.
     */
    public function index()
    {
        try {
            $data = Cache::remember('stock_transactions', 7200, function () {
                return StockTransaction::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                    ->with('product')
                    ->get();
            });

            if ($data->isEmpty()) {
                return ApiHelper::error('No stock transactions found', 404);
            }

            return ApiHelper::success('Stock transactions retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a stock transaction by ID.
     */
    public function show($id)
    {
        try {
            $data = StockTransaction::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->with('product')
                ->first();

            if (!$data) {
                return ApiHelper::error('Stock transaction not found', 404);
            }

            return ApiHelper::success('Stock transaction retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
