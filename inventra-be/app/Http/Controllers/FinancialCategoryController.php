<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Http\Controllers\Controller;
use App\Http\Services\RequestService;
use App\Models\FinancialCategory;
use Google\Service\ApigeeRegistry\Api;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class FinancialCategoryController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }
    public function createFinancialCategory(Request $request)
    {
        try {
            $rules = [
                'name' => 'required|string',
                'type' => 'required|string|in:income,expense'
            ];
            $data = $this->requestService->postData(FinancialCategory::class, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to create financial category', 500);
            } else {
                event(new LoggingEvent('Financial category was successfully created', 'financialCategories'));
                ApiHelper::success('Financial category was successfully created', $data, 201);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function updateFinancialCategory(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'sometimes|string',
                'type' => 'sometimes|string|in:income,expense'
            ];
            $data = $this->requestService->updateDataById(FinancialCategory::class, $id, $request, $rules);

            if (!$data) {
                ApiHelper::error('Failed to update financial category', 500);
            } else {
                event(new LoggingEvent('Financial category with id: ' . $id . ' updated successfully', 'financialCategories'));
                ApiHelper::success('Financial category was successfully updated', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function deleteFinancialCategory($id)
    {
        try {
            $data = $this->requestService->deleteDataById(FinancialCategory::class, $id);

            if (!$data) {
                ApiHelper::error('Failed to delete financial category', 500);
            } else {
                event(new LoggingEvent('Financial category with id: ' . $id . ' deleted successfully', 'financialCategories'));
                ApiHelper::success('Financial category was successfully deleted', null, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getAllFinancialCategory()
    {
        try {
            $data = Cache::remember('financial_categories', 7200, function () {
                return FinancialCategory::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();
            });

            if (!$data) {
                ApiHelper::error('Failed to get financial categories', 500);
            } else {

                ApiHelper::success('Financial categories was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function getFinancialCategoryById($id)
    {
        try {
            $data = FinancialCategory::findOrFail($id)->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)->get();

            if (!$data) {
                ApiHelper::error('Financial category not found', 404);
            } else {
                ApiHelper::success('Financial category was successfully retrieved', $data, 200);
            }
        } catch (\Exception $e) {
            ApiHelper::error($e->getMessage(), 500);
        }
    }
}
