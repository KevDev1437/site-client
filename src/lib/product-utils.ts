import { Product } from '@/types/product';

/**
 * Type pour les données brutes de Supabase (table products)
 */
interface SupabaseProductRow {
  id: string;
  title: string;
  description?: string | null;
  price: number | string;
  image_url?: string | null;
  stock: number | string | null;
  is_active?: boolean | null;
  created_at?: string;
  updated_at?: string;
  price_stripe_id?: string | null;
}

/**
 * Convertit un produit de Supabase (avec types Decimal) vers notre type Product
 * Gère la conversion des types Decimal vers number pour les champs numériques
 */
export function mapSupabaseProduct(supabaseProduct: SupabaseProductRow): Product {
  return {
    id: supabaseProduct.id,
    title: supabaseProduct.title,
    description: supabaseProduct.description ?? null,
    price: typeof supabaseProduct.price === 'number' 
      ? supabaseProduct.price 
      : parseFloat(supabaseProduct.price?.toString() || '0'),
    image_url: supabaseProduct.image_url ?? "/placeholder.png",
    stock: typeof supabaseProduct.stock === 'number'
      ? supabaseProduct.stock
      : parseInt(String(supabaseProduct.stock) || '0', 10),
    is_active: supabaseProduct.is_active ?? null,
    created_at: supabaseProduct.created_at,
    updated_at: supabaseProduct.updated_at,
    price_stripe_id: supabaseProduct.price_stripe_id ?? null,
  };
}

/**
 * Vérifie si un produit est en stock
 */
export function isProductInStock(product: Product): boolean {
  return product.stock > 0;
}

/**
 * Vérifie si un produit est actif
 */
export function isProductActive(product: Product): boolean {
  return product.is_active !== false;
}

/**
 * Vérifie si un produit est disponible (en stock ET actif)
 */
export function isProductAvailable(product: Product): boolean {
  return isProductInStock(product) && isProductActive(product);
}
