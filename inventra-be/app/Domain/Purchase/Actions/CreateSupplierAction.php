<?php

namespace App\Domain\Purchase\Actions;

use App\Domain\Purchase\Models\Supplier;
use App\Events\LoggingEvent;
use App\Services\RequestService;

class CreateSupplierAction
{
    protected RequestService $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function execute(array $data, int $businessId): Supplier
    {
        $data['bussiness_id'] = $businessId;
        
        $supplier = Supplier::create($data);

        event(new LoggingEvent('Supplier was successfully created', 'suppliers'));

        return $supplier;
    }
}
