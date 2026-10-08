export interface City {
  id: string;
  name: string;
  country: string;
  slug: string;
  description: string;
  heroImage: string;
  thumbnailImage: string;
  featured: boolean;
  displayOrder: number;
  activeStatus: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  description: string;
  type: 'clothing' | 'perfume' | 'general';
  displayOrder: number;
  activeStatus: boolean;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  size?: string;
  color?: string;
  volume?: string;
  sku: string;
  price: number;
  stockQuantity: number;
  displayOrder: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductAttribute {
  id: string;
  productId: string;
  key: string;
  value: string;
}

export interface Product {
  id: string;
  productType: 'clothing' | 'perfume';
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number | null;
  sku: string;
  categoryId: string;
  subcategoryId?: string | null;
  cityId?: string | null;
  featured: boolean;
  published: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  category?: Category;
  subcategory?: Category;
  city?: City;
  totalStock: number;
}

export interface CartItem {
  productId: string;
  variantId: string;
  productName: string;
  variantName: string;
  size?: string;
  color?: string;
  volume?: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
  sku: string;
}

export type OrderStatus =
  | 'Pending Payment'
  | 'Payment Review'
  | 'Payment Approved'
  | 'Preparing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentStatus =
  | 'Pending Payment'
  | 'Payment Review'
  | 'Payment Approved'
  | 'Payment Rejected';

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null;
  variantId: string | null;
  productNameSnapshot: string;
  priceSnapshot: number;
  sizeSnapshot?: string | null;
  colorSnapshot?: string | null;
  volumeSnapshot?: string | null;
  skuSnapshot: string;
  imageSnapshot: string;
  quantity: number;
  lineTotal: number;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  notes: string;
  createdAt: string;
}

export interface PaymentReceipt {
  id: string;
  orderId: string;
  receiptUrl: string;
  originalFilename: string;
  uploadedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote?: string;
  reviewedAt?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  shippingCity: string;
  notes?: string;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  paymentMethod: 'INSTAPAY';
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  history?: OrderStatusHistory[];
  receipt?: PaymentReceipt;
}

export interface StoreSettings {
  brandName: string;
  brandSymbol: string;
  contactEmail: string;
  contactPhone: string;
  instapayAccount: string;
  instapayInstructions: string;
  shippingFee: number;
  freeShippingThreshold: number;
  lowStockThreshold: number;
  storeStatus: 'open' | 'closed';
  storeClosedMessage: string;
  seoTitle: string;
  seoDescription: string;
}

export interface InventoryItem {
  variantId: string;
  productId: string;
  productName: string;
  productType: 'clothing' | 'perfume';
  variantName: string;
  sku: string;
  size?: string;
  color?: string;
  volume?: string;
  price: number;
  stockQuantity: number;
  status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK';
  productPublished: boolean;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingPayments: number;
  totalProducts: number;
  activeProductsCount: number;
  totalCategories: number;
  totalCities: number;
  activeCitiesCount: number;
  lowStockCount: number;
  outOfStockCount: number;
  recentOrders: Order[];
}
