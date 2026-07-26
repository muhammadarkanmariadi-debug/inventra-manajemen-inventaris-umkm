<?php

namespace App\Domain\Notification\Notifications;

use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class StockLowNotification extends Notification
{
    public function __construct(private string $productName) {}

    public function via($notifiable): array
    {
        return [WebPushChannel::class, 'broadcast']; // broadcast = Reverb
    }

    public function toWebPush($notifiable, $notification): WebPushMessage
    {
        return (new WebPushMessage)
            ->title('Stok Menipis')
            ->icon('/images/logo/logo.svg')
            ->body("Stok {$this->productName} hampir habis");
    }

    public function toArray($notifiable): array
    {
        return [
            'title' => 'Stok Menipis',
            'body' => "Stok {$this->productName} hampir habis",
            'product_name' => $this->productName,
        ];
    }
}
