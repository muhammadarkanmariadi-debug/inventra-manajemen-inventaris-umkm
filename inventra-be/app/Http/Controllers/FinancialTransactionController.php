<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;

use App\Models\FinancialTransactions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FinancialTransactionController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function createFinancialTransaction(Request $request)
    {
        try {
            $rules = [
                'financial_category_id' => 'required|exists:financial_categories,id',
                'type'                  => 'required|string|in:income,expense',
                'amount'                => 'required|numeric|min:0',
                'note'                  => 'nullable|string',
                'transaction_date'      => 'required|date',
            ];
            $data = $this->requestService->postData(FinancialTransactions::class, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to create financial transaction', 500);
            } else {
                event(new LoggingEvent('Financial transaction was successfully created', 'financialTransactions'));
                ApiHelper::success('Financial transaction was successfully created', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateFinancialTransaction(Request $request, $id)
    {
        try {
            $rules = [
                'financial_category_id' => 'sometimes|exists:financial_categories,id',
                'type'                  => 'sometimes|string|in:income,expense',
                'amount'                => 'sometimes|numeric|min:0',
                'note'                  => 'nullable|string',
                'transaction_date'      => 'sometimes|date',
            ];
            $data = $this->requestService->updateDataById(FinancialTransactions::class, $id, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to update financial transaction', 500);
            } else {
                event(new LoggingEvent('Financial transaction with id: ' . $id . ' updated successfully', 'financialTransactions'));
                ApiHelper::success('Financial transaction was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteFinancialTransaction($id)
    {
        try {
            $data = $this->requestService->deleteDataById(FinancialTransactions::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete financial transaction', 500);
            } else {
                event(new LoggingEvent('Financial transaction with id: ' . $id . ' deleted successfully', 'financialTransactions'));
                ApiHelper::success('Financial transaction was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllFinancialTransaction()
    {
        try {
            $data = Cache::remember('financial_transactions', 7200, function () {
                return FinancialTransactions::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });

            if (!$data) {
                ApiHelper::error('Failed to get financial transactions', 500);
            } else {
                ApiHelper::success('Financial transactions was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getFinancialTransactionById($id)
    {
        try {
            $data = FinancialTransactions::with('financialCategory')->where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();

            if (!$data) {
                ApiHelper::error('Financial transaction not found', 404);
            } else {
                ApiHelper::success('Financial transaction was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
