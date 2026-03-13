<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\FinancialCategory;
use App\Services\RequestService;
use Illuminate\Http\Request;

class FinancialCategoryController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new financial category.
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'name' => 'required|string',
                'type' => 'required|string|in:income,expense',
            ];

            $data = $this->requestService->postData(FinancialCategory::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create financial category', 500);
            }

            event(new LoggingEvent('Financial category was successfully created', 'financialCategories'));

            return ApiHelper::success('Financial category was successfully created', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a financial category by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name' => 'sometimes|string',
                'type' => 'sometimes|string|in:income,expense',
            ];

            $data = $this->requestService->updateDataById(FinancialCategory::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update financial category', 500);
            }

            event(new LoggingEvent('Financial category with id: ' . $id . ' updated successfully', 'financialCategories'));

            return ApiHelper::success('Financial category was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a financial category by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(FinancialCategory::class, $id);

            event(new LoggingEvent('Financial category with id: ' . $id . ' deleted successfully', 'financialCategories'));

            return ApiHelper::success('Financial category was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all financial categories.
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = FinancialCategory::where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No financial categories found', 404);
            }

            return ApiHelper::success('Financial categories retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a financial category by ID.
     */
    public function show($id)
    {
        try {
            $data = FinancialCategory::where('id', $id)
                ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
                ->first();

            if (!$data) {
                return ApiHelper::error('Financial category not found', 404);
            }

            return ApiHelper::success('Financial category retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
