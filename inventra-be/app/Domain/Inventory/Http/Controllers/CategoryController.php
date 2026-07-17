<?php

namespace App\Domain\Inventory\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Domain\Inventory\Models\Category;
use App\Domain\Inventory\Http\Requests\CategoryRequest;
use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function store(CategoryRequest $request)
    {
        try {
            $data = $request->validated();
            $data['bussiness_id'] = auth()->guard('api')->user()->bussiness_id;

            $category = Category::create($data);

            event(new LoggingEvent('Category created successfully', 'categories'));

            return ApiHelper::success('Category created successfully', $category, 201);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function index(Request $request)
    {
        try {
            $perPage = (int) $request->query('items', 10);
            $categories = Category::with('products')->paginate($perPage);

            if ($categories->isEmpty()) {
                return ApiHelper::error('No categories found', 404);
            }

            return ApiHelper::success('Categories retrieved successfully', $categories, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function show($id)
    {
        try {
            $category = Category::with('products')->find($id);

            if (!$category) {
                return ApiHelper::error('Category not found', 404);
            }

            return ApiHelper::success('Category retrieved successfully', $category, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function update(CategoryRequest $request, $id)
    {
        try {
            $category = Category::find($id);
            if (!$category) {
                return ApiHelper::error('Category not found', 404);
            }

            $category->update($request->validated());

            event(new LoggingEvent('Category with id ' . $id . ' updated successfully', 'categories'));

            return ApiHelper::success('Category updated successfully', $category, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }

    public function destroy($id)
    {
        try {
            $category = Category::find($id);
            if (!$category) {
                return ApiHelper::error('Category not found', 404);
            }

            $category->delete();

            event(new LoggingEvent('Category with id ' . $id . ' deleted successfully', 'categories'));

            return ApiHelper::success('Category deleted successfully', null, 200);
        } catch (\Exception $e) {
            return ApiHelper::error($e->getMessage(), 500);
        }
    }
}
