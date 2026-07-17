<?php

namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class DomainServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Repository bindings per domain will be registered here across upcoming phases.
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->mapDomainRoutes();
    }

    /**
     * Load routes for each domain.
     */
    protected function mapDomainRoutes(): void
    {
        $domains = [
            'Inventory',
            'Sales',
            'Purchase',
            'Auth',
            'Notification',
        ];

        foreach ($domains as $domain) {
            $routePath = base_path("app/Domain/{$domain}/routes.php");
            if (file_exists($routePath)) {
                Route::middleware('api')
                    ->prefix('api')
                    ->group($routePath);
            }
        }
    }
}
