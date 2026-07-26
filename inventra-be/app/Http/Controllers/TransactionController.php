<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;
use App\Helpers\ApiHelper;

class TransactionController extends Controller
{
    protected TransactionService $transactionService;

    public function __construct(TransactionService $transactionService)
    {
        $this->transactionService = $transactionService;
    }

    /**
     * Create transactions through Service component.
     */
    public function store(TransactionRequest $request)
    {
        try {
            $userId = auth()->guard('api')->id();

            $transaction = $this->transactionService->processTransaction(
                $request->type,
                $request->items,
                $userId,
                $request->notes
            );

            event(new LoggingEvent('Transaction processed: ' . $request->type, 'transactions'));

            return response()->json([
                'status' => true,
                'message' => 'Transaction processed successfully.',
                'data' => $transaction
            ], 201);
            
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;

            return ApiHelper::error($e->getMessage(), $code);
        }
    }
}
