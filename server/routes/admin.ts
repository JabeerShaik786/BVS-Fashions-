import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db, DbProduct } from '../db';
import { requireAdminAuth } from '../middleware/auth';
import { supabaseAnon, supabaseAdmin, isLiveSupabaseConfigured } from '../supabase';

export const adminRouter = Router();

// Ensure local uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `bvs-${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (allowedMime.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Only JPEG, PNG, and WebP images are permitted.'));
    }
  },
});

// ==============================================================================
// 1. ADMIN AUTHENTICATION
// ==============================================================================
// POST /api/admin/login
adminRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    // Authenticate with Supabase Auth if configured
    if (isLiveSupabaseConfigured && supabaseAnon) {
      const { data, error } = await supabaseAnon.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        res.status(401).json({
          error: 'Authentication failed. Please verify your admin credentials.',
          details: error.message,
        });
        return;
      }

      res.json({
        success: true,
        message: 'Admin logged in successfully.',
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
      });
      return;
    }

    // Local / Initial setup mode validation
    // Allows admin access using default or configured credentials until client sets up Supabase Auth
    if (email === 'admin@bvsfashions.com' && (password === 'admin123' || password === 'bvsadmin2026')) {
      res.json({
        success: true,
        message: 'Logged in as BVS Admin (Local Mode).',
        token: 'bvs_admin_demo_token_secret',
        user: {
          id: 'admin-local-1',
          email: 'admin@bvsfashions.com',
        },
      });
      return;
    }

    res.status(401).json({
      error: 'Invalid admin credentials. Use admin@bvsfashions.com / admin123 or connect Supabase.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Server error during authentication.', details: err?.message });
  }
});

// All following routes require authenticated admin access
adminRouter.use(requireAdminAuth);

// ==============================================================================
// 2. DASHBOARD OVERVIEW METRICS
// ==============================================================================
// GET /api/admin/overview
adminRouter.get('/overview', async (_req: Request, res: Response) => {
  try {
    const stats = await db.getOverviewStats();
    res.json({ success: true, stats });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve overview stats', details: err?.message });
  }
});

// ==============================================================================
// 3. PRODUCT MANAGEMENT
// ==============================================================================
// GET /api/admin/products (List all products, including drafts, with filters)
adminRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, search, status, published } = req.query;

    let products = await db.getProducts({
      publishedOnly: false, // Admins see all products
      categoryId: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
    });

    if (published === 'true') {
      products = products.filter((p) => p.is_published);
    } else if (published === 'false') {
      products = products.filter((p) => !p.is_published);
    }

    if (status && typeof status === 'string') {
      products = products.filter((p) => p.availability_status === status);
    }

    res.json({ success: true, count: products.length, products });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to list products', details: err?.message });
  }
});

// Helper validation function for products
function validateProductInput(body: any): string | null {
  if (!body.sku || typeof body.sku !== 'string' || body.sku.trim().length < 3) {
    return 'Product SKU is required and must be at least 3 characters.';
  }
  if (!body.name || typeof body.name !== 'string' || body.name.trim().length < 3) {
    return 'Product Name is required and must be at least 3 characters.';
  }
  if (!body.description || typeof body.description !== 'string') {
    return 'Product Description is required.';
  }
  if (!body.category_id || typeof body.category_id !== 'string') {
    return 'Product Category is required.';
  }
  const regularPrice = Number(body.regular_price);
  if (isNaN(regularPrice) || regularPrice <= 0) {
    return 'Regular price must be a valid positive number.';
  }
  if (body.sale_price !== null && body.sale_price !== undefined && body.sale_price !== '') {
    const salePrice = Number(body.sale_price);
    if (isNaN(salePrice) || salePrice < 0) {
      return 'Sale price must be a non-negative number if provided.';
    }
    if (salePrice > regularPrice) {
      return 'Sale price cannot be higher than the regular price.';
    }
  }
  if (!Array.isArray(body.images) || body.images.length === 0) {
    return 'At least one product image URL is required.';
  }
  const validStatuses = ['in_stock', 'out_of_stock', 'made_to_order'];
  if (body.availability_status && !validStatuses.includes(body.availability_status)) {
    return 'Availability status must be in_stock, out_of_stock, or made_to_order.';
  }
  return null;
}

