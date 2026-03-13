<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\Category;
use App\Services\RequestService;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new category.
     */
    public function store(Request $request)
    {
        try {
            $userBusinessId = auth()->guard('api')->user()->bussiness_id;

            $rules = [
                'name'        => 'required|string|max:255|unique:categories,name',
                'description' => 'nullable|string',
            ];

            $request->merge(['bussiness_id' => $userBusinessId]);

            $data = $this->requestService->postData(Category::class, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to create category', 500);
            }

            event(new LoggingEvent('Category created successfully', 'categories'));

            return ApiHelper::success('Category created successfully', $data, 201);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get all categories.
     */
    public function index(Request $request)
    {
        try {
            $perPage    = (int) $request->query('items', 10);
            $categories = Category::with('products')->paginate($perPage);

            if ($categories->isEmpty()) {
                return ApiHelper::error('No categories found', 404);
            }

            return ApiHelper::success('Categories retrieved successfully', $categories, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get a category by ID.
     */
    public function show($id)
    {
        try {
            $category = Category::with('products')->find($id);

            if (!$category) {
                return ApiHelper::error('Category not found', 404);
            }

            return ApiHelper::success('Category retrieved successfully', $category, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update a category by ID.
     */
    public function update(Request $request, $id)
    {
        try {
            $rules = [
                'name'        => 'required|string|max:255|unique:categories,name,' . $id,
                'description' => 'nullable|string',
            ];

            $data = $this->requestService->updateDataById(Category::class, $id, $request, $rules);

            if (!$data) {
                return ApiHelper::error('Failed to update category', 500);
            }

            event(new LoggingEvent('Category with id ' . $id . ' updated successfully', 'categories'));

            return ApiHelper::success('Category updated successfully', $data, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Delete a category by ID.
     */
    public function destroy($id)
    {
        try {
            $this->requestService->deleteDataById(Category::class, $id);

            event(new LoggingEvent('Category with id ' . $id . ' deleted successfully', 'categories'));

            return ApiHelper::success('Category deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error('An error occurred: ' . $e->getMessage(), 500);
        }
    }
}
