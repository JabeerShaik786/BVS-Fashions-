import { supabaseAdmin, isLiveSupabaseConfigured } from './supabase';

export interface DbCategory {
  id: string;
  name: string;
  description: string;
  display_order: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface DbProductColor {
  name: string;
  hex: string;
}

export interface DbProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  category_id: string;
  regular_price: number;
  sale_price?: number | null;
  images: string[];
  sizes: string[];
  colors: DbProductColor[];
  fabric?: string | null;
  occasion?: string | null;
  availability_status: 'in_stock' | 'out_of_stock' | 'made_to_order';
  is_published: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  is_festive: boolean;
  created_at: string;
  updated_at: string;
}

// Initial seed categories
const INITIAL_CATEGORIES: DbCategory[] = [
  {
    id: 'sarees',
    name: 'Sarees',
    description: 'Kanjeevaram, Banarasi, Chanderi & Daily Weaves',
    display_order: 1,
    image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'womens-ethnic',
    name: "Women's Ethnic Wear",
    description: 'Anarkalis, Kurta Sets, Shararas & Lehengas',
    display_order: 2,
    image_url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'mens-wear',
    name: "Men's Traditional Wear",
    description: 'Kurtas, Nehru Jackets, Sherwanis & Dhoti Sets',
    display_order: 3,
    image_url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'kids-wear',
    name: "Kids' Ethnic Wear",
    description: 'Comfortable Lehengas, Kurta Pajamas & Pattu Sets',
    display_order: 4,
    image_url: 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'festive-wedding',
    name: 'Festive & Wedding Wear',
    description: 'Heavy Zari Lehengas, Brocades & Grand Outfits',
    display_order: 5,
    image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Initial seed products (12 diverse items)
const INITIAL_PRODUCTS: DbProduct[] = [
  {
    id: 'bvs-prod-001',
    sku: 'BVS-SAR-001',
    name: 'Crimson Banarasi Silk Saree with Zari Border',
    description: 'An elegant Banarasi silk drape featuring detailed golden zari motifs along the border and pallu. Comes with an unstitched matching blouse piece with coordinating zari work.',
    category_id: 'sarees',
    regular_price: 4999,
    sale_price: 3499,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    colors: [
      { name: 'Deep Maroon', hex: '#702C38' },
      { name: 'Royal Emerald', hex: '#1B4D3E' },
      { name: 'Antique Gold', hex: '#D4B16A' },
    ],
    fabric: 'Pure Banarasi Art Silk with Gold Weft',
    occasion: 'Weddings, Pujas & Festive Celebrations',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-002',
    sku: 'BVS-WMN-002',
    name: 'Teal Green Embroidered Anarkali Kurta Set',
    description: 'Floor-length Anarkali silhouette tailored in breathable Chanderi silk with delicate thread embroidery around the neckline. Paired with comfortable churidar and scalloped dupatta.',
    category_id: 'womens-ethnic',
    regular_price: 3299,
    sale_price: 2499,
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Teal Green', hex: '#1C5B63' },
      { name: 'Wine Plum', hex: '#582C4D' },
      { name: 'Mustard Gold', hex: '#D6A43B' },
    ],
    fabric: 'Chanderi Cotton Silk with Organza Dupatta',
    occasion: 'Festivals, Sangeet & Family Gatherings',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-003',
    sku: 'BVS-MEN-003',
    name: "Ivory & Gold Raw Silk Men's Kurta Pajama",
    description: 'Crisp mandarin collar kurta in fine textured dupion silk featuring delicate tone-on-tone button detailing. Complete with an ivory drawstring churidar pajama.',
    category_id: 'mens-wear',
    regular_price: 2799,
    sale_price: 1999,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: [
      { name: 'Ivory Gold', hex: '#F7F0E5' },
      { name: 'Midnight Navy', hex: '#1E293B' },
      { name: 'Maroon', hex: '#702C38' },
    ],
    fabric: 'Dupion Raw Silk Blend',
    occasion: 'Weddings, Engagements & Traditional Rituals',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: false,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-004',
    sku: 'BVS-KID-004',
    name: 'Mustard Yellow Festive Pattu Lehenga for Girls',
    description: 'Designed specifically with soft, gentle inner cotton lining so children stay comfortable all day. Features a flared golden-bordered skirt and fitted peplum top.',
    category_id: 'kids-wear',
    regular_price: 2299,
    sale_price: 1699,
    images: [
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'],
    colors: [
      { name: 'Haldi Mustard', hex: '#E5A93C' },
      { name: 'Rani Pink', hex: '#C2185B' },
      { name: 'Parrot Green', hex: '#2E7D32' },
    ],
    fabric: 'Soft Art Silk with 100% Cotton Inner Lining',
    occasion: 'Festivals, Birthday Ceremonies & Weddings',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-005',
    sku: 'BVS-WED-005',
    name: 'Royal Heritage Brocade Bridal & Reception Lehenga',
    description: 'A masterpiece created for grand moments. Features a full 4-meter flared silhouette with intricate zardozi, sequins, and antique gold threadwork. Complete with velvet blouse piece and dual dupattas.',
    category_id: 'festive-wedding',
    regular_price: 9499,
    sale_price: 6999,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Semi-Stitched (Fits up to 44 waist)'],
    colors: [
      { name: 'Crimson Vermilion', hex: '#9E2A2B' },
      { name: 'Wine Velvet', hex: '#4A1525' },
      { name: 'Rose Gold', hex: '#C58F7D' },
    ],
    fabric: 'Heavy Brocade Silk with Handworked Zardozi',
    occasion: 'Bridal Trousseau, Reception & Grand Celebrations',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: false,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-006',
    sku: 'BVS-SAR-006',
    name: 'Sage Green Chanderi Saree with Golden Buti',
    description: 'Lightweight, feather-soft drape woven in Madhya Pradesh handloom style with miniature golden butis spread gracefully throughout the body.',
    category_id: 'sarees',
    regular_price: 2899,
    sale_price: 2199,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    colors: [
      { name: 'Sage Green', hex: '#879F84' },
      { name: 'Powder Blue', hex: '#8EADC1' },
      { name: 'Lavender Blush', hex: '#B8A1BA' },
    ],
    fabric: 'Handwoven Chanderi Silk Cotton',
    occasion: 'Temple Visits, Morning Ceremonies & Office Festivities',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-007',
    sku: 'BVS-MEN-007',
    name: 'Maroon Jacquard Bandhgala Nehru Jacket Set',
    description: '3-piece ethnic ensemble comprising a structured jacquard Nehru sleeveless jacket, straight-cut comfortable cotton-silk kurta, and matching churidar.',
    category_id: 'mens-wear',
    regular_price: 3599,
    sale_price: 2799,
    images: [
      'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
    colors: [
      { name: 'Maroon Gold', hex: '#702C38' },
      { name: 'Royal Sapphire', hex: '#1A365D' },
      { name: 'Charcoal Black', hex: '#282522' },
    ],
    fabric: 'Woven Jacquard Silk with Cotton-Silk Kurta',
    occasion: 'Family Weddings, Diwali Celebrations & Engagements',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: false,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-008',
    sku: 'BVS-KID-008',
    name: 'Classic Silk Kurta Dhoti Set for Boys',
    description: 'Hassle-free pre-stitched dhoti with comfortable elastic waistband paired with an embroidered collar silk kurta. Gentle on kids delicate skin.',
    category_id: 'kids-wear',
    regular_price: 1899,
    sale_price: 1399,
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['1-2 Yrs', '3-4 Yrs', '5-6 Yrs', '7-8 Yrs', '9-10 Yrs'],
    colors: [
      { name: 'Cream & Gold', hex: '#F7F0E5' },
      { name: 'Yellow Ochre', hex: '#D4A338' },
      { name: 'Ruby Maroon', hex: '#702C38' },
    ],
    fabric: 'Soft Silk-Cotton with Pre-Stitched Elasticated Dhoti',
    occasion: 'Pooja, Housewarming & Traditional Celebrations',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-009',
    sku: 'BVS-WMN-009',
    name: 'Blush Pink Georgette Sharara Suit with Gota Patti',
    description: 'Three-tiered flared sharara pants paired with a short kurti ornamented with authentic Rajasthan-inspired gota patti craft work and mirror highlights.',
    category_id: 'womens-ethnic',
    regular_price: 3899,
    sale_price: 2899,
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blush Rose', hex: '#DDA7A5' },
      { name: 'Mint Green', hex: '#A8C9B9' },
      { name: 'Lemon Sorbet', hex: '#F0E6A2' },
    ],
    fabric: 'Flowing Faux Georgette with Shantoon Lining',
    occasion: 'Mehendi, Haldi & Sangeet',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: false,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-010',
    sku: 'BVS-SAR-010',
    name: 'Kanjeevaram Temple Border Silk Saree in Antique Gold',
    description: 'Iconic korvai temple border weave showcasing traditional peacocks and coin motifs. High-density lustrous body that drapes with stately grace.',
    category_id: 'sarees',
    regular_price: 5999,
    sale_price: 4299,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    colors: [
      { name: 'Antique Gold', hex: '#D4B16A' },
      { name: 'Vermilion Red', hex: '#A82828' },
      { name: 'Peacock Green', hex: '#166555' },
    ],
    fabric: 'Kanjeevaram Art Weave with Pure Zari Pallu',
    occasion: 'South Indian Weddings, Housewarming & Temple Rituals',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: false,
    is_bestseller: true,
    is_festive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-011',
    sku: 'BVS-MEN-011',
    name: 'Midnight Blue Hand-Embroidered Kurta with Stole',
    description: 'Refined tailored straight kurta featuring geometric resham thread embroidery over placket and cuffs. Comes with an art-silk matching border stole.',
    category_id: 'mens-wear',
    regular_price: 2999,
    sale_price: 2199,
    images: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
    colors: [
      { name: 'Midnight Blue', hex: '#1A2942' },
      { name: 'Forest Olive', hex: '#2E4033' },
      { name: 'Deep Garnet', hex: '#5E1B24' },
    ],
    fabric: 'Linen-Silk Blend with Matching Tussar Stole',
    occasion: 'Evening Receptions, Diwali & Festive Dinners',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-012',
    sku: 'BVS-WED-012',
    name: 'Festive Organza Embroidered Saree with Scalloped Edge',
    description: 'Modern, diaphanous sheer organza drape adorned with floral embroidery and hand-cut scalloped borders. Includes heavily embroidered raw silk blouse fabric.',
    category_id: 'festive-wedding',
    regular_price: 4299,
    sale_price: 3199,
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    colors: [
      { name: 'Pastel Lilac', hex: '#CBB4D4' },
      { name: 'Blush Peach', hex: '#F3BBA8' },
      { name: 'Ivory Cream', hex: '#F7F0E5' },
    ],
    fabric: 'Fine Glass Organza with Zari Cutwork',
    occasion: 'Cocktail, Receptions & Festive Brunches',
    availability_status: 'in_stock',
    is_published: true,
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'bvs-prod-013',
    sku: 'BVS-DRF-013',
    name: 'Pure Tussar Hand-Block Print Saree (Draft Collection)',
    description: 'Artisanal hand block printed Tussar silk in earthy indigo and rustic madder red. Unfinished catalogue entry awaiting festive release.',
    category_id: 'sarees',
    regular_price: 3999,
    sale_price: null,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    sizes: ['Free Size (6.3m with Blouse)'],
    colors: [
      { name: 'Indigo Natural', hex: '#264653' },
      { name: 'Madder Red', hex: '#8B2635' },
    ],
    fabric: 'Pure Wild Tussar Silk',
    occasion: 'Ceremonial & Cultural Festivals',
    availability_status: 'made_to_order',
    is_published: false, // Draft for admin verification
    is_new_arrival: true,
    is_bestseller: false,
    is_festive: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// In-memory store (initialized with seeds)
let memoryCategories: DbCategory[] = [...INITIAL_CATEGORIES];
let memoryProducts: DbProduct[] = [...INITIAL_PRODUCTS];

export const db = {
  // Categories
  async getCategories(): Promise<DbCategory[]> {
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });
      if (error) throw error;
      return data || [];
    }
    return [...memoryCategories].sort((a, b) => a.display_order - b.display_order);
  },

  async createCategory(cat: Omit<DbCategory, 'created_at' | 'updated_at'>): Promise<DbCategory> {
    const timestamp = new Date().toISOString();
    const newCat: DbCategory = { ...cat, created_at: timestamp, updated_at: timestamp };

    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert(newCat)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    memoryCategories.push(newCat);
    return newCat;
  },

  async updateCategory(id: string, updates: Partial<DbCategory>): Promise<DbCategory | null> {
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = memoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    memoryCategories[idx] = {
      ...memoryCategories[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return memoryCategories[idx];
  },

  async deleteCategory(id: string): Promise<boolean> {
    // Check if products exist in category
    const productsInCat = await this.getProducts({ categoryId: id });
    if (productsInCat.length > 0) {
      throw new Error(`Cannot delete category "${id}". It contains ${productsInCat.length} product(s).`);
    }

    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const initialLength = memoryCategories.length;
    memoryCategories = memoryCategories.filter((c) => c.id !== id);
    return memoryCategories.length < initialLength;
  },

  // Products
  async getProducts(filter?: {
    publishedOnly?: boolean;
    categoryId?: string;
    search?: string;
    tab?: 'new-arrivals' | 'bestsellers' | 'festive';
  }): Promise<DbProduct[]> {
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      let query = supabaseAdmin.from('products').select('*').order('created_at', { ascending: false });

      if (filter?.publishedOnly) {
        query = query.eq('is_published', true);
      }
      if (filter?.categoryId && filter.categoryId !== 'all') {
        query = query.eq('category_id', filter.categoryId);
      }
      if (filter?.tab === 'new-arrivals') {
        query = query.eq('is_new_arrival', true);
      } else if (filter?.tab === 'bestsellers') {
        query = query.eq('is_bestseller', true);
      } else if (filter?.tab === 'festive') {
        query = query.eq('is_festive', true);
      }
      if (filter?.search?.trim()) {
        const s = filter.search.trim();
        query = query.or(`name.ilike.%${s}%,sku.ilike.%${s}%,description.ilike.%${s}%,fabric.ilike.%${s}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }

    // Memory filter
    let results = [...memoryProducts];

    if (filter?.publishedOnly) {
      results = results.filter((p) => p.is_published);
    }
    if (filter?.categoryId && filter.categoryId !== 'all') {
      results = results.filter((p) => p.category_id === filter.categoryId);
    }
    if (filter?.tab === 'new-arrivals') {
      results = results.filter((p) => p.is_new_arrival);
    } else if (filter?.tab === 'bestsellers') {
      results = results.filter((p) => p.is_bestseller);
    } else if (filter?.tab === 'festive') {
      results = results.filter((p) => p.is_festive);
    }
    if (filter?.search?.trim()) {
      const q = filter.search.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    return results.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  async getProductById(id: string): Promise<DbProduct | null> {
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .or(`id.eq.${id},sku.eq.${id}`)
        .single();
      if (error) return null;
      return data;
    }
    return memoryProducts.find((p) => p.id === id || p.sku.toLowerCase() === id.toLowerCase()) || null;
  },

  async createProduct(product: Omit<DbProduct, 'id' | 'created_at' | 'updated_at'>): Promise<DbProduct> {
    // Check SKU uniqueness
    const existing = await this.getProductById(product.sku);
    if (existing) {
      throw new Error(`A product with SKU "${product.sku}" already exists.`);
    }

    const timestamp = new Date().toISOString();
    const newProduct: DbProduct = {
      ...product,
      id: `bvs-prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      created_at: timestamp,
      updated_at: timestamp,
    };

    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .insert(newProduct)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    memoryProducts.unshift(newProduct);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<DbProduct>): Promise<DbProduct | null> {
    if (updates.sku) {
      const existing = await this.getProductById(updates.sku);
      if (existing && existing.id !== id) {
        throw new Error(`SKU "${updates.sku}" is already in use by another product.`);
      }
    }

    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    }

    const idx = memoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    memoryProducts[idx] = {
      ...memoryProducts[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return memoryProducts[idx];
  },

  async setProductPublishStatus(id: string, is_published: boolean): Promise<DbProduct | null> {
    return this.updateProduct(id, { is_published });
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const { error } = await supabaseAdmin.from('products').delete().eq('id', id);
      if (error) throw error;
      return true;
    }

    const initialLength = memoryProducts.length;
    memoryProducts = memoryProducts.filter((p) => p.id !== id);
    return memoryProducts.length < initialLength;
  },

  // Overview stats
  async getOverviewStats() {
    const products = await this.getProducts();
    const categories = await this.getCategories();

    return {
      totalProducts: products.length,
      publishedProducts: products.filter((p) => p.is_published).length,
      draftProducts: products.filter((p) => !p.is_published).length,
      inStockProducts: products.filter((p) => p.availability_status === 'in_stock').length,
      outOfStockProducts: products.filter((p) => p.availability_status === 'out_of_stock').length,
      madeToOrderProducts: products.filter((p) => p.availability_status === 'made_to_order').length,
      totalCategories: categories.length,
    };
  },
};