// POST /api/admin/products (Create product)
adminRouter.post('/products', async (req: Request, res: Response) => {
  try {
    const validationError = validateProductInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const {
      sku,
      name,
      description,
      category_id,
      regular_price,
      sale_price,
      images,
      sizes,
      colors,
      fabric,
      occasion,
      availability_status,
      is_published,
      is_new_arrival,
      is_bestseller,
      is_festive,
    } = req.body;

    const product = await db.createProduct({
      sku: sku.trim().toUpperCase(),
      name: name.trim(),
      description: description.trim(),
      category_id,
      regular_price: Number(regular_price),
      sale_price: sale_price ? Number(sale_price) : null,
      images: Array.isArray(images) ? images : [images],
      sizes: Array.isArray(sizes) ? sizes : sizes ? [sizes] : ['Standard'],
      colors: Array.isArray(colors) ? colors : [],
      fabric: fabric ? fabric.trim() : null,
      occasion: occasion ? occasion.trim() : null,
      availability_status: availability_status || 'in_stock',
      is_published: Boolean(is_published),
      is_new_arrival: Boolean(is_new_arrival),
      is_bestseller: Boolean(is_bestseller),
      is_festive: Boolean(is_festive),
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully.',
      product,
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create product.' });
  }
});

// PUT /api/admin/products/:id (Update product)
adminRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validationError = validateProductInput(req.body);
    if (validationError) {
      res.status(400).json({ error: validationError });
      return;
    }

    const updates: Partial<DbProduct> = {
      sku: req.body.sku.trim().toUpperCase(),
      name: req.body.name.trim(),
      description: req.body.description.trim(),
      category_id: req.body.category_id,
      regular_price: Number(req.body.regular_price),
      sale_price: req.body.sale_price ? Number(req.body.sale_price) : null,
      images: Array.isArray(req.body.images) ? req.body.images : [req.body.images],
      sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [],
      colors: Array.isArray(req.body.colors) ? req.body.colors : [],
      fabric: req.body.fabric ? req.body.fabric.trim() : null,
      occasion: req.body.occasion ? req.body.occasion.trim() : null,
      availability_status: req.body.availability_status || 'in_stock',
      is_published: Boolean(req.body.is_published),
      is_new_arrival: Boolean(req.body.is_new_arrival),
      is_bestseller: Boolean(req.body.is_bestseller),
      is_festive: Boolean(req.body.is_festive),
    };

    const updated = await db.updateProduct(id, updates);

    if (!updated) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      message: 'Product updated successfully.',
      product: updated,
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update product.' });
  }
});

// PATCH /api/admin/products/:id/publish (Toggle publish status)
adminRouter.patch('/products/:id/publish', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_published } = req.body;

    if (typeof is_published !== 'boolean') {
      res.status(400).json({ error: 'is_published boolean field is required.' });
      return;
    }

    const updated = await db.setProductPublishStatus(id, is_published);
    if (!updated) {
      res.status(404).json({ error: 'Product not found.' });
      return;
    }

    res.json({
      success: true,
      message: `Product ${is_published ? 'published to' : 'unpublished from'} public catalogue.`,
      product: updated,
    });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to toggle publish status.' });
  }
});

// DELETE /api/admin/products/:id (Delete product with safety checks)
adminRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteProduct(id);

    if (!deleted) {
      res.status(404).json({ error: 'Product not found or already deleted.' });
      return;
    }

    res.json({
      success: true,
      message: 'Product deleted permanently.',
    });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Failed to delete product.' });
  }
});

// ==============================================================================
// 4. IMAGE UPLOAD HANDLER (Supabase Storage or Local fallback)
// ==============================================================================
// POST /api/admin/upload
adminRouter.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No image file provided.' });
      return;
    }

    const filePath = req.file.path;
    const fileName = req.file.filename;
    const mimeType = req.file.mimetype;

    // If Supabase Storage is configured, stream to product-images bucket
    if (isLiveSupabaseConfigured && supabaseAdmin) {
      const fileBuffer = fs.readFileSync(filePath);
      const storageKey = `catalog/${Date.now()}-${fileName}`;

      const { data: _uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('product-images')
        .upload(storageKey, fileBuffer, {
          contentType: mimeType,
          upsert: false,
        });

      // Cleanup local temp file
      fs.unlinkSync(filePath);

      if (uploadError) {
        res.status(500).json({
          error: 'Failed to upload image to Supabase Storage.',
          details: uploadError.message,
        });
        return;
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from('product-images')
        .getPublicUrl(storageKey);

      res.json({
        success: true,
        url: urlData.publicUrl,
        filename: fileName,
      });
      return;
    }

    // Local serving fallback
    const port = process.env.PORT || 3001;
    const publicUrl = `http://localhost:${port}/uploads/${fileName}`;

    res.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      notice: 'Stored locally. Connect Supabase Storage to store in cloud bucket.',
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Image upload failed', details: err?.message });
  }
});

// ==============================================================================
// 5. CATEGORY MANAGEMENT
// ==============================================================================
// GET /api/admin/categories
adminRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    res.json({ success: true, categories });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to retrieve categories', details: err?.message });
  }
});

// POST /api/admin/categories
adminRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const { id, name, description, display_order, image_url } = req.body;
    if (!id || !name) {
      res.status(400).json({ error: 'Category ID and Name are required.' });
      return;
    }

    const category = await db.createCategory({
      id: id.toLowerCase().trim(),
      name: name.trim(),
      description: description ? description.trim() : '',
      display_order: Number(display_order) || 0,
      image_url: image_url || '',
    });

    res.status(201).json({ success: true, category });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create category.' });
  }
});

// PUT /api/admin/categories/:id
adminRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await db.updateCategory(id, req.body);
    if (!updated) {
      res.status(404).json({ error: 'Category not found.' });
      return;
    }
    res.json({ success: true, category: updated });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update category.' });
  }
});

// DELETE /api/admin/categories/:id
adminRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await db.deleteCategory(id);
    res.json({ success: true, message: 'Category deleted successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete category.' });
  }
});
