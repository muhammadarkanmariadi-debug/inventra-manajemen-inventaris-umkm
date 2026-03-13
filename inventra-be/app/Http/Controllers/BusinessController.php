<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Business;
use App\Models\User;
use App\Services\RequestService;
use Illuminate\Http\Request;

class BusinessController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new business.
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'phone'   => 'required|string|max:20',
                'email'   => 'required|string|email|max:255',
                'website' => 'nullable|string|max:255',
            ];

            $data = $this->requestService->postData(Business::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create business', 500);
            }

            return ApiHelper::success('Business created successfully', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    /**
     * Get all businesses.
     */
    public function index()
    {
        try {
            $businesses = Business::get();

            if ($businesses->isEmpty()) {
                return ApiHelper::error('Business not found', 404);
            }

            return ApiHelper::success('Business retrieved successfully', $businesses, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    /**
     * Get the authenticated user's business.
     */
    public function showOwn(Request $request)
    {
        try {
            $userId   = auth()->guard('api')->id();
            $business = User::findOrFail($userId)->business;

            if (!$business) {
                return ApiHelper::error('Business not found', 404);
            }

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                $allowed = [
                    'users', 'products', 'suppliers', 'categories',
                    'financialTransactions', 'hppComponents',
                    'stockTransactions', 'financialCategories',
                ];

                $validIncludes = array_intersect($includes, $allowed);

                if (!empty($validIncludes)) {
                    $business->load($validIncludes);
                }
            }

            return ApiHelper::success('Business retrieved successfully', $business, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    /**
     * Get a business by ID.
     */
    public function show($id, Request $request)
    {
        try {
            $business = Business::find($id);

            if (!$business) {
                return ApiHelper::error('Business not found', 404);
            }

            if ($request->has('include')) {
                $includes = explode(',', $request->query('include'));

                $allowed = [
                    'users', 'products', 'suppliers', 'categories',
                    'financialTransactions', 'hppComponents',
                    'stockTransactions', 'financialCategories',
                ];

                $validIncludes = array_intersect($includes, $allowed);

                if (!empty($validIncludes)) {
                    $business->load($validIncludes);
                }
            }

            return ApiHelper::success('Business retrieved successfully', $business, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    /**
     * Update a business by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'    => 'required|string|max:255',
                'address' => 'required|string',
                'phone'   => 'required|string|max:20',
                'email'   => 'required|string|email|max:255',
                'website' => 'nullable|string|max:255',
            ];

            $data = $this->requestService->updateDataById(Business::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update business', 500);
            }

            return ApiHelper::success('Business updated successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }

    /**
     * Delete a business by ID.
     */
    public function destroy($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Business::class, $id);

            if (!$data) {
                return ApiHelper::error('Failed to delete business', 500);
            }

            return ApiHelper::success('Business deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred', 500);
        }
    }
}
