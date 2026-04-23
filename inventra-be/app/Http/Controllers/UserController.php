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
        $rules = [
            'username' => 'required|string|max:255|unique:users,username',
            'email'    => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8',
        ];

        $data = $this->requestService->postData(User::class, $request, $rules);

        $token = auth()->guard('api')->login($data);

        return ApiHelper::success('User was successfully registered', [
            'user'       => $data,
            'token'      => $token,
            'token_type' => 'bearer',
        ], 201);
    }

    /**
     * Login a user.
     */
    public function login(Request $request)
    {
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
    }

    /**
     * Logout the authenticated user.
     */
    public function logout()
    {
        auth()->guard('api')->logout();

        return ApiHelper::success('Successfully logged out', null, 200);
    }

    /**
     * Add a new user (admin action).
     */
    public function store(Request $request)
    {
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

        event(new LoggingEvent('User created successfully', 'users'));

        return ApiHelper::success('User was successfully created', $data, 201);
    }

    /**
     * Get all users.
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $data    = User::with('roles')->paginate($perPage);

        if ($data->isEmpty()) {
            return ApiHelper::error('No users found', 404);
        }

        return ApiHelper::success('Users retrieved successfully', $data, 200);
    }

    /**
     * Get a user by ID.
     */
    public function show($id)
    {
        $data = User::with('roles')->where('id', $id)->first();

        if (!$data) {
            return ApiHelper::error('User not found', 404);
        }

        return ApiHelper::success('User retrieved successfully', $data, 200);
    }

    /**
     * Update a user by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'username' => 'required|string|max:255|unique:users,username,' . $id,
            'email'    => 'required|string|email|max:255|unique:users,email,' . $id,
            'password' => 'required|string|min:8',
            'roles'    => 'required|array',
            
            'roles.*'  => 'string|exists:roles,name',
            
        ];

        $data = $this->requestService->updateDataById(User::class, $id, $request, $rules);

        /** @disregard */
        $data->syncRoles($request->input('roles', []));    

        event(new LoggingEvent('User with id ' . $id . ' updated successfully', 'users'));

        return ApiHelper::success('User was successfully updated', $data, 200);
    }

    /**
     * Delete a user by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(User::class, $id);

        event(new LoggingEvent('User with id ' . $id . ' deleted successfully', 'users'));

        return ApiHelper::success('User was successfully deleted', null, 200);
    }

    /**
     * Get the authenticated user's profile.
     */
    public function getProfile()
    {
        $user = auth()->guard('api')->user();

        /** @disregard */
       $bussiness = $user->load('business');

        /** @disregard */
        $roles = $user->getRoleNames();
        
        /** @disregard */
        $permissions = $user->getAllPermissions()->pluck('name');


        return ApiHelper::success('User profile retrieved successfully', compact('user', 'bussiness', 'roles', 'permissions'), 200);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function updateProfile(Request $request)
    {
        $userId = auth()->guard('api')->id();

        $rules = [
            'username' => 'sometimes|string|max:255|unique:users,username,' . $userId,
            'email'    => 'sometimes|string|email|max:255|unique:users,email,' . $userId,
            'password' => 'sometimes|string|min:8',
            'password_confirmation' => 'sometimes|string|min:8',
            'image'    => 'sometimes|string', 
        ];

        $data = $this->requestService->updateDataById(User::class, $userId, $request, $rules);

        return ApiHelper::success('User profile was successfully updated', $data, 200);
    }
}
