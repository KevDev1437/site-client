export interface Atelier {
  id: string;
  slug: string;
  title: string;
  date: string;
  location: string;
  price: number;
  seats: number;
  total_seats: number;
  price_stripe_id?: string;
  cover_url: string;
  excerpt?: string;
  description?: string;
  published: boolean;
  created_at?: string;
}
