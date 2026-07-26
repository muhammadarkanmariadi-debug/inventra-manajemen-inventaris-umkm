import { z } from 'zod';
import { productSchema } from '@/modules/inventory/schema/inventory.schema';

export const saleSchema = z.object({
  id: z.number().optional(),
  product_id: z.number().optional(),
  inventory_id: z.number().optional(),
  quantity: z.coerce.number().min(1, 'Jumlah minimal 1'),
  selling_price: z.coerce.number().min(0, 'Harga jual tidak boleh negatif'),
  total_price: z.coerce.number().optional(),
  bussiness_id: z.number().optional(),
  buyer_name: z.string().nullable().optional(),
  buyer_phone: z.string().nullable().optional(),
  buyer_address: z.string().nullable().optional(),
  product: productSchema.optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export const createSalePayloadSchema = z.object({
  inventory_id: z.coerce.number().int().positive('Pilih batch stok (inventaris)'),
  quantity: z.coerce.number().int().min(1, 'Jumlah minimal 1'),
  selling_price: z.coerce.number().min(0, 'Harga jual wajib diisi'),
  buyer_name: z.string().nullable().optional(),
  buyer_phone: z.string().nullable().optional(),
  buyer_address: z.string().nullable().optional(),
});

export type Sale = z.infer<typeof saleSchema>;
export type CreateSalePayload = z.infer<typeof createSalePayloadSchema>;
