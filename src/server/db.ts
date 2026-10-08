import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

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
  parentId: string | null; // null for top-level
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
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string | null; // Can be null if original product is deleted
  variantId: string | null;
  // CRITICAL: Safe Delete Snapshots
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
  orderNumber: string; // QUOTES-XXXXXX
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

export interface DatabaseSchema {
  users: User[];
  cities: City[];
  categories: Category[];
  products: Product[];
  productImages: ProductImage[];
  productVariants: ProductVariant[];
  productAttributes: ProductAttribute[];
  orders: Order[];
  orderItems: OrderItem[];
  orderStatusHistory: OrderStatusHistory[];
  paymentReceipts: PaymentReceipt[];
  settings: StoreSettings;
}

const DB_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');

// Initial baseline categories per specifications
export const INITIAL_CATEGORIES: Category[] = [
  // Top-level CLOTHING
  {
    id: 'cat_clothing',
    name: 'Clothing',
    slug: 'clothing',
    parentId: null,
    description: 'Urban luxury essentials crafted in Egypt with architectural precision.',
    type: 'clothing',
    displayOrder: 1,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  // Clothing Main Subcategories
  {
    id: 'cat_hoodies',
    name: 'Hoodies',
    slug: 'hoodies',
    parentId: 'cat_clothing',
    description: 'Heavyweight architectural hoodies in custom heavyweight cotton.',
    type: 'clothing',
    displayOrder: 1,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_sweatpants',
    name: 'Sweatpants',
    slug: 'sweatpants',
    parentId: 'cat_clothing',
    description: 'Tailored and baggy sweatpants crafted for urban presence.',
    type: 'clothing',
    displayOrder: 2,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_tshirts',
    name: 'T-Shirts',
    slug: 't-shirts',
    parentId: 'cat_clothing',
    description: 'Boxy, oversized and heavyweight combed Egyptian cotton tees.',
    type: 'clothing',
    displayOrder: 3,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_shirts',
    name: 'Shirts',
    slug: 'shirts',
    parentId: 'cat_clothing',
    description: 'Overshirts, button-ups and structured flannels.',
    type: 'clothing',
    displayOrder: 4,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_jeans',
    name: 'Jeans',
    slug: 'jeans',
    parentId: 'cat_clothing',
    description: 'Raw and washed Japanese-grade denim with relaxed silhouettes.',
    type: 'clothing',
    displayOrder: 5,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_shorts',
    name: 'Shorts',
    slug: 'shorts',
    parentId: 'cat_clothing',
    description: 'Cargo and denim streetwear shorts.',
    type: 'clothing',
    displayOrder: 6,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_jackets',
    name: 'Jackets',
    slug: 'jackets',
    parentId: 'cat_clothing',
    description: 'Bombers, varsity and technical outerwear.',
    type: 'clothing',
    displayOrder: 7,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'cat_pants',
    name: 'Pants',
    slug: 'pants',
    parentId: 'cat_clothing',
    description: 'Wide-leg trousers and utility cargo pants.',
    type: 'clothing',
    displayOrder: 8,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },

  // Deep Subcategories for Hoodies
  { id: 'sub_oversized_hoodies', name: 'Oversized Hoodies', slug: 'oversized-hoodies', parentId: 'cat_hoodies', description: 'Boxy drop-shoulder cut', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_pullover_hoodies', name: 'Pullover Hoodies', slug: 'pullover-hoodies', parentId: 'cat_hoodies', description: 'Clean minimal pullovers', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_zip_hoodies', name: 'Zip-Up Hoodies', slug: 'zip-up-hoodies', parentId: 'cat_hoodies', description: 'Double metallic zip hoodies', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_graphic_hoodies', name: 'Graphic Hoodies', slug: 'graphic-hoodies', parentId: 'cat_hoodies', description: 'Editorial quote silkscreens', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_basic_hoodies', name: 'Basic Hoodies', slug: 'basic-hoodies', parentId: 'cat_hoodies', description: 'Unadorned heavyweight staples', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Sweatpants
  { id: 'sub_regular_sweatpants', name: 'Regular Sweatpants', slug: 'regular-sweatpants', parentId: 'cat_sweatpants', description: 'Classic tapered lounge fit', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_baggy_sweatpants', name: 'Baggy Sweatpants', slug: 'baggy-sweatpants', parentId: 'cat_sweatpants', description: 'Wide drape drop-crotch cut', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_straight_sweatpants', name: 'Straight Sweatpants', slug: 'straight-sweatpants', parentId: 'cat_sweatpants', description: 'Architectural vertical hem', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_cargo_sweatpants', name: 'Cargo Sweatpants', slug: 'cargo-sweatpants', parentId: 'cat_sweatpants', description: 'Tactical flap pocket sweatpants', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for T-Shirts
  { id: 'sub_oversized_tees', name: 'Oversized T-Shirts', slug: 'oversized-t-shirts', parentId: 'cat_tshirts', description: 'Relaxed urban fit', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_regular_tees', name: 'Regular T-Shirts', slug: 'regular-t-shirts', parentId: 'cat_tshirts', description: 'Standard refined silhouette', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_graphic_tees', name: 'Graphic T-Shirts', slug: 'graphic-t-shirts', parentId: 'cat_tshirts', description: 'Typographic & artistic silkscreens', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_basic_tees', name: 'Basic T-Shirts', slug: 'basic-t-shirts', parentId: 'cat_tshirts', description: 'Minimal unbranded crewnecks', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_heavyweight_tees', name: 'Heavyweight T-Shirts', slug: 'heavyweight-t-shirts', parentId: 'cat_tshirts', description: '300 GSM dense weave', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_long_sleeve_tees', name: 'Long Sleeve T-Shirts', slug: 'long-sleeve-t-shirts', parentId: 'cat_tshirts', description: 'Ribbed cuff long sleeves', type: 'clothing', displayOrder: 6, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_boxy_tees', name: 'Boxy T-Shirts', slug: 'boxy-t-shirts', parentId: 'cat_tshirts', description: 'Cropped boxy drape', type: 'clothing', displayOrder: 7, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Shirts
  { id: 'sub_overshirts', name: 'Overshirts', slug: 'overshirts', parentId: 'cat_shirts', description: 'Structured layering shirts', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_casual_shirts', name: 'Casual Shirts', slug: 'casual-shirts', parentId: 'cat_shirts', description: 'Everyday button-downs', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_button_up_shirts', name: 'Button-Up Shirts', slug: 'button-up-shirts', parentId: 'cat_shirts', description: 'Sharp tailored collars', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_flannel_shirts', name: 'Flannel Shirts', slug: 'flannel-shirts', parentId: 'cat_shirts', description: 'Heavy brushed cotton plaids', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_oxford_shirts', name: 'Oxford Shirts', slug: 'oxford-shirts', parentId: 'cat_shirts', description: 'Dense Oxford cloth weave', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Jeans
  { id: 'sub_baggy_jeans', name: 'Baggy Jeans', slug: 'baggy-jeans', parentId: 'cat_jeans', description: '90s loose fit denim', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_straight_jeans', name: 'Straight Jeans', slug: 'straight-jeans', parentId: 'cat_jeans', description: 'Classic straight leg cut', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_wide_leg_jeans', name: 'Wide-Leg Jeans', slug: 'wide-leg-jeans', parentId: 'cat_jeans', description: 'Voluminous flared drape', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_relaxed_jeans', name: 'Relaxed Jeans', slug: 'relaxed-jeans', parentId: 'cat_jeans', description: 'Roomy comfort denim', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_cargo_jeans', name: 'Cargo Jeans', slug: 'cargo-jeans', parentId: 'cat_jeans', description: 'Denim with utility cargo pockets', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Shorts
  { id: 'sub_cargo_shorts', name: 'Cargo Shorts', slug: 'cargo-shorts', parentId: 'cat_shorts', description: 'Multi-pocket streetwear shorts', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_denim_shorts', name: 'Denim Shorts', slug: 'denim-shorts', parentId: 'cat_shorts', description: 'Raw and distressed denim jorts', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_bermuda_shorts', name: 'Bermuda Shorts', slug: 'bermuda-shorts', parentId: 'cat_shorts', description: 'Knee-length tailored shorts', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_athletic_shorts', name: 'Athletic Shorts', slug: 'athletic-shorts', parentId: 'cat_shorts', description: 'Lightweight tech shorts', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_casual_shorts', name: 'Casual Shorts', slug: 'casual-shorts', parentId: 'cat_shorts', description: 'Cotton sweat shorts', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Jackets
  { id: 'sub_bomber_jackets', name: 'Bomber Jackets', slug: 'bomber-jackets', parentId: 'cat_jackets', description: 'Classic MA-1 silhouettes', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_denim_jackets', name: 'Denim Jackets', slug: 'denim-jackets', parentId: 'cat_jackets', description: 'Trucker and selvedge outerwear', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_varsity_jackets', name: 'Varsity Jackets', slug: 'varsity-jackets', parentId: 'cat_jackets', description: 'Wool and leather varsity coats', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_windbreakers', name: 'Windbreakers', slug: 'windbreakers', parentId: 'cat_jackets', description: 'Technical wind-resistant shells', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_overshirt_jackets', name: 'Overshirt Jackets', slug: 'overshirt-jackets', parentId: 'cat_jackets', description: 'Heavy transitional shackets', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Deep Subcategories for Pants
  { id: 'sub_cargo_pants', name: 'Cargo Pants', slug: 'cargo-pants', parentId: 'cat_pants', description: 'Heavy utility twill cargo trousers', type: 'clothing', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_wide_leg_pants', name: 'Wide-Leg Pants', slug: 'wide-leg-pants', parentId: 'cat_pants', description: 'Relaxed flowing trouser silhouette', type: 'clothing', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_straight_pants', name: 'Straight Pants', slug: 'straight-pants', parentId: 'cat_pants', description: 'Architectural straight trousers', type: 'clothing', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_relaxed_pants', name: 'Relaxed Pants', slug: 'relaxed-pants', parentId: 'cat_pants', description: 'Drop silhouette daily pants', type: 'clothing', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'sub_chino_pants', name: 'Chino Pants', slug: 'chino-pants', parentId: 'cat_pants', description: 'Refined cotton chinos', type: 'clothing', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },

  // Top-level PERFUMES
  {
    id: 'cat_perfumes',
    name: 'Perfumes',
    slug: 'perfumes',
    parentId: null,
    description: 'Haute parfumerie inspired by nocturnal Egyptian landscapes and raw essences.',
    type: 'perfume',
    displayOrder: 2,
    activeStatus: true,
    createdAt: new Date().toISOString(),
  },
  // Perfume Subcategories
  { id: 'cat_perfume_men', name: 'Men', slug: 'perfume-men', parentId: 'cat_perfumes', description: 'Bold woods, smoky resins, and dark leather.', type: 'perfume', displayOrder: 1, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_women', name: 'Women', slug: 'perfume-women', parentId: 'cat_perfumes', description: 'White florals, nocturnal jasmine, and radiant amber.', type: 'perfume', displayOrder: 2, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_unisex', name: 'Unisex', slug: 'perfume-unisex', parentId: 'cat_perfumes', description: 'Boundless olfactive compositions.', type: 'perfume', displayOrder: 3, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_edp', name: 'Eau de Parfum', slug: 'eau-de-parfum', parentId: 'cat_perfumes', description: 'High concentration long-wear flacons.', type: 'perfume', displayOrder: 4, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_edt', name: 'Eau de Toilette', slug: 'eau-de-toilette', parentId: 'cat_perfumes', description: 'Fresh and radiant everyday sillage.', type: 'perfume', displayOrder: 5, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_parfum', name: 'Parfum', slug: 'parfum', parentId: 'cat_perfumes', description: 'Ultra-concentrated pure essence.', type: 'perfume', displayOrder: 6, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_oil', name: 'Perfume Oil', slug: 'perfume-oil', parentId: 'cat_perfumes', description: 'Attar and botanical roll-ons.', type: 'perfume', displayOrder: 7, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_mist', name: 'Body Mist', slug: 'body-mist', parentId: 'cat_perfumes', description: 'Airy refreshing scent veils.', type: 'perfume', displayOrder: 8, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_discovery', name: 'Discovery Set', slug: 'discovery-set', parentId: 'cat_perfumes', description: 'Curated miniature collections.', type: 'perfume', displayOrder: 9, activeStatus: true, createdAt: new Date().toISOString() },
  { id: 'cat_perfume_gift', name: 'Gift Set', slug: 'gift-set', parentId: 'cat_perfumes', description: 'Archival flacons with accessories.', type: 'perfume', displayOrder: 10, activeStatus: true, createdAt: new Date().toISOString() },
];

const DEFAULT_SETTINGS: StoreSettings = {
  brandName: 'QUOTES',
  brandSymbol: '"',
  contactEmail: 'contact@quotes-brand.com',
  contactPhone: '+20 100 123 4567',
  instapayAccount: 'quotes.store@instapay',
  instapayInstructions: 'Please transfer the exact order amount to our InstaPay handle: quotes.store@instapay. Once sent, upload a screenshot of your payment receipt below for instant order verification.',
  shippingFee: 85,
  freeShippingThreshold: 2000,
  lowStockThreshold: 5,
  storeStatus: 'open',
  storeClosedMessage: 'Our store is currently preparing the next private drop. You can explore the archive, but checkout is temporarily paused.',
  seoTitle: 'QUOTES — Luxury Egyptian Fashion & Fragrance',
  seoDescription: 'Editorial urban fashion and haute parfumerie conceived in Egypt. Architectural cuts and nocturnal scent journeys.',
};

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const content = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(content);
        return {
          users: parsed.users || [],
          // Per requirements 55 & 56: start with 0 products and 0 cities if not initialized
          cities: parsed.cities || [],
          categories: parsed.categories?.length ? parsed.categories : INITIAL_CATEGORIES,
          products: parsed.products || [],
          productImages: parsed.productImages || [],
          productVariants: parsed.productVariants || [],
          productAttributes: parsed.productAttributes || [],
          orders: parsed.orders || [],
          orderItems: parsed.orderItems || [],
          orderStatusHistory: parsed.orderStatusHistory || [],
          paymentReceipts: parsed.paymentReceipts || [],
          settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        };
      } catch (err) {
        console.error('Error reading db.json, initializing fresh db:', err);
      }
    }

    // Default clean state: 0 products, 0 cities (meets test empty state rule 55 & 56)
    const freshDb: DatabaseSchema = {
      users: [
        {
          id: 'admin_1',
          email: 'quotes.eg',
          passwordHash: '10/10/2026',
          name: 'QUOTES Atelier Admin',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],
      cities: [],
      categories: INITIAL_CATEGORIES,
      products: [],
      productImages: [],
      productVariants: [],
      productAttributes: [],
      orders: [],
      orderItems: [],
      orderStatusHistory: [],
      paymentReceipts: [],
      settings: DEFAULT_SETTINGS,
    };

    this.save(freshDb);
    return freshDb;
  }

  private save(dataToSave?: DatabaseSchema) {
    const data = dataToSave || this.data;
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // --- SEED SAMPLE DATA (for instant one-click demonstration of live store) ---
  seedSampleData(sampleHeroImages: {
    hero: string;
    cairo: string;
    hoodie: string;
    perfume: string;
  }) {
    // Add real Cairo and Alexandria cities
    const cairoId = 'city_cairo';
    const alexId = 'city_alexandria';

    this.data.cities = [
      {
        id: cairoId,
        name: 'Cairo',
        country: 'Egypt',
        slug: 'cairo',
        description: 'Raw concrete, ancient stone, and nocturnal urban energy. The beating heart of the QUOTES aesthetic.',
        heroImage: sampleHeroImages.cairo || '/src/assets/images/cairo_city_editorial_1791453919507.jpg',
        thumbnailImage: sampleHeroImages.cairo || '/src/assets/images/cairo_city_editorial_1791453919507.jpg',
        featured: true,
        displayOrder: 1,
        activeStatus: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: alexId,
        name: 'Alexandria',
        country: 'Egypt',
        slug: 'alexandria',
        description: 'Brutalist seaside winds, Mediterranean limestone, and atmospheric dusk.',
        heroImage: sampleHeroImages.hero || '/src/assets/images/brand_editorial_hero_1791453906407.jpg',
        thumbnailImage: sampleHeroImages.hero || '/src/assets/images/brand_editorial_hero_1791453906407.jpg',
        featured: false,
        displayOrder: 2,
        activeStatus: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Add sample clothing & perfume products for Cairo and Alexandria
    const p1Id = 'prod_hoodie_01';
    const p2Id = 'prod_perfume_01';
    const p3Id = 'prod_shirt_alex';
    const p4Id = 'prod_perfume_alex';

    this.data.products = [
      {
        id: p1Id,
        productType: 'clothing',
        name: 'Nocturne Heavyweight Hoodie',
        slug: 'nocturne-heavyweight-hoodie',
        description: 'Crafted from 480 GSM dense Egyptian combed cotton. Features an architectural drop-shoulder cut, double-lined hood, and tonal QUOTES trademark mark on the nape. Pre-washed for a muted slate patina.',
        price: 1850,
        compareAtPrice: 2200,
        sku: 'QTS-HD-NOC-01',
        categoryId: 'cat_hoodies',
        subcategoryId: 'sub_oversized_hoodies',
        cityId: cairoId,
        featured: true,
        published: true,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: p2Id,
        productType: 'perfume',
        name: 'Al-Qahira Extrait de Parfum',
        slug: 'al-qahira-extrait-de-parfum',
        description: 'A dark, brooding composition of smoky cedarwood, black amber, rare Egyptian papyrus, and subtle night-blooming jasmine. Encased in a monolithic smoked glass flacon with a magnetic metal stopper.',
        price: 2400,
        compareAtPrice: null,
        sku: 'QTS-PF-CAI-01',
        categoryId: 'cat_perfumes',
        subcategoryId: 'cat_perfume_unisex',
        cityId: cairoId,
        featured: true,
        published: true,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: p3Id,
        productType: 'clothing',
        name: 'Maritime Raw Selvedge Overshirt',
        slug: 'maritime-raw-selvedge-overshirt',
        description: 'Heavyweight untreated structured cotton overshirt tailored for maritime Mediterranean humidity and sea winds. Monolithic metallic buttons and clean architectural pockets.',
        price: 1950,
        compareAtPrice: 2300,
        sku: 'QTS-SH-ALX-01',
        categoryId: 'cat_shirts',
        subcategoryId: 'cat_clothing',
        cityId: alexId,
        featured: true,
        published: true,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: p4Id,
        productType: 'perfume',
        name: 'Iskandariya Extrait de Parfum',
        slug: 'iskandariya-extrait-de-parfum',
        description: 'A nocturnal seaside tribute to Alexandria. Mineral sea salt, aged driftwood, crushed citrus peel, and deep ambergris. 30% pure fragrance oil concentration.',
        price: 2550,
        compareAtPrice: null,
        sku: 'QTS-PF-ALX-01',
        categoryId: 'cat_perfumes',
        subcategoryId: 'cat_perfume_unisex',
        cityId: alexId,
        featured: true,
        published: true,
        archived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Images
    this.data.productImages = [
      {
        id: 'img_p1_1',
        productId: p1Id,
        url: sampleHeroImages.hoodie || '/src/assets/images/product_hoodie_sample_1791453935643.jpg',
        alt: 'Nocturne Heavyweight Hoodie Front View',
        displayOrder: 1,
        isPrimary: true,
      },
      {
        id: 'img_p2_1',
        productId: p2Id,
        url: sampleHeroImages.perfume || '/src/assets/images/product_fragrance_sample_1791453951261.jpg',
        alt: 'Al-Qahira Extrait de Parfum Bottle',
        displayOrder: 1,
        isPrimary: true,
      },
      {
        id: 'img_p3_1',
        productId: p3Id,
        url: sampleHeroImages.hoodie || '/src/assets/images/product_hoodie_sample_1791453935643.jpg',
        alt: 'Maritime Raw Selvedge Overshirt Front View',
        displayOrder: 1,
        isPrimary: true,
      },
      {
        id: 'img_p4_1',
        productId: p4Id,
        url: sampleHeroImages.perfume || '/src/assets/images/product_fragrance_sample_1791453951261.jpg',
        alt: 'Iskandariya Extrait de Parfum Bottle',
        displayOrder: 1,
        isPrimary: true,
      },
    ];

    // Variants
    this.data.productVariants = [
      {
        id: 'var_h_m_black',
        productId: p1Id,
        name: 'M / Slate Black',
        size: 'M',
        color: 'Slate Black',
        sku: 'QTS-HD-NOC-M-BLK',
        price: 1850,
        stockQuantity: 12,
        displayOrder: 1,
      },
      {
        id: 'var_h_l_black',
        productId: p1Id,
        name: 'L / Slate Black',
        size: 'L',
        color: 'Slate Black',
        sku: 'QTS-HD-NOC-L-BLK',
        price: 1850,
        stockQuantity: 8,
        displayOrder: 2,
      },
      {
        id: 'var_h_xl_black',
        productId: p1Id,
        name: 'XL / Slate Black',
        size: 'XL',
        color: 'Slate Black',
        sku: 'QTS-HD-NOC-XL-BLK',
        price: 1850,
        stockQuantity: 4,
        displayOrder: 3,
      },
      // Perfume Cairo variants
      {
        id: 'var_p_50ml',
        productId: p2Id,
        name: '50ml Flacon',
        volume: '50ml',
        sku: 'QTS-PF-CAI-50ML',
        price: 2400,
        stockQuantity: 15,
        displayOrder: 1,
      },
      {
        id: 'var_p_100ml',
        productId: p2Id,
        name: '100ml Flacon',
        volume: '100ml',
        sku: 'QTS-PF-CAI-100ML',
        price: 3600,
        stockQuantity: 6,
        displayOrder: 2,
      },
      // Clothing Alexandria variants
      {
        id: 'var_sh_m_charcoal',
        productId: p3Id,
        name: 'M / Raw Indigo Charcoal',
        size: 'M',
        color: 'Raw Indigo Charcoal',
        sku: 'QTS-SH-ALX-M',
        price: 1950,
        stockQuantity: 10,
        displayOrder: 1,
      },
      {
        id: 'var_sh_l_charcoal',
        productId: p3Id,
        name: 'L / Raw Indigo Charcoal',
        size: 'L',
        color: 'Raw Indigo Charcoal',
        sku: 'QTS-SH-ALX-L',
        price: 1950,
        stockQuantity: 7,
        displayOrder: 2,
      },
      // Perfume Alexandria variants
      {
        id: 'var_p_alx_50ml',
        productId: p4Id,
        name: '50ml Flacon',
        volume: '50ml',
        sku: 'QTS-PF-ALX-50ML',
        price: 2550,
        stockQuantity: 12,
        displayOrder: 1,
      },
      {
        id: 'var_p_alx_100ml',
        productId: p4Id,
        name: '100ml Flacon',
        volume: '100ml',
        sku: 'QTS-PF-ALX-100ML',
        price: 3800,
        stockQuantity: 5,
        displayOrder: 2,
      },
    ];

    // Attributes
    this.data.productAttributes = [
      { id: 'attr_1', productId: p1Id, key: 'material', value: '100% Egyptian Combed Cotton (480 GSM)' },
      { id: 'attr_2', productId: p1Id, key: 'fit', value: 'Oversized Boxy Silhouette' },
      { id: 'attr_3', productId: p1Id, key: 'origin', value: 'Crafted in Cairo, Egypt' },
      { id: 'attr_4', productId: p2Id, key: 'gender', value: 'Unisex' },
      { id: 'attr_5', productId: p2Id, key: 'concentration', value: 'Extrait de Parfum (30% oil concentration)' },
      { id: 'attr_6', productId: p2Id, key: 'fragrance_family', value: 'Woody' },
      { id: 'attr_7', productId: p2Id, key: 'top_notes', value: 'Cardamom, Bergamot, Smoked Birch' },
      { id: 'attr_8', productId: p2Id, key: 'heart_notes', value: 'Egyptian Papyrus, Orris Concrete, Incense' },
      { id: 'attr_9', productId: p2Id, key: 'base_notes', value: 'Atlas Cedar, Black Amber, Raw Leather' },
      // Alex Attributes
      { id: 'attr_10', productId: p3Id, key: 'material', value: 'Raw Selvedge Egyptian Cotton' },
      { id: 'attr_11', productId: p3Id, key: 'fit', value: 'Structured Boxy Overshirt' },
      { id: 'attr_12', productId: p4Id, key: 'gender', value: 'Unisex' },
      { id: 'attr_13', productId: p4Id, key: 'concentration', value: 'Extrait de Parfum (30% oil concentration)' },
      { id: 'attr_14', productId: p4Id, key: 'fragrance_family', value: 'Aquatic' },
      { id: 'attr_15', productId: p4Id, key: 'top_notes', value: 'Sea Salt, Bergamot, Bitter Orange' },
      { id: 'attr_16', productId: p4Id, key: 'heart_notes', value: 'Coastal Sage, Marine Accord, Cypress' },
      { id: 'attr_17', productId: p4Id, key: 'base_notes', value: 'Ambergris, Weathered Driftwood, Musk' },
    ];

    this.save();
    return {
      citiesCount: this.data.cities.length,
      productsCount: this.data.products.length,
    };
  }

  // Reset database back to pure empty state (0 products, 0 cities)
  resetToEmpty() {
    this.data.products = [];
    this.data.productImages = [];
    this.data.productVariants = [];
    this.data.productAttributes = [];
    this.data.cities = [];
    this.save();
    return { success: true };
  }

  // --- GETTERS & QUERIES ---

  getSettings(): StoreSettings {
    return this.data.settings;
  }

  updateSettings(updates: Partial<StoreSettings>): StoreSettings {
    this.data.settings = { ...this.data.settings, ...updates };
    this.save();
    return this.data.settings;
  }

  getCities(onlyActive: boolean = true): City[] {
    return this.data.cities
      .filter((c) => !onlyActive || c.activeStatus)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getCityBySlug(slug: string): City | undefined {
    return this.data.cities.find((c) => c.slug === slug);
  }

  getCityById(id: string): City | undefined {
    return this.data.cities.find((c) => c.id === id);
  }

  createCity(cityData: Omit<City, 'id' | 'createdAt' | 'updatedAt'>): City {
    const newCity: City = {
      ...cityData,
      id: `city_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.cities.push(newCity);
    this.save();
    return newCity;
  }

  updateCity(id: string, updates: Partial<City>): City | null {
    const idx = this.data.cities.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.cities[idx] = {
      ...this.data.cities[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.cities[idx];
  }

  deleteCity(id: string, force: boolean = false): { success: boolean; message?: string } {
    const linkedProducts = this.data.products.filter((p) => p.cityId === id && !p.archived);
    if (linkedProducts.length > 0 && !force) {
      return {
        success: false,
        message: `Cannot delete city because ${linkedProducts.length} product(s) are assigned to it. Move products or archive city first.`,
      };
    }
    // Unlink products if force delete
    if (force) {
      this.data.products.forEach((p) => {
        if (p.cityId === id) p.cityId = null;
      });
    }
    this.data.cities = this.data.cities.filter((c) => c.id !== id);
    this.save();
    return { success: true };
  }

  // --- CATEGORIES ---

  getCategories(): Category[] {
    return [...this.data.categories].sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getCategoryBySlug(slug: string): Category | undefined {
    return this.data.categories.find((c) => c.slug === slug);
  }

  getCategoryById(id: string): Category | undefined {
    return this.data.categories.find((c) => c.id === id);
  }

  createCategory(catData: Omit<Category, 'id' | 'createdAt'>): Category {
    const newCategory: Category = {
      ...catData,
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
    };
    this.data.categories.push(newCategory);
    this.save();
    return newCategory;
  }

  updateCategory(id: string, updates: Partial<Category>): Category | null {
    const idx = this.data.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.data.categories[idx] = { ...this.data.categories[idx], ...updates };
    this.save();
    return this.data.categories[idx];
  }

  deleteCategory(
    id: string,
    action: 'prevent' | 'reassign' | 'archive' = 'prevent',
    targetCategoryId?: string
  ): { success: boolean; message?: string; affectedProducts?: number } {
    const affected = this.data.products.filter(
      (p) => (p.categoryId === id || p.subcategoryId === id) && !p.archived
    );

    if (affected.length > 0 && action === 'prevent') {
      return {
        success: false,
        message: `Category has ${affected.length} active products. Reassign products or archive category.`,
        affectedProducts: affected.length,
      };
    }

    if (action === 'archive') {
      const idx = this.data.categories.findIndex((c) => c.id === id);
      if (idx !== -1) {
        this.data.categories[idx].activeStatus = false;
        this.save();
        return { success: true, message: 'Category archived successfully.' };
      }
    }

    if (action === 'reassign' && targetCategoryId) {
      this.data.products.forEach((p) => {
        if (p.categoryId === id) p.categoryId = targetCategoryId;
        if (p.subcategoryId === id) p.subcategoryId = null;
      });
    }

    // Delete category and any subcategories that belonged to it
    this.data.categories = this.data.categories.filter((c) => c.id !== id && c.parentId !== id);
    this.save();
    return { success: true, affectedProducts: affected.length };
  }

  // --- PRODUCTS ---

  getProducts(filters: {
    productType?: 'clothing' | 'perfume';
    categorySlug?: string;
    subcategoryId?: string;
    citySlug?: string;
    cityId?: string;
    query?: string;
    publishedOnly?: boolean;
    featuredOnly?: boolean;
    gender?: string;
    concentration?: string;
    fragranceFamily?: string;
    size?: string;
    color?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'name';
  } = {}): (Product & {
    images: ProductImage[];
    variants: ProductVariant[];
    attributes: ProductAttribute[];
    category?: Category;
    subcategory?: Category;
    city?: City;
    totalStock: number;
  })[] {
    let result = this.data.products.filter((p) => {
      if (filters.publishedOnly && (!p.published || p.archived)) return false;
      if (!filters.publishedOnly && p.archived) return false;
      if (filters.productType && p.productType !== filters.productType) return false;
      if (filters.featuredOnly && !p.featured) return false;

      if (filters.cityId && p.cityId !== filters.cityId) return false;
      if (filters.citySlug) {
        const city = this.data.cities.find((c) => c.slug === filters.citySlug);
        if (!city || p.cityId !== city.id) return false;
      }

      if (filters.categorySlug) {
        const cat = this.data.categories.find((c) => c.slug === filters.categorySlug);
        if (!cat) return false;
        // Matches if directly categoryId or subcategoryId, or if cat has children
        const childCatIds = this.data.categories.filter((c) => c.parentId === cat.id).map((c) => c.id);
        const matchesCat = p.categoryId === cat.id || p.subcategoryId === cat.id || childCatIds.includes(p.categoryId) || (p.subcategoryId && childCatIds.includes(p.subcategoryId));
        if (!matchesCat) return false;
      }

      if (filters.subcategoryId && p.subcategoryId !== filters.subcategoryId && p.categoryId !== filters.subcategoryId) {
        return false;
      }

      if (filters.minPrice !== undefined && p.price < filters.minPrice) return false;
      if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false;

      if (filters.query) {
        const q = filters.query.toLowerCase().trim();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }

      return true;
    });

    // Attribute filters
    if (filters.gender || filters.concentration || filters.fragranceFamily) {
      result = result.filter((p) => {
        const pAttrs = this.data.productAttributes.filter((a) => a.productId === p.id);
        if (filters.gender) {
          const g = pAttrs.find((a) => a.key === 'gender');
          if (!g || g.value.toLowerCase() !== filters.gender.toLowerCase()) return false;
        }
        if (filters.concentration) {
          const c = pAttrs.find((a) => a.key === 'concentration');
          if (!c || c.value.toLowerCase() !== filters.concentration.toLowerCase()) return false;
        }
        if (filters.fragranceFamily) {
          const f = pAttrs.find((a) => a.key === 'fragrance_family');
          if (!f || f.value.toLowerCase() !== filters.fragranceFamily.toLowerCase()) return false;
        }
        return true;
      });
    }

    // Variant filters (size / color)
    if (filters.size || filters.color) {
      result = result.filter((p) => {
        const pVars = this.data.productVariants.filter((v) => v.productId === p.id);
        if (filters.size && !pVars.some((v) => v.size && v.size.toLowerCase() === filters.size!.toLowerCase())) {
          return false;
        }
        if (filters.color && !pVars.some((v) => v.color && v.color.toLowerCase() === filters.color!.toLowerCase())) {
          return false;
        }
        return true;
      });
    }

    // Sorting
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (filters.sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default newest
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // Map enriched product
    return result.map((p) => {
      const images = this.data.productImages
        .filter((img) => img.productId === p.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      const variants = this.data.productVariants
        .filter((v) => v.productId === p.id)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      const attributes = this.data.productAttributes.filter((a) => a.productId === p.id);
      const category = this.data.categories.find((c) => c.id === p.categoryId);
      const subcategory = p.subcategoryId ? this.data.categories.find((c) => c.id === p.subcategoryId) : undefined;
      const city = p.cityId ? this.data.cities.find((c) => c.id === p.cityId) : undefined;
      const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

      return {
        ...p,
        images,
        variants,
        attributes,
        category,
        subcategory,
        city,
        totalStock,
      };
    });
  }

  getProductBySlug(slug: string) {
    const p = this.data.products.find((prod) => prod.slug === slug);
    if (!p) return null;
    const images = this.data.productImages
      .filter((img) => img.productId === p.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const variants = this.data.productVariants
      .filter((v) => v.productId === p.id)
      .sort((a, b) => a.displayOrder - b.displayOrder);
    const attributes = this.data.productAttributes.filter((a) => a.productId === p.id);
    const category = this.data.categories.find((c) => c.id === p.categoryId);
    const subcategory = p.subcategoryId ? this.data.categories.find((c) => c.id === p.subcategoryId) : undefined;
    const city = p.cityId ? this.data.cities.find((c) => c.id === p.cityId) : undefined;
    const totalStock = variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0);

    return {
      ...p,
      images,
      variants,
      attributes,
      category,
      subcategory,
      city,
      totalStock,
    };
  }

  getProductById(id: string) {
    const p = this.data.products.find((prod) => prod.id === id);
    if (!p) return null;
    return this.getProductBySlug(p.slug);
  }

  createProduct(params: {
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'archived'>;
    images?: Omit<ProductImage, 'id' | 'productId'>[];
    variants?: Omit<ProductVariant, 'id' | 'productId'>[];
    attributes?: { key: string; value: string }[];
  }) {
    const productId = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newProduct: Product = {
      ...params.product,
      id: productId,
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.products.push(newProduct);

    // Images
    if (params.images && params.images.length > 0) {
      params.images.forEach((img, i) => {
        this.data.productImages.push({
          id: `img_${Date.now()}_${i}`,
          productId,
          url: img.url,
          alt: img.alt || newProduct.name,
          displayOrder: img.displayOrder || i + 1,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
        });
      });
    }

    // Variants
    if (params.variants && params.variants.length > 0) {
      params.variants.forEach((v, i) => {
        this.data.productVariants.push({
          id: `var_${Date.now()}_${i}`,
          productId,
          name: v.name,
          size: v.size,
          color: v.color,
          volume: v.volume,
          sku: v.sku || `${newProduct.sku}-V${i + 1}`,
          price: v.price || newProduct.price,
          stockQuantity: v.stockQuantity || 0,
          displayOrder: v.displayOrder || i + 1,
        });
      });
    } else {
      // Default single variant if none provided
      this.data.productVariants.push({
        id: `var_${Date.now()}_default`,
        productId,
        name: 'Standard',
        sku: newProduct.sku,
        price: newProduct.price,
        stockQuantity: 10,
        displayOrder: 1,
      });
    }

    // Attributes
    if (params.attributes && params.attributes.length > 0) {
      params.attributes.forEach((attr, i) => {
        this.data.productAttributes.push({
          id: `attr_${Date.now()}_${i}`,
          productId,
          key: attr.key,
          value: attr.value,
        });
      });
    }

    this.save();
    return this.getProductById(productId);
  }

  updateProduct(
    id: string,
    params: {
      product?: Partial<Product>;
      images?: Omit<ProductImage, 'id' | 'productId'>[];
      variants?: Omit<ProductVariant, 'id' | 'productId'>[];
      attributes?: { key: string; value: string }[];
    }
  ) {
    const idx = this.data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    if (params.product) {
      this.data.products[idx] = {
        ...this.data.products[idx],
        ...params.product,
        updatedAt: new Date().toISOString(),
      };
    }

    if (params.images) {
      this.data.productImages = this.data.productImages.filter((img) => img.productId !== id);
      params.images.forEach((img, i) => {
        this.data.productImages.push({
          id: `img_${Date.now()}_${i}`,
          productId: id,
          url: img.url,
          alt: img.alt || this.data.products[idx].name,
          displayOrder: img.displayOrder || i + 1,
          isPrimary: img.isPrimary !== undefined ? img.isPrimary : i === 0,
        });
      });
    }

    if (params.variants) {
      this.data.productVariants = this.data.productVariants.filter((v) => v.productId !== id);
      params.variants.forEach((v, i) => {
        this.data.productVariants.push({
          id: `var_${Date.now()}_${i}`,
          productId: id,
          name: v.name,
          size: v.size,
          color: v.color,
          volume: v.volume,
          sku: v.sku || `${this.data.products[idx].sku}-V${i + 1}`,
          price: v.price || this.data.products[idx].price,
          stockQuantity: v.stockQuantity || 0,
          displayOrder: v.displayOrder || i + 1,
        });
      });
    }

    if (params.attributes) {
      this.data.productAttributes = this.data.productAttributes.filter((a) => a.productId !== id);
      params.attributes.forEach((attr, i) => {
        this.data.productAttributes.push({
          id: `attr_${Date.now()}_${i}`,
          productId: id,
          key: attr.key,
          value: attr.value,
        });
      });
    }

    this.save();
    return this.getProductById(id);
  }

  // CRITICAL REQUIREMENT 12: SAFE DELETE SYSTEM
  // Deleting a product must NOT break historical orders because orders hold immutable snapshots.
  // If product is in past orders, safely ARCHIVE / UNPUBLISH it instead of hard purge, unless force hard purge requested.
  deleteProduct(id: string, hardDelete: boolean = false): { success: boolean; action: 'archived' | 'deleted'; message: string } {
    const hasOrders = this.data.orderItems.some((oi) => oi.productId === id);

    if (hasOrders && !hardDelete) {
      // Safe Archive
      const p = this.data.products.find((prod) => prod.id === id);
      if (p) {
        p.archived = true;
        p.published = false;
        p.updatedAt = new Date().toISOString();
        this.save();
        return {
          success: true,
          action: 'archived',
          message: 'Product is referenced by past orders and was safely archived and unpublished. All historical orders remain 100% intact.',
        };
      }
    }

    // Hard delete safely: set productId in past order items to null while preserving snapshots!
    this.data.orderItems.forEach((oi) => {
      if (oi.productId === id) {
        oi.productId = null; // Snapshots remain preserved!
      }
    });

    this.data.products = this.data.products.filter((p) => p.id !== id);
    this.data.productImages = this.data.productImages.filter((img) => img.productId !== id);
    this.data.productVariants = this.data.productVariants.filter((v) => v.productId !== id);
    this.data.productAttributes = this.data.productAttributes.filter((a) => a.productId !== id);
    this.save();

    return {
      success: true,
      action: 'deleted',
      message: 'Product removed safely. Historical order records and customer snapshots were preserved.',
    };
  }

  duplicateProduct(id: string) {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const newName = `${existing.name} (Copy)`;
    const newSlug = `${existing.slug}-copy-${Date.now().toString(36).substring(3)}`;

    return this.createProduct({
      product: {
        productType: existing.productType,
        name: newName,
        slug: newSlug,
        description: existing.description,
        price: existing.price,
        compareAtPrice: existing.compareAtPrice,
        sku: `${existing.sku}-CPY`,
        categoryId: existing.categoryId,
        subcategoryId: existing.subcategoryId,
        cityId: existing.cityId,
        featured: false,
        published: false,
      },
      images: existing.images.map((img) => ({
        url: img.url,
        alt: img.alt,
        displayOrder: img.displayOrder,
        isPrimary: img.isPrimary,
      })),
      variants: existing.variants.map((v) => ({
        name: v.name,
        size: v.size,
        color: v.color,
        volume: v.volume,
        sku: `${v.sku}-CPY`,
        price: v.price,
        stockQuantity: v.stockQuantity,
        displayOrder: v.displayOrder,
      })),
      attributes: existing.attributes.map((a) => ({
        key: a.key,
        value: a.value,
      })),
    });
  }

  // --- INVENTORY ---

  getInventoryOverview() {
    const lowStockThreshold = this.data.settings.lowStockThreshold || 5;

    return this.data.productVariants.map((v) => {
      const product = this.data.products.find((p) => p.id === v.productId);
      const stock = v.stockQuantity || 0;
      let status: 'IN STOCK' | 'LOW STOCK' | 'OUT OF STOCK' = 'IN STOCK';
      if (stock <= 0) status = 'OUT OF STOCK';
      else if (stock <= lowStockThreshold) status = 'LOW STOCK';

      return {
        variantId: v.id,
        productId: v.productId,
        productName: product ? product.name : 'Unknown Product',
        productType: product ? product.productType : 'clothing',
        variantName: v.name,
        sku: v.sku,
        size: v.size,
        color: v.color,
        volume: v.volume,
        price: v.price,
        stockQuantity: stock,
        status,
        productPublished: product ? product.published : false,
      };
    });
  }

  updateVariantStock(variantId: string, newStock: number) {
    const variant = this.data.productVariants.find((v) => v.id === variantId);
    if (!variant) return null;
    variant.stockQuantity = Math.max(0, newStock);
    this.save();
    return variant;
  }

  // --- ORDERS & CHECKOUT (Server-side price verification and stock decrement) ---

  createOrder(params: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    notes?: string;
    items: {
      productId: string;
      variantId?: string;
      quantity: number;
    }[];
  }): { success: boolean; order?: Order; items?: OrderItem[]; error?: string } {
    if (this.data.settings.storeStatus === 'closed') {
      return { success: false, error: 'Store is temporarily closed. Orders are not currently accepted.' };
    }

    if (!params.items || params.items.length === 0) {
      return { success: false, error: 'Cannot checkout with an empty bag.' };
    }

    // Server-side validation of prices and stock
    let subtotal = 0;
    const validatedItems: {
      productId: string;
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
    }[] = [];

    for (const item of params.items) {
      const product = this.data.products.find((p) => p.id === item.productId && p.published && !p.archived);
      if (!product) {
        return { success: false, error: `Product is no longer available or was unpublished.` };
      }

      let variant: ProductVariant | undefined;
      if (item.variantId) {
        variant = this.data.productVariants.find((v) => v.id === item.variantId && v.productId === product.id);
      }
      if (!variant) {
        variant = this.data.productVariants.find((v) => v.productId === product.id);
      }

      if (!variant) {
        return { success: false, error: `No valid inventory variant found for ${product.name}.` };
      }

      if (variant.stockQuantity < item.quantity) {
        return {
          success: false,
          error: `Insufficient stock for ${product.name} (${variant.name}). Only ${variant.stockQuantity} remaining.`,
        };
      }

      // Decrement stock atomically
      variant.stockQuantity -= item.quantity;

      const unitPrice = variant.price || product.price;
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      const primaryImg = this.data.productImages.find((img) => img.productId === product.id && img.isPrimary) ||
        this.data.productImages.find((img) => img.productId === product.id);

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        productNameSnapshot: product.name,
        priceSnapshot: unitPrice,
        sizeSnapshot: variant.size || null,
        colorSnapshot: variant.color || null,
        volumeSnapshot: variant.volume || null,
        skuSnapshot: variant.sku,
        imageSnapshot: primaryImg ? primaryImg.url : '',
        quantity: item.quantity,
        lineTotal,
      });
    }

    // Shipping calculations
    const shippingFee =
      subtotal >= (this.data.settings.freeShippingThreshold || 2000)
        ? 0
        : (this.data.settings.shippingFee || 85);
    const totalAmount = subtotal + shippingFee;

    // Generate Order Number: QUOTES-XXXXXX
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const orderNumber = `QUOTES-${randomHex}`;
    const orderId = `ord_${Date.now()}_${randomHex}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customerName: params.customerName.trim(),
      customerEmail: params.customerEmail.trim(),
      customerPhone: params.customerPhone.trim(),
      shippingAddress: params.shippingAddress.trim(),
      shippingCity: params.shippingCity.trim(),
      notes: params.notes?.trim() || '',
      subtotal,
      shippingFee,
      totalAmount,
      paymentMethod: 'INSTAPAY',
      paymentStatus: 'Pending Payment',
      orderStatus: 'Pending Payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.push(newOrder);

    // Save order items with immutable snapshots
    const createdOrderItems: OrderItem[] = [];
    validatedItems.forEach((val, i) => {
      const oi: OrderItem = {
        id: `oi_${Date.now()}_${i}`,
        orderId,
        productId: val.productId,
        variantId: val.variantId,
        productNameSnapshot: val.productNameSnapshot,
        priceSnapshot: val.priceSnapshot,
        sizeSnapshot: val.sizeSnapshot,
        colorSnapshot: val.colorSnapshot,
        volumeSnapshot: val.volumeSnapshot,
        skuSnapshot: val.skuSnapshot,
        imageSnapshot: val.imageSnapshot,
        quantity: val.quantity,
        lineTotal: val.lineTotal,
      };
      this.data.orderItems.push(oi);
      createdOrderItems.push(oi);
    });

    // Initial status history log
    this.data.orderStatusHistory.push({
      id: `osh_${Date.now()}_1`,
      orderId,
      status: 'Pending Payment',
      notes: 'Order placed by customer. Awaiting InstaPay payment transfer and receipt upload.',
      createdAt: new Date().toISOString(),
    });

    this.save();
    return { success: true, order: newOrder, items: createdOrderItems };
  }

  getOrderByNumber(orderNumber: string) {
    const cleanNum = orderNumber.trim().toUpperCase();
    const order = this.data.orders.find((o) => o.orderNumber.toUpperCase() === cleanNum);
    if (!order) return null;

    const items = this.data.orderItems.filter((oi) => oi.orderId === order.id);
    const history = this.data.orderStatusHistory
      .filter((h) => h.orderId === order.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    const receipt = this.data.paymentReceipts.find((r) => r.orderId === order.id);

    return {
      order,
      items,
      history,
      receipt,
    };
  }

  getOrderById(id: string) {
    const order = this.data.orders.find((o) => o.id === id);
    if (!order) return null;
    return this.getOrderByNumber(order.orderNumber);
  }

  getOrders(filters: { status?: OrderStatus; paymentStatus?: PaymentStatus } = {}) {
    let result = [...this.data.orders];
    if (filters.status) {
      result = result.filter((o) => o.orderStatus === filters.status);
    }
    if (filters.paymentStatus) {
      result = result.filter((o) => o.paymentStatus === filters.paymentStatus);
    }
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return result.map((o) => {
      const items = this.data.orderItems.filter((oi) => oi.orderId === o.id);
      const receipt = this.data.paymentReceipts.find((r) => r.orderId === o.id);
      return {
        ...o,
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        receipt,
      };
    });
  }

  updateOrderStatus(orderId: string, newStatus: OrderStatus, note?: string) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return null;

    order.orderStatus = newStatus;
    order.updatedAt = new Date().toISOString();

    this.data.orderStatusHistory.push({
      id: `osh_${Date.now()}`,
      orderId,
      status: newStatus,
      notes: note || `Order status updated to ${newStatus}.`,
      createdAt: new Date().toISOString(),
    });

    this.save();
    return order;
  }

  // --- PAYMENT RECEIPT UPLOAD & REVIEW ---

  uploadPaymentReceipt(orderNumber: string, receiptUrl: string, originalFilename: string) {
    const cleanNum = orderNumber.trim().toUpperCase();
    const order = this.data.orders.find((o) => o.orderNumber.toUpperCase() === cleanNum);
    if (!order) return null;

    // Remove existing receipt if replacement
    this.data.paymentReceipts = this.data.paymentReceipts.filter((r) => r.orderId !== order.id);

    const receipt: PaymentReceipt = {
      id: `rcpt_${Date.now()}`,
      orderId: order.id,
      receiptUrl,
      originalFilename,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
    };

    this.data.paymentReceipts.push(receipt);

    // Update order status to Payment Review
    order.paymentStatus = 'Payment Review';
    order.orderStatus = 'Payment Review';
    order.updatedAt = new Date().toISOString();

    this.data.orderStatusHistory.push({
      id: `osh_${Date.now()}`,
      orderId: order.id,
      status: 'Payment Review',
      notes: `Customer uploaded payment receipt (${originalFilename}). Under verification by store administrator.`,
      createdAt: new Date().toISOString(),
    });

    this.save();
    return receipt;
  }

  verifyPayment(orderId: string, decision: 'approve' | 'reject', adminNote?: string) {
    const order = this.data.orders.find((o) => o.id === orderId);
    if (!order) return null;

    const receipt = this.data.paymentReceipts.find((r) => r.orderId === orderId);
    if (receipt) {
      receipt.status = decision === 'approve' ? 'approved' : 'rejected';
      receipt.adminNote = adminNote || '';
      receipt.reviewedAt = new Date().toISOString();
    }

    if (decision === 'approve') {
      order.paymentStatus = 'Payment Approved';
      order.orderStatus = 'Payment Approved';
      this.data.orderStatusHistory.push({
        id: `osh_${Date.now()}`,
        orderId,
        status: 'Payment Approved',
        notes: adminNote ? `Payment verified: ${adminNote}` : 'Payment receipt verified and approved.',
        createdAt: new Date().toISOString(),
      });
    } else {
      order.paymentStatus = 'Payment Rejected';
      this.data.orderStatusHistory.push({
        id: `osh_${Date.now()}`,
        orderId,
        status: order.orderStatus, // maintain or flag rejected
        notes: `Payment receipt rejected: ${adminNote || 'Receipt could not be verified'}. Please re-upload your InstaPay receipt.`,
        createdAt: new Date().toISOString(),
      });
    }

    order.updatedAt = new Date().toISOString();
    this.save();
    return { order, receipt };
  }

  // --- ADMIN DASHBOARD REAL STATS ---
  getDashboardStats() {
    const orders = this.data.orders;
    const activeProducts = this.data.products.filter((p) => p.published && !p.archived);
    const lowStockThreshold = this.data.settings.lowStockThreshold || 5;

    let totalRevenue = 0;
    let pendingPayments = 0;
    orders.forEach((o) => {
      if (o.paymentStatus === 'Payment Approved') {
        totalRevenue += o.totalAmount;
      }
      if (o.paymentStatus === 'Payment Review' || o.paymentStatus === 'Pending Payment') {
        pendingPayments += 1;
      }
    });

    let lowStockCount = 0;
    let outOfStockCount = 0;
    this.data.productVariants.forEach((v) => {
      const stock = v.stockQuantity || 0;
      if (stock === 0) outOfStockCount += 1;
      else if (stock <= lowStockThreshold) lowStockCount += 1;
    });

    return {
      totalRevenue,
      totalOrders: orders.length,
      pendingPayments,
      totalProducts: this.data.products.length,
      activeProductsCount: activeProducts.length,
      totalCategories: this.data.categories.length,
      totalCities: this.data.cities.length,
      activeCitiesCount: this.data.cities.filter((c) => c.activeStatus).length,
      lowStockCount,
      outOfStockCount,
      recentOrders: orders.slice(-5).reverse(),
    };
  }

  // Customers summary
  getCustomersList() {
    const customerMap = new Map<string, {
      email: string;
      name: string;
      phone: string;
      ordersCount: number;
      totalSpend: number;
      lastOrderDate: string;
    }>();

    this.data.orders.forEach((o) => {
      const key = o.customerEmail.toLowerCase().trim();
      const existing = customerMap.get(key);
      if (existing) {
        existing.ordersCount += 1;
        if (o.paymentStatus === 'Payment Approved') existing.totalSpend += o.totalAmount;
        if (new Date(o.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = o.createdAt;
        }
      } else {
        customerMap.set(key, {
          email: o.customerEmail,
          name: o.customerName,
          phone: o.customerPhone,
          ordersCount: 1,
          totalSpend: o.paymentStatus === 'Payment Approved' ? o.totalAmount : 0,
          lastOrderDate: o.createdAt,
        });
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpend - a.totalSpend);
  }
}

export const db = new Database();
