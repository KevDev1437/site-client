export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_amount: number; // cents
  currency: string;
  created_at: string;
  product?: {
    title?: string;
    image_url?: string;
  } | null;
}

export interface OrderWithItems {
  id: string;
  user_id: string;
  stripe_session_id: string;
  amount: number; // total amount
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}
