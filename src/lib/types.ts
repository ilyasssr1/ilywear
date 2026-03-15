/**
 * Global TypeScript type definitions
 */

export interface BaseEntity {
  id: string | number;
  created_at?: string;
  updated_at?: string;
}

export interface User extends BaseEntity {
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  avatar?: string;
}

export interface Product extends BaseEntity {
  title: string;
  slug?: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  image: string;
  images?: string[];
  colors?: string[];
  sizes?: string[];
  stock?: number;
  rating?: number;
  reviews_count?: number;
  tags?: string[];
  is_featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order extends BaseEntity {
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_city: string;
  customer_address: string;
  items: OrderItem[];
  total_price: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  payment_method: "cash" | "card" | "bank_transfer";
  notes?: string;
}

export interface OrderItem {
  product_id: string | number;
  product_title: string;
  quantity: number;
  price: number;
  selected_size?: string;
  selected_color?: string;
}

export interface Review extends BaseEntity {
  product_id: string | number;
  user_id?: string;
  user_name: string;
  rating: number;
  text: string;
}

export interface WishlistItem extends BaseEntity {
  product_id: string | number;
  user_id?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export type SortOrder = "asc" | "desc";

export interface FilterOptions {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  sortBy?: "price" | "rating" | "newest" | "popular";
  sortOrder?: SortOrder;
}

export interface ToastOptions {
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type AsyncState<T> =
  | { status: "idle"; data: null; error: null }
  | { status: "loading"; data: null; error: null }
  | { status: "success"; data: T; error: null }
  | { status: "error"; data: null; error: Error };
