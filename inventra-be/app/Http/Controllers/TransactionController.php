<?php

namespace App\Http\Controllers;

use App\Http\Requests\TransactionRequest;
use App\Services\TransactionService;

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

            return response()->json([
                'status' => true,
                'message' => 'Transaction processed successfully.',
                'data' => $transaction
            ], 201);
            
        } catch (\Exception $e) {
            $code = $e->getCode();
            $code = is_int($code) && $code >= 100 && $code < 600 ? $code : 500;

            return response()->json([
                'status' => false,
                'message' => $e->getMessage(),
            ], $code);
        }
    }
}
