-- ==============================================================================
-- BVS FASHIONS — DATABASE SCHEMA & ROW LEVEL SECURITY POLICIES
-- PostgreSQL / Supabase
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    display_order INTEGER DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category_id TEXT NOT NULL REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT,
    regular_price NUMERIC(10, 2) NOT NULL CHECK (regular_price >= 0),
    sale_price NUMERIC(10, 2) CHECK (sale_price IS NULL OR sale_price >= 0),
    images TEXT[] NOT NULL DEFAULT '{}',
    sizes TEXT[] NOT NULL DEFAULT '{}',
    colors JSONB NOT NULL DEFAULT '[]'::jsonb,
    fabric TEXT,
    occasion TEXT,
    availability_status TEXT NOT NULL DEFAULT 'in_stock' CHECK (availability_status IN ('in_stock', 'out_of_stock', 'made_to_order')),
    is_published BOOLEAN NOT NULL DEFAULT false,
    is_new_arrival BOOLEAN NOT NULL DEFAULT false,
    is_bestseller BOOLEAN NOT NULL DEFAULT false,
    is_festive BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Indexing for high-performance public catalogue queries and admin lookups
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products (category_id);
CREATE INDEX IF NOT EXISTS idx_products_published ON public.products (is_published);
CREATE INDEX IF NOT EXISTS idx_products_sku ON public.products (sku);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products (created_at DESC);

-- ------------------------------------------------------------------------------
-- 3. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_categories_updated_at ON public.categories;
CREATE TRIGGER set_categories_updated_at
    BEFORE UPDATE ON public.categories
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
-- Anyone can view categories
DROP POLICY IF EXISTS "Public can view categories" ON public.categories;
CREATE POLICY "Public can view categories"
    ON public.categories
    FOR SELECT
    USING (true);

-- Authenticated admins can create/update/delete categories
DROP POLICY IF EXISTS "Admins can manage categories" ON public.categories;
CREATE POLICY "Admins can manage categories"
    ON public.categories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- PRODUCTS POLICIES
-- Public users can ONLY view published products
DROP POLICY IF EXISTS "Public can view published products" ON public.products;
CREATE POLICY "Public can view published products"
    ON public.products
    FOR SELECT
    USING (is_published = true);

-- Authenticated admins can perform all CRUD operations on all products (including drafts)
DROP POLICY IF EXISTS "Admins can manage all products" ON public.products;
CREATE POLICY "Admins can manage all products"
    ON public.products
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 5. STORAGE BUCKET CONFIGURATION (product-images)
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images in product-images bucket
CREATE POLICY "Public can view product images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'product-images');

-- Only authenticated users can upload product images
CREATE POLICY "Admins can upload product images"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (bucket_id = 'product-images');

-- Only authenticated users can update/delete product images
CREATE POLICY "Admins can modify product images"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (bucket_id = 'product-images');

CREATE POLICY "Admins can delete product images"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (bucket_id = 'product-images');

