import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { Product, CartItem, CategoryId, ProductColor, ProductTab, ToastMessage } from '../types';
import { MOCK_PRODUCTS } from '../data/products';
import { getApiBaseUrl } from '../admin/adminApi';
import { supabase, isClientSupabaseConfigured } from '../supabase';

interface ShopContextType {
  products: Product[];
  filteredProducts: Product[];
  selectedCategory: CategoryId;
  setSelectedCategory: (cat: CategoryId) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: ProductTab;
  setActiveTab: (tab: ProductTab) => void;
  loadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Routing / View mode: 'public' or 'admin'
  viewMode: 'public' | 'admin';
  setViewMode: (mode: 'public' | 'admin') => void;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, color?: ProductColor, quantity?: number) => void;
  updateCartQuantity: (productId: string, size: string, delta: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;

  // Wishlist
  wishlistIds: string[];
  wishlistProducts: Product[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Quick view
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Mobile drawer & modals
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isAccountModalOpen: boolean;
  setIsAccountModalOpen: (open: boolean) => void;
  activeInfoModal: 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms' | null;
  setActiveInfoModal: (modal: 'faq' | 'shipping' | 'returns' | 'privacy' | 'terms' | null) => void;

  // Notification Toast
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'cart' | 'wishlist' | 'info') => void;
}

export const ShopContext = createContext<ShopContextType | undefined>(undefined);

function mapDbProductToProduct(item: any): Product {
  const regularPrice = Number(item.regular_price);
  const salePrice = item.sale_price ? Number(item.sale_price) : undefined;
  const activePrice = salePrice || regularPrice;
  const discount =
    salePrice && regularPrice > salePrice
      ? Math.round((1 - salePrice / regularPrice) * 100)
      : undefined;

  const imagesList =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'];

  return {
    id: String(item.id),
    sku: item.sku,
    name: item.name,
    category: item.category_id as CategoryId,
    categoryLabel:
      item.category_id === 'sarees'
        ? 'Sarees'
        : item.category_id === 'womens-ethnic'
        ? "Women's Wear"
        : item.category_id === 'mens-wear'
        ? "Men's Wear"
        : item.category_id === 'kids-wear'
        ? "Kids' Wear"
        : 'Festive & Wedding',
    price: activePrice,
    originalPrice: salePrice ? regularPrice : undefined,
    discountPercent: discount,
    image: imagesList[0],
    secondaryImage: imagesList[1],
    images: imagesList,
    colors: Array.isArray(item.colors) ? item.colors : [],
    sizes: Array.isArray(item.sizes) ? item.sizes : ['Standard'],
    fabric: item.fabric || 'Authentic Handloom Weave',
    occasion: item.occasion || 'Festivals & Celebrations',
    description: item.description,
    availability_status: item.availability_status || 'in_stock',
    is_published: item.is_published,
    isNewArrival: Boolean(item.is_new_arrival),
    isBestseller: Boolean(item.is_bestseller),
    isFestive: Boolean(item.is_festive),
  };
}

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ProductTab>('new-arrivals');

  // Detect admin view from URL or hash
  const [viewMode, setViewModeState] = useState<'public' | 'admin'>(() => {
    if (window.location.pathname.includes('/admin') || window.location.hash.startsWith('#admin')) {
      return 'admin';
    }
    return 'public';
  });

  const setViewMode = (mode: 'public' | 'admin') => {
    setViewModeState(mode);
    if (mode === 'admin') {
      window.location.hash = 'admin';
    } else {
      window.location.hash = '';
    }
  };

  // Sync hash changes
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash.startsWith('#admin')) {
        setViewModeState('admin');
      } else {
        setViewModeState('public');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch published products from real persistent database or live API
  const refreshProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);

      // Strategy A: Direct Supabase client query (ideal for GitHub Pages serverless static hosting)
      if (isClientSupabaseConfigured && supabase) {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          setProducts(data.map(mapDbProductToProduct));
          return;
        }
      }

      // Strategy B: Deployed Express API (or localhost only during local development)
      const apiBase = getApiBaseUrl();
      if (apiBase) {
        const res = await fetch(`${apiBase}/products`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products.map(mapDbProductToProduct));
            return;
          }
        }
      }

      // Strategy C: If remote database is not configured yet, use mock products without making failing network calls
    } catch {
      // Gracefully retain current products if offline
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  // Load cart from localStorage or start empty
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('bvs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load wishlist from localStorage or start empty
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bvs_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<'faq' | 'shipping' | 'returns' | 'privacy' | 'terms' | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bvs_cart', JSON.stringify(cart));
    } catch {
      // ignore in constrained environments
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bvs_wishlist', JSON.stringify(wishlistIds));
    } catch {
      // ignore
    }
  }, [wishlistIds]);

  const showToast = (message: string, type: 'cart' | 'wishlist' | 'info' = 'info') => {
    const id = Date.now().toString();
    setToast({ id, type, message });
    setTimeout(() => {
      setToast((curr) => (curr?.id === id ? null : curr));
    }, 3500);
  };

  const addToCart = (
    product: Product,
    size?: string,
    color?: ProductColor,
    quantity = 1
  ) => {
    const chosenSize = size || product.sizes[0] || 'Standard';
    const chosenColor = color || product.colors[0] || { name: 'Standard', hex: '#702C38' };

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === chosenSize
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      } else {
        return [
          ...prev,
          {
            product,
            selectedColor: chosenColor,
            selectedSize: chosenSize,
            quantity,
          },
        ];
      }
    });

    showToast(`Added "${product.name.slice(0, 28)}..." to bag`, 'cart');
  };

  const updateCartQuantity = (productId: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
    showToast('Item removed from shopping bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed from wishlist`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Added to your wishlist`, 'wishlist');
        return [...prev, product.id];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Filter products based on search and category
  const filteredProducts = products.filter((p) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCategory = p.categoryLabel.toLowerCase().includes(q);
      const matchFabric = p.fabric.toLowerCase().includes(q);
      const matchOccasion = p.occasion.toLowerCase().includes(q);
      const matchSku = p.sku ? p.sku.toLowerCase().includes(q) : false;
      if (!matchName && !matchCategory && !matchFabric && !matchOccasion && !matchSku) {
        return false;
      }
    }

    // Category filter
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'new-arrivals') return p.isNewArrival === true;
    return p.category === selectedCategory;
  });

  return (
    <ShopContext.Provider
      value={{
        products,
        filteredProducts,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        loadingProducts,
        refreshProducts,
        viewMode,
        setViewMode,
        cart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        wishlistIds,
        wishlistProducts,
        wishlistCount: wishlistIds.length,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,
        quickViewProduct,
        setQuickViewProduct,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAccountModalOpen,
        setIsAccountModalOpen,
        activeInfoModal,
        setActiveInfoModal,
        toast,
        showToast,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export { useShop } from './useShop';
