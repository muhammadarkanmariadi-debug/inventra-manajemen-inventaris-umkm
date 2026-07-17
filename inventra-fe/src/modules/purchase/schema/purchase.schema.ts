import { z } from 'zod';
import { productSchema } from '@/modules/inventory/schema/inventory.schema';

export const supplierSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, 'Nama supplier wajib diisi').max(255),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  bussiness_id: z.number().optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const purchaseItemSchema = z.object({
  id: z.number().optional(),
  purchase_id: z.number().optional(),
  product_id: z.coerce.number().int().positive('Pilih produk'),
  quantity: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
  price: z.coerce.number().min(0, 'Harga tidak boleh negatif'),
  subtotal: z.coerce.number().optional(),
  product: productSchema.optional(),
});

export const purchaseSchema = z.object({
  id: z.number().optional(),
  supplier_id: z.coerce.number().int().positive('Pilih supplier'),
  purchase_date: z.string().min(1, 'Tanggal pembelian wajib diisi'),
  notes: z.string().nullable().optional(),
  total_amount: z.coerce.number().optional(),
  bussiness_id: z.number().optional(),
  supplier: supplierSchema.optional(),
  items: z.array(purchaseItemSchema).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createPurchasePayloadSchema = z.object({
  supplier_id: z.coerce.number().int().positive('Supplier wajib dipilih'),
  purchase_date: z.string().min(1, 'Tanggal pembelian wajib diisi'),
  notes: z.string().nullable().optional(),
  items: z.array(
    z.object({
      product_id: z.coerce.number().int().positive('Produk wajib dipilih'),
      quantity: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
      price: z.coerce.number().min(0, 'Harga wajib diisi'),
    })
  ).min(1, 'Minimal 1 item pembelian'),
});

export type Supplier = z.infer<typeof supplierSchema>;
export type PurchaseItem = z.infer<typeof purchaseItemSchema>;
export type Purchase = z.infer<typeof purchaseSchema>;
export type CreatePurchasePayload = z.infer<typeof createPurchasePayloadSchema>;
