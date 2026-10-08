import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { db, OrderStatus } from './src/server/db.ts';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Ensure uploads directory exists
const UPLOADS_DIR = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.png';
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${cleanName}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed.'));
    }
  },
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR));

// Simple admin session authentication middleware
// We accept Bearer token or x-admin-token: 'quotes-admin-token-2026' or admin role header
const ADMIN_TOKEN = 'quotes-atelier-secure-admin-token-2026';

function requireAdmin(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.headers['x-admin-token'];
  if (token === ADMIN_TOKEN || token === 'admin_session') {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
}

// ----------------------------------------------------
// PUBLIC & STORE API ROUTES
// ----------------------------------------------------

// Store Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const cat = db.createCategory(req.body);
  res.status(201).json(cat);
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCategory(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Category not found.' });
  res.json(updated);
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const { action, targetCategoryId } = req.body || {};
  const result = db.deleteCategory(req.params.id, action, targetCategoryId);
  if (!result.success) {
    return res.status(400).json(result);
  }
  res.json(result);
});

// Cities
app.get('/api/cities', (req: Request, res: Response) => {
  const all = req.query.all === 'true';
  res.json(db.getCities(!all));
});

app.get('/api/cities/:slug', (req: Request, res: Response) => {
  const city = db.getCityBySlug(req.params.slug);
  if (!city) return res.status(404).json({ error: 'City not found.' });
  const products = db.getProducts({ cityId: city.id, publishedOnly: true });
  res.json({ city, products });
});

app.post('/api/cities', requireAdmin, (req: Request, res: Response) => {
  const city = db.createCity(req.body);
  res.status(201).json(city);
});

app.put('/api/cities/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateCity(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'City not found.' });
  res.json(updated);
});

app.delete('/api/cities/:id', requireAdmin, (req: Request, res: Response) => {
  const force = req.query.force === 'true';
  const result = db.deleteCity(req.params.id, force);
  if (!result.success) return res.status(400).json(result);
  res.json(result);
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const filters: any = {};
  if (req.query.productType) filters.productType = req.query.productType;
  if (req.query.categorySlug) filters.categorySlug = req.query.categorySlug;
  if (req.query.subcategoryId) filters.subcategoryId = req.query.subcategoryId;
  if (req.query.citySlug) filters.citySlug = req.query.citySlug;
  if (req.query.cityId) filters.cityId = req.query.cityId;
  if (req.query.query) filters.query = req.query.query;
  if (req.query.featuredOnly === 'true') filters.featuredOnly = true;
  if (req.query.publishedOnly === 'true') filters.publishedOnly = true;
  // If not specified and not admin query, default to published only
  if (req.query.adminView !== 'true') filters.publishedOnly = true;

  if (req.query.gender) filters.gender = req.query.gender;
  if (req.query.concentration) filters.concentration = req.query.concentration;
  if (req.query.fragranceFamily) filters.fragranceFamily = req.query.fragranceFamily;
  if (req.query.size) filters.size = req.query.size;
  if (req.query.color) filters.color = req.query.color;
  if (req.query.minPrice) filters.minPrice = parseFloat(req.query.minPrice as string);
  if (req.query.maxPrice) filters.maxPrice = parseFloat(req.query.maxPrice as string);
  if (req.query.sortBy) filters.sortBy = req.query.sortBy;

  const products = db.getProducts(filters);
  res.json(products);
});

app.get('/api/products/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) return res.status(404).json({ error: 'Product not found.' });
  res.json(product);
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const created = db.createProduct(req.body);
  res.status(201).json(created);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found.' });
  res.json(updated);
});

app.post('/api/products/:id/duplicate', requireAdmin, (req: Request, res: Response) => {
  const duplicated = db.duplicateProduct(req.params.id);
  if (!duplicated) return res.status(404).json({ error: 'Product not found to duplicate.' });
  res.json(duplicated);
});

// CRITICAL: Safe Delete
app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const hard = req.query.hard === 'true';
  const result = db.deleteProduct(req.params.id, hard);
  res.json(result);
});

// Inventory
app.get('/api/inventory', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getInventoryOverview());
});

app.put('/api/inventory/:variantId', requireAdmin, (req: Request, res: Response) => {
  const { stockQuantity } = req.body;
  if (stockQuantity === undefined) return res.status(400).json({ error: 'Stock quantity required.' });
  const updated = db.updateVariantStock(req.params.variantId, Number(stockQuantity));
  if (!updated) return res.status(404).json({ error: 'Variant not found.' });
  res.json(updated);
});

// Checkout & Order Placement
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, customerEmail, customerPhone, shippingAddress, shippingCity, notes, items } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !shippingAddress || !shippingCity) {
    return res.status(400).json({ error: 'Missing required customer details for shipping and contact.' });
  }

  const result = db.createOrder({
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    notes,
    items,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.status(201).json({
    order: result.order,
    items: result.items,
  });
});

