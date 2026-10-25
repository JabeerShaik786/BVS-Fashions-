import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { publicRouter } from './routes/public';
import { adminRouter } from './routes/admin';

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: '*', // Allow public access from frontend dev/prod
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static directory for uploaded images in local mode
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Healthcheck
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'BVS Fashions API Server',
    timestamp: new Date().toISOString(),
  });
});

// Mount Public & Admin Routes
app.use('/api', publicRouter);
app.use('/api/admin', adminRouter);

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error occurred.',
  });
});

// Start listening
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`✓ BVS Fashions API Server running on port ${PORT}`);
  console.log(`  Public API: http://localhost:${PORT}/api/products`);
  console.log(`  Admin API:  http://localhost:${PORT}/api/admin/overview`);
  console.log(`====================================================`);
});
