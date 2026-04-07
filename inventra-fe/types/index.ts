// ========== API Response Types ==========

export interface ApiResponse<T = any> {
  status: boolean;
  message: string;
  data: T;
}

export interface PaginatedData<T> {
  current_page: number;
  data: T[];
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}



export interface Product {
  id: number;
  name: string;
  sku: string;
  selling_price: number;
  stock: number;
  category_id: number;
  product_type: "kuliner" | "barang";
  unit: string;
  expired_date: string | null;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  suppliers?: Supplier[];
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  selling_price: number;
  stock: number;
  category_id: number;
  product_type: "kuliner" | "barang";
  unit: string;
  expired_date?: string | null;
  supplier_id?: number[];
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

export interface CreateCategoryPayload {
  name: string;
  description?: string;
}

export interface Business {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string | null;
  logo: string | null;
  description: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface Supplier {
  id: number;
  name: string;
  address?: string;
  phone?: string;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateSupplierPayload {
  name: string;
  address?: string;
  phone?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  image: string | null;
  role: "SUPERADMIN" | "USER";
  bussiness_id: number | null;
  created_at: string;
  updated_at: string;
  roles?: Role[];
  business?: Business;
}

export interface CreateUserPayload {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: Permission[];
}

export interface CreateRolePayload {
  name: string;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePermissionPayload {
  name: string;
  guard_name: string;
}

export interface Sale {
  id: number;
  product_id: number;
  quantity: number;
  selling_price: number;
  total_price: number;
  hpp: number;
  profit: number;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CreateSalePayload {
  product_id: number;
  quantity: number;
  selling_price: number;
}

export interface StockTransaction {
  id: number;
  product_id: number;
  quantity: number;
  type: "IN" | "OUT" | "ADJUST";
  note: string | null;
  bussiness_id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface StockTransactionItem {
  product_id: number;
  quantity: number;
  type: "IN" | "OUT" | "ADJUST";
  note?: string;
}

export interface CreateStockTransactionPayload {
  transactions: StockTransactionItem[];
}

export interface FinancialCategory {
  id: number;
  name: string;
  type: "income" | "expense";
  bussiness_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateFinancialCategoryPayload {
  name: string;
  type: "income" | "expense";
}

export interface FinancialTransaction {
  id: number;
  financial_category_id: number;
  type: "income" | "expense";
  amount: number;
  note: string | null;
  transaction_date: string;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
  financial_category?: FinancialCategory;
}

export interface CreateFinancialTransactionPayload {
  financial_category_id: number;
  type: "income" | "expense";
  amount: number;
  note?: string;
  transaction_date: string;
}

// ========== HPP Component Types ==========

export interface HppComponent {
  id: number;
  name: string;
  product_id: number;
  cost: number;
  bussiness_id: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface CreateHppComponentPayload {
  name: string;
  product_id: number;
  cost: number;
}
