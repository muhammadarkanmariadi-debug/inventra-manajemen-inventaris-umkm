<?php

namespace App\Domain\Purchase\Actions;

use App\Domain\Purchase\Models\Supplier;
use App\Events\LoggingEvent;

class UpdateSupplierAction
{
    public function execute(int $id, array $data, int $businessId): Supplier
    {
        /** @var Supplier $supplier */
        $supplier = Supplier::where('id', $id)
            ->where('bussiness_id', $businessId)
            ->firstOrFail();

        $supplier->update($data);

        event(new LoggingEvent('Supplier with id ' . $id . ' updated successfully', 'suppliers'));

        return $supplier;
    }
}
