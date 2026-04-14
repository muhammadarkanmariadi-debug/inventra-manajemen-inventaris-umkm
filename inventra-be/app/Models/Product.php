<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $guarded = ['id'];
    protected $appends = ['stock'];

    public function getStockAttribute()
    {
        return $this->inventories()->whereHas('status', function ($query) {
            $query->where('is_usable', true);
        })->sum('quantity');
    }

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function business()
    {
        return $this->belongsTo(Business::class, 'bussiness_id', 'id');
    }

    public function inventories()
    {
        return $this->hasMany(Inventory::class, 'product_id', 'id');
    }

    public function sales()
    {
        return $this->hasMany(Sale::class, 'product_id', 'id');
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class, 'product_id', 'id');
    }

    /**
     * Get the latest purchase price for this product.
     */
    public function getLatestPurchasePriceAttribute()
    {
        $latestItem = $this->purchaseItems()
            ->join('purchases', 'purchase_items.purchase_id', '=', 'purchases.id')
            ->orderBy('purchases.purchase_date', 'desc')
            ->orderBy('purchase_items.created_at', 'desc')
            ->select('purchase_items.price')
            ->first();

        return $latestItem ? (float) $latestItem->price : null;
    }

    /**
     * Get the average purchase price for this product.
     */
    public function getAveragePurchasePriceAttribute()
    {
        $avg = $this->purchaseItems()->avg('price');

        return $avg ? round((float) $avg, 2) : null;
    }
}
