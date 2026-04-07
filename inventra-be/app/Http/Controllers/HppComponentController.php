<?php

namespace App\Http\Controllers;

use App\Events\LoggingEvent;
use App\Helpers\ApiHelper;
use App\Models\HppComponent;
use App\Services\RequestService;
use Illuminate\Http\Request;

class HppComponentController extends Controller
{
    protected $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    /**
     * Create a new HPP component.
     */
    public function store(Request $request)
    {
        $rules = [
            'name'       => 'required|string|max:255',
            'product_id' => 'required|integer|exists:products,id',
            'cost'       => 'required|numeric|min:0',
        ];

        $request->merge(['bussiness_id' => auth()->guard('api')->user()->bussiness_id]);

        $data = $this->requestService->postData(HppComponent::class, $request, $rules);

        event(new LoggingEvent('HPP Component was successfully created', 'hppComponents'));

        return ApiHelper::success('HPP Component created successfully', $data, 201);
    }

    /**
     * Get HPP components, optionally filtered by product_id query param.
     */
    public function indexByProduct(Request $request)
    {
        $perPage = (int) $request->query('items', 10);
        $query   = HppComponent::where('bussiness_id', auth()->guard('api')->user()->bussiness_id);

        if ($request->has('product_id')) {
            $query->where('product_id', $request->query('product_id'));
        }else if($request->has('include') == 'product'){
            $query->with('product');
        }   

        $hppComponents = $query->paginate($perPage);

        return ApiHelper::success('HPP Components retrieved successfully', $hppComponents, 200);
    }

    /**
     * Get an HPP component by ID.
     */
    public function show($id)
    {
        $hppComponent = HppComponent::where('id', $id)
            ->where('bussiness_id', auth()->guard('api')->user()->bussiness_id)
            ->first();

        if (!$hppComponent) {
            return ApiHelper::error('HPP Component not found', 404);
        }

        return ApiHelper::success('HPP Component retrieved successfully', $hppComponent, 200);
    }

    /**
     * Update an HPP component by ID.
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'name'       => 'sometimes|required|string|max:255',
            'product_id' => 'sometimes|required|integer|exists:products,id',
            'cost'       => 'sometimes|required|numeric|min:0',
        ];

        $data = $this->requestService->updateDataById(HppComponent::class, $id, $request, $rules);

        event(new LoggingEvent('HPP Component with id: ' . $id . ' updated successfully', 'hppComponents'));

        return ApiHelper::success('HPP Component updated successfully', $data, 200);
    }

    /**
     * Delete an HPP component by ID.
     */
    public function destroy($id)
    {
        $this->requestService->deleteDataById(HppComponent::class, $id);

        event(new LoggingEvent('HPP Component with id: ' . $id . ' deleted successfully', 'hppComponents'));

        return ApiHelper::success('HPP Component deleted successfully', null, 200);
    }
}
