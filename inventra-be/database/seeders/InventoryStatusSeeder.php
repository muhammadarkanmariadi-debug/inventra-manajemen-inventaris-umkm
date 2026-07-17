<?php

namespace Database\Seeders;

use App\Models\InventoryStatus;
use Illuminate\Database\Seeder;

class InventoryStatusSeeder extends Seeder
{
    public function run(): void
    {
        $statuses = [
            [
                'code' => 'UNRELEASED',
                'name' => 'Unreleased / Pending',
                'is_usable' => false,
                'description' => 'Newly inserted inventory awaiting QC.',
            ],
            [
                'code' => 'ON_HOLD',
                'name' => 'On Hold',
                'is_usable' => false,
                'description' => 'Temporarily locked from being used or sold.',
            ],
            [
                'code' => 'REJECT',
                'name' => 'Rejected',
                'is_usable' => false,
                'description' => 'Failed QC or damaged. Cannot be used.',
            ],
            [
                'code' => 'READY',
                'name' => 'Ready for Sale',
                'is_usable' => true,
                'description' => 'Inventory is verified and ready for usage/sale.',
            ],
        ];

        foreach ($statuses as $status) {
            InventoryStatus::updateOrCreate(
                ['code' => $status['code']],
                $status
            );
        }
    }
}
