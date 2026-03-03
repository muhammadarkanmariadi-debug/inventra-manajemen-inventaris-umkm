<?php

namespace App\Observers;

use App\Models\Bussiness;
use App\Models\User;

class AttachBID
{
    /**
     * Handle the Bussiness "created" event.
     */
    public function created(Bussiness $bussiness): void
    {
        $userId = auth()->guard('api')->id();
        User::where('id', $userId)->update(['bussiness_id' => $bussiness->id]);
    }

    /**
     * Handle the Bussiness "updated" event.
     */
    public function updated(Bussiness $bussiness): void
    {
        $userId = auth()->guard('api')->id();
        User::where('id', $userId)->update(['bussiness_id' => $bussiness->id]);
    }

    /**
     * Handle the Bussiness "deleted" event.
     */
    public function deleted(Bussiness $bussiness): void
    {
        //
    }

    /**
     * Handle the Bussiness "restored" event.
     */
    public function restored(Bussiness $bussiness): void
    {
        //
    }

    /**
     * Handle the Bussiness "force deleted" event.
     */
    public function forceDeleted(Bussiness $bussiness): void
    {
        //
    }
}
