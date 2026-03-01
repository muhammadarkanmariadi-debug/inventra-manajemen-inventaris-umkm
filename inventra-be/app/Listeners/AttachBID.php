<?php

namespace App\Listeners;

use App\Events\BussinessEvent;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class AttachBID
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(BussinessEvent $event): void
    {
      $userId = auth()->guard('api')->id();
      User::where('id', $userId)->update(['bussiness_id' => $event->bussiness->id]);

    }
}
