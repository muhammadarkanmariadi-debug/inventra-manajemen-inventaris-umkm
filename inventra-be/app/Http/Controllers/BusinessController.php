<?php

namespace App\Http\Controllers;

use App\Exceptions\ApiException;
use App\Helpers\ApiHelper;
use App\Models\Business;
use App\Models\User;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

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
        $rules = [
            'name'    => 'required|string|unique:bussinesses,name',
            'address' => 'required|string',
            'phone'   => 'required|string|max:20',
            'email'   => 'required|string|email|max:255',
            'website' => 'nullable|string|max:255',
            'logo' => 'nullable:string',
            'logo_dark' => 'nullable:string',
            'description' => 'nullable:string|max:255'
        ];

        $data = $this->requestService->postData(Business::class, $request, $rules);

        return ApiHelper::success('Business created successfully', $data, 201);
    }

    /**
     * Get all businesses.
     */
    public function index(Request $request)
    {
        $perPage    = (int) $request->query('items', 10);
        $businesses = Business::paginate($perPage);

        if ($businesses->isEmpty()) {
            return ApiHelper::error('Business not found', 404);
        }

        return ApiHelper::success('Business retrieved successfully', $businesses, 200);
    }

    /**
     * Get the authenticated user's business.
     */
    public function showOwn(Request $request)
    {
        $userId   = auth()->guard('api')->id();
        $business = User::findOrFail($userId)->business;

        if (!$business) {
            return ApiHelper::error('Business not found', 404);
        }

        if ($request->has('include')) {
            $allowed = [
                'users',
                'products',
                'suppliers',
                'categories',
                'financialTransactions',
                'hppComponents',
                'stockTransactions',
                'financialCategories',
            ];

            $validIncludes = array_intersect(
                explode(',', $request->query('include')),
                $allowed
            );

            if (!empty($validIncludes)) {
                $business->load($validIncludes);
            }
        }

        return ApiHelper::success('Business retrieved successfully', $business, 200);
    }

    /**
     * Get a business by ID.
     */
    public function show($id, Request $request)
    {
        $business = Business::find($id);

        if (!$business) {
            return ApiHelper::error('Business not found', 404);
        }

        if ($request->has('include')) {
            $allowed = [
                'users',
                'products',
                'suppliers',
                'categories',
                'financialTransactions',
                'hppComponents',
                'stockTransactions',
                'financialCategories',
            ];

            $validIncludes = array_intersect(
                explode(',', $request->query('include')),
                $allowed
            );

            if (!empty($validIncludes)) {
                $business->load($validIncludes);
            }
        }

        return ApiHelper::success('Business retrieved successfully', $business, 200);
    }

    /**
     * Update a business by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name'    => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|string|email|max:255',
            'website' => 'nullable|string|max:255',
            'logo' => 'nullable:string',
            'logo_dark' => 'nullable:string',
            'description' => 'nullable:string|max:255'
        ];

        $data = $this->requestService->updateDataById(Business::class, $id, $request, $rules);

        return ApiHelper::success('Business updated successfully', $data, 200);
    }

    /**
     * Delete a business by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(Business::class, $id);

        return ApiHelper::success('Business deleted successfully', null, 200);
    }
}
