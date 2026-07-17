<?php

namespace App\Domain\Purchase\Actions;

use App\Domain\Purchase\Models\Supplier;
use App\Events\LoggingEvent;
use App\Services\RequestService;

class DeleteSupplierAction
{
    protected RequestService $requestService;

    public function __construct(RequestService $requestService)
    {
        $this->requestService = $requestService;
    }

    public function execute(int $id, int $businessId): bool
    {
        /** @var Supplier $supplier */
        $supplier = Supplier::where('id', $id)
            ->where('bussiness_id', $businessId)
            ->firstOrFail();

        $supplier->delete();

        event(new LoggingEvent('Supplier with id ' . $id . ' deleted successfully', 'suppliers'));

        return true;
    }
}
