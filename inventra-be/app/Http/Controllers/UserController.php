<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\User;
use App\Services\RequestService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        try {
            $rules = [
                'username' => 'required|string|max:255|unique:users,username',
                'email'    => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
            ];

            $data = $this->requestService->postData(User::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to register user', 500);
            }

            return ApiHelper::success('User was successfully registered', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Login a user.
     */
    public function login(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            $user        = User::where('email', $credentials['email'])->first();

            if (!$user || !Hash::check($credentials['password'], $user->password)) {
                return ApiHelper::error('Invalid credentials', 401);
            }

            $token = auth()->guard('api')->login($user);

            return ApiHelper::success('Login was successful', [
                'token'      => $token,
                'token_type' => 'bearer',
            ], 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Logout the authenticated user.
     */
    public function logout()
    {
        try {
            auth()->guard('api')->logout();

            return ApiHelper::success('Successfully logged out', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Add a new user (admin action).
     */
    public function store(Request $request)
    {
        try {
            $rules = [
                'username' => 'required|string|max:255|unique:users,username',
                'email'    => 'required|string|email|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                'roles'    => 'required|array',
                'roles.*'  => 'string|exists:roles,name',
            ];

            $data = $this->requestService->postData(User::class, $request, $rules);

            /** @disregard */
            $data->assignRole($request->input('roles', []));

            if (!$data) {
                return ApiHelper::error('Failed to create user', 500);
            }

            event(new LoggingEvent('User created successfully', 'users'));

            return ApiHelper::success('User was successfully created', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update a user by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'username' => 'required|string|max:255|unique:users,username,' . $id,
                'email'    => 'required|string|email|max:255|unique:users,email,' . $id,
                'password' => 'required|string|min:8',
                'roles'    => 'required|array',
                'roles.*'  => 'string|exists:roles,name',
            ];

            $data = $this->requestService->updateDataById(User::class, $id, $request, $rules);

            /** @disregard */
            $data->assignRole($request->input('roles', []));

            if (!$data) {
                return ApiHelper::error('Failed to update user', 500);
            }

            event(new LoggingEvent('User with id ' . $id . ' updated successfully', 'users'));

            return ApiHelper::success('User was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Delete a user by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(User::class, $id);

            event(new LoggingEvent('User with id ' . $id . ' deleted successfully', 'users'));

            return ApiHelper::success('User was successfully deleted', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get all users.
     */
    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $data    = User::with('roles')->paginate($perPage);

            if ($data->isEmpty()) {
                return ApiHelper::error('No users found', 404);
            }

            return ApiHelper::success('Users retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get a user by ID.
     */
    public function show($id)
    {
        try {
            $data = User::with('roles')->where('id', $id)->first();

            if (!$data) {
                return ApiHelper::error('User not found', 404);
            }

            return ApiHelper::success('User retrieved successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Get the authenticated user's profile.
     */
    public function getProfile()
    {
        try {
            $user = auth()->guard('api')->user();

            /** @disregard */
            $roles = $user->getRoleNames();

            return ApiHelper::success('User profile retrieved successfully', compact('user', 'roles'), 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        try {
            $userId = auth()->guard('api')->id();

            $rules = [
                'username' => 'sometimes|string|max:255|unique:users,username,' . $userId,
                'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $userId,
                'password' => 'sometimes|string|min:8',
            ];

            $data = $this->requestService->updateDataById(User::class, $userId, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update profile', 500);
            }

            return ApiHelper::success('User profile was successfully updated', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
