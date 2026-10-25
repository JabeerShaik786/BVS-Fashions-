import { Request, Response, NextFunction } from 'express';
import { supabaseAnon, isLiveSupabaseConfigured } from '../supabase';

export interface AuthenticatedRequest extends Request {
  adminUser?: {
    id: string;
    email: string;
  };
}

export const requireAdminAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: 'Unauthorized: Admin authentication required to perform this action.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized: Token is missing.',
      });
      return;
    }

    // Verify token with Supabase Auth if connected
    if (isLiveSupabaseConfigured && supabaseAnon) {
      const { data, error } = await supabaseAnon.auth.getUser(token);

      if (error || !data.user) {
        res.status(401).json({
          error: 'Unauthorized: Invalid or expired admin session.',
          details: error?.message,
        });
        return;
      }

      req.adminUser = {
        id: data.user.id,
        email: data.user.email || 'admin@bvsfashions.com',
      };
      return next();
    }

    // Fallback/Local development mode verification
    // Accepts Supabase test tokens or local admin tokens
    if (token === 'bvs_admin_demo_token_secret' || token.startsWith('sb_demo_')) {
      req.adminUser = {
        id: 'admin-local-1',
        email: 'admin@bvsfashions.com',
      };
      return next();
    }

    // If neither matches
    res.status(401).json({
      error: 'Unauthorized: Admin authentication failed.',
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Internal authentication error.',
      message: err?.message,
    });
  }
};
