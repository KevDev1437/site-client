export interface Product {
  id: string;
  title: string;
  description?: string | null;
  price: number;
  image_url?: string | null;
  stock: number;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
  price_stripe_id?: string | null;
}
