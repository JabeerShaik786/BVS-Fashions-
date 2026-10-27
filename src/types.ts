export type CategoryId = 
  | 'all'
  | 'sarees'
  | 'kanchi-pattu'
  | 'banarasi'
  | 'zari-silk'
  | 'georgette'
  | 'pattu-sarees'
  | 'soft-silk'
  | 'tissue-silk'
  | 'organza'
  | 'womens-ethnic'
  | 'mens-wear'
  | 'kids-wear'
  | 'festive-wedding'
  | 'new-arrivals';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  image: string;
  secondaryImage?: string;
  colors: ProductColor[];
  sizes: string[];
  fabric: string;
  occasion: string;
  description: string;
  sku?: string;
  regular_price?: number;
  sale_price?: number | null;
  images?: string[];
  availability_status?: 'in_stock' | 'out_of_stock' | 'made_to_order';
  is_published?: boolean;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isFestive?: boolean;
  created_at?: string;
  updated_at?: string;
  ratingAverage?: number; // purely visual badge or omitted
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export type ProductTab = 'new-arrivals' | 'bestsellers' | 'festive';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info';
  message: string;
}