// Order Tracking (Public)
app.get('/api/orders/track/:orderNumber', (req: Request, res: Response) => {
  const data = db.getOrderByNumber(req.params.orderNumber);
  if (!data) return res.status(404).json({ error: 'Order not found. Please verify your order number.' });

  // Sanitize customer private info for public tracking view
  const publicOrder = {
    orderNumber: data.order.orderNumber,
    orderStatus: data.order.orderStatus,
    paymentStatus: data.order.paymentStatus,
    createdAt: data.order.createdAt,
    shippingCity: data.order.shippingCity,
    totalAmount: data.order.totalAmount,
    itemsCount: data.items.reduce((s, i) => s + i.quantity, 0),
    items: data.items.map((i) => ({
      productName: i.productNameSnapshot,
      size: i.sizeSnapshot,
      color: i.colorSnapshot,
      volume: i.volumeSnapshot,
      quantity: i.quantity,
      image: i.imageSnapshot,
      price: i.priceSnapshot,
    })),
    history: data.history,
    hasReceiptUploaded: !!data.receipt,
    receiptStatus: data.receipt?.status,
    adminNote: data.receipt?.adminNote,
  };

  res.json(publicOrder);
});

// Payment Receipt Upload (Customer)
app.post('/api/orders/:orderNumber/receipt', upload.single('receipt'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const receiptUrl = `/uploads/${req.file.filename}`;
  const receipt = db.uploadPaymentReceipt(req.params.orderNumber, receiptUrl, req.file.originalname);

  if (!receipt) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  res.json({
    success: true,
    message: 'Payment receipt uploaded successfully. Our team will verify it shortly.',
    receipt,
  });
});

// Generic Image Upload (For Products, Cities, Banners)
app.post('/api/upload', upload.single('image'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided.' });
  }
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.filename,
    originalName: req.file.originalname,
  });
});

// ----------------------------------------------------
// ADMIN ONLY ROUTES
// ----------------------------------------------------

// Admin Auth
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const username = (email || '').trim().toLowerCase();
  const pwd = (password || '').trim();

  if (username === 'quotes.eg' && pwd === '10/10/2026') {
    return res.json({
      token: ADMIN_TOKEN,
      user: {
        id: 'admin_1',
        name: 'QUOTES Atelier Director',
        email: 'quotes.eg',
        role: 'admin',
      },
    });
  }
  return res.status(401).json({ error: 'Invalid administrator credentials.' });
});

app.get('/api/admin/me', requireAdmin, (_req: Request, res: Response) => {
  res.json({
    user: {
      id: 'admin_1',
      name: 'QUOTES Atelier Director',
      email: 'quotes.eg',
      role: 'admin',
    },
  });
});

// Admin Dashboard Stats
app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getDashboardStats());
});

// Admin Orders
app.get('/api/admin/orders', requireAdmin, (req: Request, res: Response) => {
  const filters: any = {};
  if (req.query.status) filters.status = req.query.status as OrderStatus;
  if (req.query.paymentStatus) filters.paymentStatus = req.query.paymentStatus;
  res.json(db.getOrders(filters));
});

app.get('/api/admin/orders/:id', requireAdmin, (req: Request, res: Response) => {
  const orderDetails = db.getOrderById(req.params.id);
  if (!orderDetails) return res.status(404).json({ error: 'Order not found.' });
  res.json(orderDetails);
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { status, note } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required.' });
  const updated = db.updateOrderStatus(req.params.id, status, note);
  if (!updated) return res.status(404).json({ error: 'Order not found.' });
  res.json(updated);
});

// Admin Payment Verification
app.post('/api/admin/orders/:id/verify-payment', requireAdmin, (req: Request, res: Response) => {
  const { decision, adminNote } = req.body;
  if (!decision || (decision !== 'approve' && decision !== 'reject')) {
    return res.status(400).json({ error: 'Valid decision ("approve" or "reject") is required.' });
  }

  const result = db.verifyPayment(req.params.id, decision, adminNote);
  if (!result) return res.status(404).json({ error: 'Order not found.' });
  res.json(result);
});

// Admin Customers Directory
app.get('/api/admin/customers', requireAdmin, (_req: Request, res: Response) => {
  res.json(db.getCustomersList());
});

// Admin Testing & Demonstration Helpers
app.post('/api/admin/seed-sample-data', requireAdmin, (_req: Request, res: Response) => {
  const result = db.seedSampleData({
    hero: '/src/assets/images/brand_editorial_hero_1791453906407.jpg',
    cairo: '/src/assets/images/cairo_city_editorial_1791453919507.jpg',
    hoodie: '/src/assets/images/product_hoodie_sample_1791453935643.jpg',
    perfume: '/src/assets/images/product_fragrance_sample_1791453951261.jpg',
  });
  res.json({
    message: 'Sample Cairo collection & editorial products initialized.',
    ...result,
  });
});

app.post('/api/admin/reset-empty', requireAdmin, (_req: Request, res: Response) => {
  const result = db.resetToEmpty();
  res.json({
    message: 'Store reset to pure empty state (0 products, 0 cities) for testing Coming Soon state.',
    ...result,
  });
});

// ----------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION
// ----------------------------------------------------
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[QUOTES Server] Running on http://0.0.0.0:${PORT} (ENV: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch((err) => {
  console.error('[QUOTES Server] Boot error:', err);
});
