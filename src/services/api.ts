import {
  City,
  Category,
  Product,
  CartItem,
  Order,
  StoreSettings,
  InventoryItem,
  DashboardStats,
} from '../types';

const ADMIN_TOKEN_KEY = 'quotes_admin_token';

export const getAdminToken = () => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token: string) => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const removeAdminToken = () => localStorage.removeItem(ADMIN_TOKEN_KEY);

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getAdminToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = `Request failed: ${res.statusText}`;
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.error || errorJson.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // Settings
  getSettings: () => request<StoreSettings>('/api/settings'),
  updateSettings: (data: Partial<StoreSettings>) =>
    request<StoreSettings>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  // Categories
  getCategories: () => request<Category[]>('/api/categories'),
  createCategory: (data: Partial<Category>) =>
    request<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCategory: (id: string, data: Partial<Category>) =>
    request<Category>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCategory: (id: string, action: 'prevent' | 'reassign' | 'archive' = 'prevent', targetCategoryId?: string) =>
    request<{ success: boolean; message?: string }>(`/api/categories/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ action, targetCategoryId }),
    }),

  // Cities
  getCities: (all: boolean = false) => request<City[]>(`/api/cities?all=${all}`),
  getCityBySlug: (slug: string) => request<{ city: City; products: Product[] }>(`/api/cities/${slug}`),
  createCity: (data: Partial<City>) =>
    request<City>('/api/cities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateCity: (id: string, data: Partial<City>) =>
    request<City>(`/api/cities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteCity: (id: string, force: boolean = false) =>
    request<{ success: boolean; message?: string }>(`/api/cities/${id}?force=${force}`, {
      method: 'DELETE',
    }),

  // Products
  getProducts: (params: Record<string, string | number | boolean | undefined> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, String(val));
      }
    });
    return request<Product[]>(`/api/products?${query.toString()}`);
  },
  getProductBySlug: (slug: string) => request<Product>(`/api/products/${slug}`),
  createProduct: (data: any) =>
    request<Product>('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProduct: (id: string, data: any) =>
    request<Product>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  duplicateProduct: (id: string) =>
    request<Product>(`/api/products/${id}/duplicate`, {
      method: 'POST',
    }),
  deleteProduct: (id: string, hard: boolean = false) =>
    request<{ success: boolean; action: string; message: string }>(`/api/products/${id}?hard=${hard}`, {
      method: 'DELETE',
    }),

  // Inventory
  getInventory: () => request<InventoryItem[]>('/api/inventory'),
  updateStock: (variantId: string, stockQuantity: number) =>
    request<any>(`/api/inventory/${variantId}`, {
      method: 'PUT',
      body: JSON.stringify({ stockQuantity }),
    }),

  // Orders & Checkout
  createOrder: (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    notes?: string;
    items: { productId: string; variantId: string; quantity: number }[];
  }) =>
    request<{ order: Order; items: any[] }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  trackOrder: (orderNumber: string) =>
    request<{
      orderNumber: string;
      orderStatus: string;
      paymentStatus: string;
      createdAt: string;
      shippingCity: string;
      totalAmount: number;
      itemsCount: number;
      items: any[];
      history: any[];
      hasReceiptUploaded: boolean;
      receiptStatus?: string;
      adminNote?: string;
    }>(`/api/orders/track/${encodeURIComponent(orderNumber)}`),

  uploadReceipt: async (orderNumber: string, file: File) => {
    const formData = new FormData();
    formData.append('receipt', file);
    return request<{ success: boolean; message: string; receipt: any }>(
      `/api/orders/${encodeURIComponent(orderNumber)}/receipt`,
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string; filename: string; originalName: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },

  // Admin Auth
  adminLogin: (credentials: { email: string; password: string }) =>
    request<{ token: string; user: any }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  adminMe: () => request<{ user: any }>('/api/admin/me'),

  // Admin Operations
  getDashboardStats: () => request<DashboardStats>('/api/admin/dashboard'),
  getAdminOrders: (params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params);
    return request<Order[]>(`/api/admin/orders?${query.toString()}`);
  },
  getAdminOrderById: (id: string) => request<any>(`/api/admin/orders/${id}`),
  updateOrderStatus: (id: string, status: string, note?: string) =>
    request<Order>(`/api/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    }),
  verifyPayment: (id: string, decision: 'approve' | 'reject', adminNote?: string) =>
    request<any>(`/api/admin/orders/${id}/verify-payment`, {
      method: 'POST',
      body: JSON.stringify({ decision, adminNote }),
    }),
  getAdminCustomers: () => request<any[]>('/api/admin/customers'),

  // Test Helpers
  seedSampleData: () => request<any>('/api/admin/seed-sample-data', { method: 'POST' }),
  resetEmptyState: () => request<any>('/api/admin/reset-empty', { method: 'POST' }),
};
