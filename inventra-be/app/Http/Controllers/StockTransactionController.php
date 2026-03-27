<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Product;
use App\Models\StockTransaction;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

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
        $rules = [
            'transactions'              => 'required|array|min:1',
            'transactions.*.product_id' => 'required|integer|exists:products,id',
            'transactions.*.quantity'   => 'required|integer',
            'transactions.*.type'       => 'required|string|in:IN,OUT,ADJUST',
            'transactions.*.note'       => 'sometimes|nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return DB::transaction(function () use ($request) {
            $data = collect($request->transactions)->map(fn ($t) => [
                'product_id'   => $t['product_id'],
                'quantity'     => $t['quantity'],
                'type'         => $t['type'],
                'note'         => $t['note'] ?? null,
                'bussiness_id' => auth()->guard('api')->user()->bussiness_id,
                'user_id'      => auth()->guard('api')->user()->id,
            ])->all();

            StockTransaction::insert($data);

            foreach ($data as $d) {
                $product = Product::findOrFail($d['product_id']);

                match ($d['type']) {
                    'IN'     => $product->increment('stock', $d['quantity']),
                    'OUT'    => $product->decrement('stock', $d['quantity']),
                    'ADJUST' => tap($product)->forceFill(['stock' => $d['quantity']])->save(),
                };
            }

            event(new LoggingEvent('Stock transaction was successfully created', 'stockTransactions'));

            return ApiHelper::success('Stock transaction was successfully created', null, 201);
        });
    }

    /**
     * Get all stock transactions.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $data    = StockTransaction::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->with('product')
            ->paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No stock transactions found', 404);
        }

        return ApiHelper::success('Stock transactions retrieved successfully', $data, 200);
    }

    /**
     * Get a stock transaction by ID.
     */
    public function show($id)
    {
        $data = StockTransaction::where('id', $id)
            ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->with('product')
            ->first();

        if (!$data) {
            return ApiHelper::error('Stock transaction not found', 404);
        }

        return ApiHelper::success('Stock transaction retrieved successfully', $data, 200);
    }

    /**
     * Update a stock transaction by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'transactions'              => 'required|array|min:1',
            'transactions.*.product_id' => 'required|integer|exists:products,id',
            'transactions.*.quantity'   => 'required|integer',
            'transactions.*.type'       => 'required|string|in:IN,OUT,ADJUST',
            'transactions.*.note'       => 'sometimes|nullable|string',
        ];

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            throw new ValidationException($validator);
        }

        return DB::transaction(function () use ($request, $id) {
            $data = collect($request->transactions)->map(fn ($t) => [
                'product_id'   => $t['product_id'],
                'quantity'     => $t['quantity'],
                'type'         => $t['type'],
                'note'         => $t['note'] ?? null,
                'bussiness_id' => auth()->guard('api')->user()->bussiness_id,
                'user_id'      => auth()->guard('api')->user()->id,
            ])->all();

            StockTransaction::insert($data);

            foreach ($data as $d) {
                $product = Product::findOrFail($d['product_id']);

                match ($d['type']) {
                    'IN'     => $product->increment('stock', $d['quantity']),
                    'OUT'    => $product->decrement('stock', $d['quantity']),
                    'ADJUST' => tap($product)->forceFill(['stock' => $d['quantity']])->save(),
                };
            }

            event(new LoggingEvent('Stock transaction with id: ' . $id . ' updated successfully', 'stockTransactions'));

            return ApiHelper::success('Stock transaction was successfully updated', null, 200);
        });
    }

    /**
     * Delete a stock transaction by ID.
     */
    public function destroy($id)
    {
        return DB::transaction(function () use ($id) {
            $stockTransaction = StockTransaction::findOrFail($id);
            $product          = Product::findOrFail($stockTransaction->product_id);

            match ($stockTransaction->type) {
                'IN'  => $product->decrement('stock', $stockTransaction->quantity),
                'OUT' => $product->increment('stock', $stockTransaction->quantity),
                default => null,
            };

            $this->requestService->deleteDataById(StockTransaction::class, $id);

            event(new LoggingEvent('Stock transaction with id: ' . $id . ' deleted successfully', 'stockTransactions'));

            return ApiHelper::success('Stock transaction was successfully deleted', null, 200);
        });
    }
}
