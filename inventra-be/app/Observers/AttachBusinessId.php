<?php

namespace App\Observers;

use App\Models\Business;
use App\Models\User;

class AttachBusinessId
{
    /**
     * Handle the Business "created" event.
     */
    public function created(Business $business): void
    {
        $userId = auth()->guard('api')->id();
        User::where('id', $userId)->update(['bussiness_id' => $business->id]);
    }

    /**
     * Handle the Business "updated" event.
     */
    public function updated(Business $business): void
    {
        $userId = auth()->guard('api')->id();
        User::where('id', $userId)->update(['bussiness_id' => $business->id]);
    }

    /**
     * Handle the Business "deleted" event.
     */
    public function deleted(Business $business): void
    {
        //
    }

    /**
     * Handle the Business "restored" event.
     */
    public function restored(Business $business): void
    {
        //
    }

    /**
     * Handle the Business "force deleted" event.
     */
    public function forceDeleted(Business $business): void
    {
        //
    }
}
