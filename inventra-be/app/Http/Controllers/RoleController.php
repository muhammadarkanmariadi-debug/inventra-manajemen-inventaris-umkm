<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use App\Models\Role;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new role.
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'name'          => 'required|string|unique:roles,name',
                'permissions'   => 'required|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];

            $data = $this->requestService->postData(Role::class, $request, $rules);

            $permissions = $request->input('permissions', []);
            $data->syncPermissions($permissions);

            if (!$data) {
                return ApiHelper::error('Failed to create role', 500);
            }

            return ApiHelper::success('Role was successfully created', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a role by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'          => 'sometimes|string|unique:roles,name,' . $id,
                'permissions'   => 'sometimes|array',
                'permissions.*' => 'string|exists:permissions,name',
            ];

            $data = $this->requestService->updateDataById(Role::class, $id, $request, $rules);

            $permissions = $request->input('permissions', []);
            $data->syncPermissions($permissions);

            if (!$data) {
                return ApiHelper::error('Failed to update role', 500);
            }

            return ApiHelper::success('Role was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a role by ID.
     */
    public function destroy($id)
    {
        try {
            $data = $this->requestService->deleteDataById(Role::class, $id);

            if (!$data) {
                return ApiHelper::error('Failed to delete role', 500);
            }

            return ApiHelper::success('Role was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all roles.
     */
    public function index()
    {
        try {
            $data = Cache::remember('roles', 7200, function () {
                return Role::get();
            });

            if ($data->isEmpty()) {
                return ApiHelper::error('No roles found', 404);
            }

            return ApiHelper::success('Roles retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a role by ID.
     */
    public function show($id)
    {
        try {
            $data = Role::with('permissions')->where('id', $id)->first();

            if (!$data) {
                return ApiHelper::error('Role not found', 404);
            }

            return ApiHelper::success('Role retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all permissions.
     */
    public function getPermissions()
    {
        try {
            $data = Permission::get();

            if ($data->isEmpty()) {
                return ApiHelper::error('No permissions found', 404);
            }

            return ApiHelper::success('Permissions retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
