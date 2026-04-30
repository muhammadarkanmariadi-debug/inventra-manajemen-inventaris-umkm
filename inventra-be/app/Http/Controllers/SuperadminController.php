<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Business;
use App\Models\User;
use App\Services\RequestService;
use Illuminate\Http\Request;

class SuperadminController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    // ========== USER MANAGEMENT ==========

    /**
     * Get all users (global, across all businesses).
     */
    public function allUsers(Request $request)
    {
        try {
        $perPage = (int) $request->query('items', 10);
        $data = User::with(['roles', 'business'])->paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No users found', 404);
        }

        return ApiHelper::success('Users retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a user by ID.
     */
    public function showUser($id)
    {
        try {
        $data = User::with(['roles', 'business'])->find($id);

        if (!$data) {
            return ApiHelper::error('User not found', 404);
        }

        return ApiHelper::success('User retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a user by ID (superadmin can update any user).
     */
    public function updateUser(Request $request, $id)
    {
        try {
        $rules = [
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'email'    => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'roles'    => 'sometimes|array',
            'roles.*'  => 'string|exists:roles,name',
            'bussiness_id' => 'nullable|integer|exists:bussinesses,id',
            'role'     => 'sometimes|string|in:SUPERADMIN,USER',
        ];

        $data = $this->requestService->updateDataById(User::class, $id, $request, $rules);

        if ($request->has('roles')) {
            /** @disregard */
            $data->syncRoles($request->input('roles', []));
        }

        event(new LoggingEvent('Superadmin updated user with id ' . $id, 'users'));

        return ApiHelper::success('User was successfully updated', $data->load(['roles', 'business']), 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a user by ID.
     */
    public function deleteUser($id)
    {
        try {
        $this->requestService->deleteDataById(User::class, $id);

        event(new LoggingEvent('Superadmin deleted user with id ' . $id, 'users'));

        return ApiHelper::success('User was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    // ========== BUSINESS MANAGEMENT ==========

    /**
     * Get all businesses.
     */
    public function allBusinesses(Request $request)
    {
        try {
        $perPage    = (int) $request->query('items', 10);
        $businesses = Business::withCount('users')->paginate($perPage);

        if ($businesses->isEmpty()) {
            return ApiHelper::error('Business not found', 404);
        }

        return ApiHelper::success('Businesses retrieved successfully', $businesses, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a business by ID.
     */
    public function showBusiness($id, Request $request)
    {
        try {
        $business = Business::withCount('users')->find($id);

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
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a business by ID.
     */
    public function updateBusiness(Request $request, $id)
    {
        try {
        $rules = [
            'name'    => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'phone'   => 'nullable|string|max:20',
            'email'   => 'nullable|string|email|max:255',
            'website' => 'nullable|string|max:255',
            'logo'    => 'nullable|string',
            'logo_dark' => 'nullable|string',
            'description' => 'nullable|string|max:255',
        ];

        $data = $this->requestService->updateDataById(Business::class, $id, $request, $rules);

        event(new LoggingEvent('Superadmin updated business with id ' . $id, 'businesses'));

        return ApiHelper::success('Business updated successfully', $data, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a business by ID.
     */
    public function deleteBusiness($id)
    {
        try {
        $this->requestService->deleteDataById(Business::class, $id);

        event(new LoggingEvent('Superadmin deleted business with id ' . $id, 'businesses'));

        return ApiHelper::success('Business deleted successfully', null, 200);
        } catch (\Exception $e) {
            return \App\Helpers\ApiHelper::error($e->getMessage(), 500);
        }
    }
}
