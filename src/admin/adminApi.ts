/**
 * BVS FASHIONS — ADMIN CLIENT API SERVICE
 * Connects the Admin Dashboard to the protected Express/Supabase backend endpoints.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

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

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

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
}

export const adminApi = {
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Admin login failed');
    }

    setAdminToken(data.token);
    setAdminUser(data.user);
    return data;
  },

  logout() {
    setAdminToken(null);
    setAdminUser(null);
  },

  async getOverview() {
    const data = await fetchWithAuth('/admin/overview');
    return data.stats;
  },

  async getProducts(params?: { category?: string; search?: string; status?: string; published?: string }) {
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
    const data = await fetchWithAuth('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  async updateProduct(id: string, productData: any) {
    const data = await fetchWithAuth(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
    return data.product;
  },

  async setPublishStatus(id: string, is_published: boolean) {
    const data = await fetchWithAuth(`/admin/products/${id}/publish`, {
      method: 'PATCH',
      body: JSON.stringify({ is_published }),
    });
    return data.product;
  },

  async deleteProduct(id: string) {
    const data = await fetchWithAuth(`/admin/products/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },

  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const data = await fetchWithAuth('/admin/upload', {
      method: 'POST',
      body: formData,
    });
    return data.url as string;
  },

  async getCategories() {
    const data = await fetchWithAuth('/admin/categories');
    return data.categories;
  },

  async createCategory(catData: any) {
    const data = await fetchWithAuth('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(catData),
    });
    return data.category;
  },

  async updateCategory(id: string, catData: any) {
    const data = await fetchWithAuth(`/admin/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(catData),
    });
    return data.category;
  },

  async deleteCategory(id: string) {
    const data = await fetchWithAuth(`/admin/categories/${id}`, {
      method: 'DELETE',
    });
    return data.success;
  },
};