-- ------------------------------------------------------------------------------
-- 6. SEED DATA (INITIAL CATEGORIES & PUBLISHED PRODUCTS)
-- ------------------------------------------------------------------------------
INSERT INTO public.categories (id, name, description, display_order, image_url)
VALUES
    ('sarees', 'Sarees', 'Kanjeevaram, Banarasi, Chanderi & Daily Weaves', 1, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'),
    ('womens-ethnic', 'Women''s Ethnic Wear', 'Anarkalis, Kurta Sets, Shararas & Lehengas', 2, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'),
    ('mens-wear', 'Men''s Traditional Wear', 'Kurtas, Nehru Jackets, Sherwanis & Dhoti Sets', 3, 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'),
    ('kids-wear', 'Kids'' Ethnic Wear', 'Comfortable Lehengas, Kurta Pajamas & Pattu Sets', 4, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'),
    ('festive-wedding', 'Festive & Wedding Wear', 'Heavy Zari Lehengas, Brocades & Grand Outfits', 5, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    display_order = EXCLUDED.display_order,
    image_url = EXCLUDED.image_url;

INSERT INTO public.products (
    sku, name, description, category_id, regular_price, sale_price,
    images, sizes, colors, fabric, occasion, availability_status,
    is_published, is_new_arrival, is_bestseller, is_festive
)
VALUES
    (
        'BVS-SAR-001',
        'Crimson Banarasi Silk Saree with Zari Border',
        'An elegant Banarasi silk drape featuring detailed golden zari motifs along the border and pallu. Comes with an unstitched matching blouse piece with coordinating zari work.',
        'sarees',
        4999.00,
        3499.00,
        ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Free Size (6.3m with Blouse)'],
        '[{"name":"Deep Maroon","hex":"#702C38"},{"name":"Royal Emerald","hex":"#1B4D3E"},{"name":"Antique Gold","hex":"#D4B16A"}]'::jsonb,
        'Pure Banarasi Art Silk with Gold Weft',
        'Weddings, Pujas & Festive Celebrations',
        'in_stock',
        true, true, true, true
    ),
    (
        'BVS-WMN-002',
        'Teal Green Embroidered Anarkali Kurta Set',
        'Floor-length Anarkali silhouette tailored in breathable Chanderi silk with delicate thread embroidery around the neckline. Paired with comfortable churidar and scalloped dupatta.',
        'womens-ethnic',
        3299.00,
        2499.00,
        ARRAY['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80'],
        ARRAY['S', 'M', 'L', 'XL', 'XXL'],
        '[{"name":"Teal Green","hex":"#1C5B63"},{"name":"Wine Plum","hex":"#582C4D"},{"name":"Mustard Gold","hex":"#D6A43B"}]'::jsonb,
        'Chanderi Cotton Silk with Organza Dupatta',
        'Festivals, Sangeet & Family Gatherings',
        'in_stock',
        true, true, false, true
    ),
    (
        'BVS-MEN-003',
        'Ivory & Gold Raw Silk Men''s Kurta Pajama',
        'Crisp mandarin collar kurta in fine textured dupion silk featuring delicate tone-on-tone button detailing. Complete with an ivory drawstring churidar pajama.',
        'mens-wear',
        2799.00,
        1999.00,
        ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80'],
        ARRAY['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
        '[{"name":"Ivory Gold","hex":"#F7F0E5"},{"name":"Midnight Navy","hex":"#1E293B"},{"name":"Maroon","hex":"#702C38"}]'::jsonb,
        'Dupion Raw Silk Blend',
        'Weddings, Engagements & Traditional Rituals',
        'in_stock',
        true, false, true, true
    ),
    (
        'BVS-KID-004',
        'Mustard Yellow Festive Pattu Lehenga for Girls',
        'Designed specifically with soft, gentle inner cotton lining so children stay comfortable all day. Features a flared golden-bordered skirt and fitted peplum top.',
        'kids-wear',
        2299.00,
        1699.00,
        ARRAY['https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80'],
        ARRAY['2-3 Yrs', '4-5 Yrs', '6-7 Yrs', '8-9 Yrs', '10-12 Yrs'],
        '[{"name":"Haldi Mustard","hex":"#E5A93C"},{"name":"Rani Pink","hex":"#C2185B"},{"name":"Parrot Green","hex":"#2E7D32"}]'::jsonb,
        'Soft Art Silk with 100% Cotton Inner Lining',
        'Festivals, Birthday Ceremonies & Weddings',
        'in_stock',
        true, true, true, true
    ),
    (
        'BVS-WED-005',
        'Royal Heritage Brocade Bridal & Reception Lehenga',
        'A masterpiece created for grand moments. Features a full 4-meter flared silhouette with intricate zardozi, sequins, and antique gold threadwork. Complete with velvet blouse piece and dual dupattas.',
        'festive-wedding',
        9499.00,
        6999.00,
        ARRAY['https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Semi-Stitched (Fits up to 44 waist)'],
        '[{"name":"Crimson Vermilion","hex":"#9E2A2B"},{"name":"Wine Velvet","hex":"#4A1525"},{"name":"Rose Gold","hex":"#C58F7D"}]'::jsonb,
        'Heavy Brocade Silk with Handworked Zardozi',
        'Bridal Trousseau, Reception & Grand Celebrations',
        'in_stock',
        true, false, true, true
    ),
    (
        'BVS-SAR-006',
        'Sage Green Chanderi Saree with Golden Buti',
        'Lightweight, feather-soft drape woven in Madhya Pradesh handloom style with miniature golden butis spread gracefully throughout the body.',
        'sarees',
        2899.00,
        2199.00,
        ARRAY['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Free Size (6.3m with Blouse)'],
        '[{"name":"Sage Green","hex":"#879F84"},{"name":"Powder Blue","hex":"#8EADC1"},{"name":"Lavender Blush","hex":"#B8A1BA"}]'::jsonb,
        'Handwoven Chanderi Silk Cotton',
        'Temple Visits, Morning Ceremonies & Office Festivities',
        'in_stock',
        true, true, false, false
    ),
    (
        'BVS-MEN-007',
        'Maroon Jacquard Bandhgala Nehru Jacket Set',
        '3-piece ethnic ensemble comprising a structured jacquard Nehru sleeveless jacket, straight-cut comfortable cotton-silk kurta, and matching churidar.',
        'mens-wear',
        3599.00,
        2799.00,
        ARRAY['https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
        ARRAY['38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (XXL)'],
        '[{"name":"Maroon Gold","hex":"#702C38"},{"name":"Royal Sapphire","hex":"#1A365D"},{"name":"Charcoal Black","hex":"#282522"}]'::jsonb,
        'Woven Jacquard Silk with Cotton-Silk Kurta',
        'Family Weddings, Diwali Celebrations & Engagements',
        'in_stock',
        true, false, true, true
    ),
    (
        'BVS-KID-008',
        'Classic Silk Kurta Dhoti Set for Boys',
        'Hassle-free pre-stitched dhoti with comfortable elastic waistband paired with an embroidered collar silk kurta. Gentle on kids delicate skin.',
        'kids-wear',
        1899.00,
        1399.00,
        ARRAY['https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80'],
        ARRAY['1-2 Yrs', '3-4 Yrs', '5-6 Yrs', '7-8 Yrs', '9-10 Yrs'],
        '[{"name":"Cream & Gold","hex":"#F7F0E5"},{"name":"Yellow Ochre","hex":"#D4A338"},{"name":"Ruby Maroon","hex":"#702C38"}]'::jsonb,
        'Soft Silk-Cotton with Pre-Stitched Elasticated Dhoti',
        'Pooja, Housewarming & Traditional Celebrations',
        'in_stock',
        true, true, false, true
    ),
    (
        'BVS-WMN-009',
        'Blush Pink Georgette Sharara Suit with Gota Patti',
        'Three-tiered flared sharara pants paired with a short kurti ornamented with authentic Rajasthan-inspired gota patti craft work and mirror highlights.',
        'womens-ethnic',
        3899.00,
        2899.00,
        ARRAY['https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'],
        ARRAY['S', 'M', 'L', 'XL'],
        '[{"name":"Blush Rose","hex":"#DDA7A5"},{"name":"Mint Green","hex":"#A8C9B9"},{"name":"Lemon Sorbet","hex":"#F0E6A2"}]'::jsonb,
        'Flowing Faux Georgette with Shantoon Lining',
        'Mehendi, Haldi & Sangeet',
        'in_stock',
        true, false, true, true
    ),
    (
        'BVS-SAR-010',
        'Kanjeevaram Temple Border Silk Saree in Antique Gold',
        'Iconic korvai temple border weave showcasing traditional peacocks and coin motifs. High-density lustrous body that drapes with stately grace.',
        'sarees',
        5999.00,
        4299.00,
        ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Free Size (6.3m with Blouse)'],
        '[{"name":"Antique Gold","hex":"#D4B16A"},{"name":"Vermilion Red","hex":"#A82828"},{"name":"Peacock Green","hex":"#166555"}]'::jsonb,
        'Kanjeevaram Art Weave with Pure Zari Pallu',
        'South Indian Weddings, Housewarming & Temple Rituals',
        'in_stock',
        true, false, true, true
    ),
    (
        'BVS-MEN-011',
        'Midnight Blue Hand-Embroidered Kurta with Stole',
        'Refined tailored straight kurta featuring geometric resham thread embroidery over placket and cuffs. Comes with an art-silk matching border stole.',
        'mens-wear',
        2999.00,
        2199.00,
        ARRAY['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1621609764095-b32bbe35cf3a?auto=format&fit=crop&w=800&q=80'],
        ARRAY['38 (S)', '40 (M)', '42 (L)', '44 (XL)'],
        '[{"name":"Midnight Blue","hex":"#1A2942"},{"name":"Forest Olive","hex":"#2E4033"},{"name":"Deep Garnet","hex":"#5E1B24"}]'::jsonb,
        'Linen-Silk Blend with Matching Tussar Stole',
        'Evening Receptions, Diwali & Festive Dinners',
        'in_stock',
        true, true, false, true
    ),
    (
        'BVS-WED-012',
        'Festive Organza Embroidered Saree with Scalloped Edge',
        'Modern, diaphanous sheer organza drape adorned with floral embroidery and hand-cut scalloped borders. Includes heavily embroidered raw silk blouse fabric.',
        'festive-wedding',
        4299.00,
        3199.00,
        ARRAY['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        ARRAY['Free Size (6.3m with Blouse)'],
        '[{"name":"Pastel Lilac","hex":"#CBB4D4"},{"name":"Blush Peach","hex":"#F3BBA8"},{"name":"Ivory Cream","hex":"#F7F0E5"}]'::jsonb,
        'Fine Glass Organza with Zari Cutwork',
        'Cocktail, Receptions & Festive Brunches',
        'in_stock',
        true, true, false, true
    )
ON CONFLICT (sku) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category_id = EXCLUDED.category_id,
    regular_price = EXCLUDED.regular_price,
    sale_price = EXCLUDED.sale_price,
    images = EXCLUDED.images,
    sizes = EXCLUDED.sizes,
    colors = EXCLUDED.colors,
    fabric = EXCLUDED.fabric,
    occasion = EXCLUDED.occasion,
    availability_status = EXCLUDED.availability_status,
    is_published = EXCLUDED.is_published,
    is_new_arrival = EXCLUDED.is_new_arrival,
    is_bestseller = EXCLUDED.is_bestseller,
    is_festive = EXCLUDED.is_festive;
