import { Router, Request, Response } from 'express';
import { db } from '../db';

export const publicRouter = Router();

// GET /api/categories
publicRouter.get('/categories', async (_req: Request, res: Response) => {
  try {
    const categories = await db.getCategories();
    res.json({
      success: true,
      categories,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch categories', details: err?.message });
  }
});

// GET /api/products (Public published catalogue only)
publicRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const { category, search, tab } = req.query;

    const products = await db.getProducts({
      publishedOnly: true, // STRICT SECURITY: Never expose drafts on public route
      categoryId: typeof category === 'string' ? category : undefined,
      search: typeof search === 'string' ? search : undefined,
      tab: typeof tab === 'string' && ['new-arrivals', 'bestsellers', 'festive'].includes(tab)
        ? (tab as 'new-arrivals' | 'bestsellers' | 'festive')
        : undefined,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch products', details: err?.message });
  }
});

// GET /api/products/:id (Public product detail)
publicRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await db.getProductById(id);

    if (!product || !product.is_published) {
      res.status(404).json({ error: 'Product not found or not currently published' });
      return;
    }

    res.json({
      success: true,
      product,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch product', details: err?.message });
  }
});

// GET /api/config (Public store configuration)
publicRouter.get('/config', (_req: Request, res: Response) => {
  const whatsappPhone = process.env.VITE_WHATSAPP_PHONE_NUMBER || '918639778188';
  res.json({
    success: true,
    whatsappPhoneNumber: whatsappPhone,
    currency: 'INR',
    currencySymbol: '₹',
    storeName: 'BVS Fashions',
  });
});
