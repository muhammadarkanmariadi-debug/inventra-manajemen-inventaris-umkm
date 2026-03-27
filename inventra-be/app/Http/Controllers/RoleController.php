<?php

namespace App\Http\Controllers;

use App\Helpers\ApiHelper;
use Spatie\Permission\Models\Role;
use App\Services\RequestService;
use Illuminate\Http\Request;
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
        $rules = [
            'name'          => 'required|string|unique:roles,name',
            'permissions'   => 'required|array',
            'permissions.*' => 'string|exists:permissions,name',
        ];

        $data = $this->requestService->postData(Role::class, $request, $rules);
        $data->syncPermissions($request->input('permissions', []));

        return ApiHelper::success('Role was successfully created', $data, 201);
    }

    /**
     * Get all roles.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $data    = Role::paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No roles found', 404);
        }

        return ApiHelper::success('Roles retrieved successfully', $data, 200);
    }

    /**
     * Get a role by ID.
     */
    public function show($id)
    {
        $data = Role::with('permissions')->where('id', $id)->first();

        if (!$data) {
            return ApiHelper::error('Role not found', 404);
        }

        return ApiHelper::success('Role retrieved successfully', $data, 200);
    }

    /**
     * Update a role by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name'          => 'sometimes|string|unique:roles,name,' . $id,
            'permissions'   => 'sometimes|array',
            'permissions.*' => 'string|exists:permissions,name',
        ];

        $data = $this->requestService->updateDataById(Role::class, $id, $request, $rules);
        $data->syncPermissions($request->input('permissions', []));

        return ApiHelper::success('Role was successfully updated', $data, 200);
    }

    /**
     * Delete a role by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(Role::class, $id);

        return ApiHelper::success('Role was successfully deleted', null, 200);
    }

    /**
     * Get all permissions.
     */
    public function getPermissions(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $data    = Permission::paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No permissions found', 404);
        }

        return ApiHelper::success('Permissions retrieved successfully', $data, 200);
    }
}