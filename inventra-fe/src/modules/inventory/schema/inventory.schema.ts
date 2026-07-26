import { z } from 'zod';

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nama kategori wajib diisi').max(255),
  description: z.string().nullable().optional(),
  bussiness_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const locationSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nama lokasi wajib diisi').max(255),
  bussiness_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nama produk wajib diisi').max(255),
  sku: z.string().min(1, 'SKU wajib diisi').max(255),
  selling_price: z.coerce.number().min(0, 'Harga jual tidak boleh negatif'),
  category_id: z.coerce.number().int().positive('Kategori wajib dipilih'),
  product_type: z.enum(['kuliner', 'barang']),
  unit: z.string().min(1, 'Satuan wajib diisi').max(255),
  image: z.string().nullable().optional(),
  expired_date: z.string().nullable().optional(),
  bussiness_id: z.number().optional(),
  category: categorySchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const inventoryLogSchema = z.object({
  id: z.number().optional(),
  product_id: z.number(),
  location_id: z.number(),
  user_id: z.number(),
  change_type: z.string(),
  quantity_changed: z.number(),
  current_quantity: z.number(),
  reference_id: z.number().nullable().optional(),
  reference_type: z.string().nullable().optional(),
  created_at: z.string().optional(),
});

export const stockAdjustmentSchema = z.object({
  product_id: z.coerce.number().int().positive('Produk wajib dipilih'),
  location_id: z.coerce.number().int().positive('Lokasi wajib dipilih'),
  quantity: z.coerce.number().int(),
  change_type: z.string().min(1, 'Tipe perubahan wajib dipilih'),
  reference_id: z.number().nullable().optional(),
  reference_type: z.string().nullable().optional(),
});

export type Category = z.infer<typeof categorySchema>;
export type Location = z.infer<typeof locationSchema>;
export type Product = z.infer<typeof productSchema>;
export type InventoryLog = z.infer<typeof inventoryLogSchema>;
export type StockAdjustment = z.infer<typeof stockAdjustmentSchema>;
