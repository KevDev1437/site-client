export interface Workshop {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  seats: number;
  price_stripe_id?: string;
  cover_url?: string;
  excerpt?: string;
  created_at: string;
}

export interface Order {
  id: string;
  workshop_id: string;
  email: string;
  amount: number;
  currency: string;
  status: string;
  stripe_session_id?: string;
  created_at: string;
}
