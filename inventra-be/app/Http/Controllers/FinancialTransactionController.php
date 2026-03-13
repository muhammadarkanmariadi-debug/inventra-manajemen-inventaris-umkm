<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\FinancialTransaction;
use App\Services\RequestService;
use Illuminate\Http\Request;

class FinancialTransactionController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new financial transaction.
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'financial_category_id' => 'required|exists:financial_categories,id',
                'type'                  => 'required|string|in:income,expense',
                'amount'                => 'required|numeric|min:0',
                'note'                  => 'nullable|string',
                'transaction_date'      => 'required|date',
            ];

            $data = $this->requestService->postData(FinancialTransaction::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create financial transaction', 500);
            }

            event(new LoggingEvent('Financial transaction was successfully created', 'financialTransactions'));

            return ApiHelper::success('Financial transaction was successfully created', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a financial transaction by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'financial_category_id' => 'sometimes|exists:financial_categories,id',
                'type'                  => 'sometimes|string|in:income,expense',
                'amount'                => 'sometimes|numeric|min:0',
                'note'                  => 'nullable|string',
                'transaction_date'      => 'sometimes|date',
            ];

            $data = $this->requestService->updateDataById(FinancialTransaction::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update financial transaction', 500);
            }

            event(new LoggingEvent('Financial transaction with id: ' . $id . ' updated successfully', 'financialTransactions'));

            return ApiHelper::success('Financial transaction was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a financial transaction by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(FinancialTransaction::class, $id);

            event(new LoggingEvent('Financial transaction with id: ' . $id . ' deleted successfully', 'financialTransactions'));

            return ApiHelper::success('Financial transaction was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all financial transactions.
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = FinancialTransaction::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No financial transactions found', 404);
            }

            return ApiHelper::success('Financial transactions retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a financial transaction by ID.
     */
    public function show($id)
    {
        try {
            $data = FinancialTransaction::with('financialCategory')
                ->where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$data) {
                return ApiHelper::error('Financial transaction not found', 404);
            }

            return ApiHelper::success('Financial transaction retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
