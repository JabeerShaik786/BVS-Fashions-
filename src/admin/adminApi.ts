/**
 * BVS FASHIONS — ADMIN CLIENT API SERVICE
 * Connects the Admin Dashboard to Supabase Auth and the Express backend.
 * Provides resilient fallback, clear network diagnostics, and zero "Load failed" leaks.
 */

import { supabase, isClientSupabaseConfigured } from '../supabase';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api').replace(/\/+$/, '');

export function isLocalhostEndpoint(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.href);
    return parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return url.includes('localhost') || url.includes('127.0.0.1');
  }
}

export function isCurrentHostLocal(): boolean {
  if (typeof window === 'undefined') return true;
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

export function getAdminToken(): string | null {
  return localStorage.getItem('bvs_admin_token');
}

export function setAdminToken(token: string | null): void {
  if (token) {
    localStorage.setItem('bvs_admin_token', token);
  } else {
    localStorage.removeItem('bvs_admin_token');
  }
}

export function getAdminUser(): { id: string; email: string } | null {
  const user = localStorage.getItem('bvs_admin_user');
  return user ? JSON.parse(user) : null;
}

export function setAdminUser(user: { id: string; email: string } | null): void {
  if (user) {
    localStorage.setItem('bvs_admin_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('bvs_admin_user');
  }
}

/**
 * Executes an authenticated HTTP request to the backend API.
 * Converts browser-level fetch failures into clear, diagnostic messages.
 */
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();

  if (!token) {
    throw new Error('Authentication required. Please sign in as an administrator.');
  }

  // Check if trying to reach localhost from a remote production origin
  if (!isCurrentHostLocal() && isLocalhostEndpoint(API_BASE) && !isClientSupabaseConfigured) {
    throw new Error(
      `Remote server is not configured. The API endpoint (${API_BASE}) cannot be reached from ${window.location.origin}. Please configure VITE_API_BASE_URL or connect Supabase.`
    );
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${token}`);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      if (response.status === 401) {
        setAdminToken(null);
        setAdminUser(null);
      }
      throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (err: any) {
    if (err.name === 'TypeError' || err.message === 'Load failed' || err.message === 'Failed to fetch') {
      throw new Error(
        `Unable to reach backend service at ${API_BASE}. Please verify that the API server is running and accessible from ${window.location.origin}.`
      );
    }
    throw err;
  }
}

export const adminApi = {
  /**
   * Authenticates the administrator.
   * Priority:
   * 1. Live Supabase Auth if VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are configured.
   * 2. Express Backend API (/api/admin/login).
   */
  async login(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Please enter both your admin email address and password.');
    }

    // 1. Direct Supabase Authentication (Serverless on GitHub Pages / Static Hosting)
    if (isClientSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          throw new Error(error.message || 'Invalid administrator credentials.');
        }

        if (!data.session?.access_token || !data.user) {
          throw new Error('Authentication completed, but no session token was returned.');
        }

        setAdminToken(data.session.access_token);
        setAdminUser({
          id: data.user.id,
          email: data.user.email || email.trim(),
        });

        return {
          success: true,
          token: data.session.access_token,
          user: data.user,
        };
      } catch (sbErr: any) {
        // If Supabase rejected credentials or project error, bubble up clear message
        throw new Error(sbErr?.message || 'Supabase authentication failed.');
      }
    }

    // 2. Check if trying to reach localhost from a remote production origin (e.g. GitHub Pages)
    if (!isCurrentHostLocal() && isLocalhostEndpoint(API_BASE)) {
      throw new Error(
        `Authentication server is unavailable. The local backend (${API_BASE}) cannot be reached from ${window.location.origin}. Please set VITE_API_BASE_URL to your deployed API server or configure VITE_SUPABASE_URL in your hosting settings.`
      );
    }

    // 3. Backend Express API Login
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify your credentials.');
      }

      setAdminToken(data.token);
      setAdminUser(data.user);
      return data;
    } catch (err: any) {
      if (err.name === 'TypeError' || err.message === 'Load failed' || err.message === 'Failed to fetch') {
        throw new Error(
          `Unable to connect to administration server at ${API_BASE}. The backend is currently offline or unreachable from this browser.`
        );
      }
      throw err;
    }
  },

  async logout() {
    if (isClientSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore signout errors
      }
    }
    setAdminToken(null);
    setAdminUser(null);
  },

  async getOverview() {
    // If Supabase is connected directly on frontend
    if (isClientSupabaseConfigured && supabase) {
      const { data: prods, error: pErr } = await supabase
        .from('products')
        .select('id, is_published, availability_status');

      if (pErr) throw new Error(pErr.message);

      const { count: catCount, error: cErr } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true });

      if (cErr) throw new Error(cErr.message);

      const all = prods || [];
      return {
        totalProducts: all.length,
        publishedProducts: all.filter((p) => p.is_published).length,
        draftProducts: all.filter((p) => !p.is_published).length,
        inStock: all.filter((p) => p.availability_status === 'in_stock').length,
        madeToOrder: all.filter((p) => p.availability_status === 'made_to_order').length,
        outOfStock: all.filter((p) => p.availability_status === 'out_of_stock').length,
        totalCategories: catCount || 0,
      };
    }

    const data = await fetchWithAuth('/admin/overview');
    return data.stats;
  },

  async getProducts(params?: { category?: string; search?: string; status?: string; published?: string }) {
    if (isClientSupabaseConfigured && supabase) {
      let query = supabase.from('products').select('*');

      if (params?.category && params.category !== 'all') {
        query = query.eq('category_id', params.category);
      }
      if (params?.published === 'published') {
        query = query.eq('is_published', true);
      } else if (params?.published === 'draft') {
        query = query.eq('is_published', false);
      }
      if (params?.status && params.status !== 'all') {
        query = query.eq('availability_status', params.status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw new Error(error.message);

      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim();
        return (data || []).filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.sku.toLowerCase().includes(q) ||
            (p.fabric && p.fabric.toLowerCase().includes(q))
        );
      }

      return data || [];
    }

    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.published !== undefined) query.set('published', params.published);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const data = await fetchWithAuth(`/admin/products${queryString}`);
    return data.products;
  },

  async createProduct(productData: any) {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const data = await fetchWithAuth('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  async updateProduct(id: string, productData: any) {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const data = await fetchWithAuth(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  async setPublishStatus(id: string, is_published: boolean) {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('products')
        .update({ is_published })
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const data = await fetchWithAuth(`/admin/products/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ is_published }),
    });
    return data.product;
  },

  async deleteProduct(id: string) {
    if (isClientSupabaseConfigured && supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    }

    const data = await fetchWithAuth(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },

  async uploadImage(file: File) {
    if (isClientSupabaseConfigured && supabase) {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `bvs-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    }

    const formData = new FormData();
    formData.append('image', file);

    const data = await fetchWithAuth('/admin/upload', {
      method: 'POST',
      body: formData,
    });
    return data.url as string;
  },

  async getCategories() {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    }

    const data = await fetchWithAuth('/admin/categories');
    return data.categories;
  },

  async createCategory(catData: any) {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert([catData])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const data = await fetchWithAuth('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
    return data.category;
  },

  async updateCategory(id: string, catData: any) {
    if (isClientSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .update(catData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const data = await fetchWithAuth(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData),
    });
    return data.category;
  },

  async deleteCategory(id: string) {
    if (isClientSupabaseConfigured && supabase) {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return true;
    }

    const data = await fetchWithAuth(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};
