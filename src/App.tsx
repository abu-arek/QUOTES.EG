import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CitiesPage } from './pages/CitiesPage';
import { CityDetailPage } from './pages/CityDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AboutPage, ContactPage } from './pages/AboutContactPages';

// Admin Pages
import { AdminLayout } from './admin/AdminLayout';
import { AdminLogin } from './admin/AdminLogin';
import { AdminDashboard } from './admin/AdminDashboard';
import { AdminProducts } from './admin/AdminProducts';
import { AdminProductForm } from './admin/AdminProductForm';
import { AdminCategories } from './admin/AdminCategories';
import { AdminCities } from './admin/AdminCities';
import { AdminOrders } from './admin/AdminOrders';
import { AdminOrderDetail } from './admin/AdminOrderDetail';
import { AdminInventory } from './admin/AdminInventory';
import { AdminPayments } from './admin/AdminPayments';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminSettings } from './admin/AdminSettings';

const RouterView: React.FC = () => {
  const { currentPath, isAdminLoggedIn } = useApp();

  // ---------------- ADMIN ROUTES ----------------
  if (currentPath.startsWith('/admin')) {
    // If not logged in and not specifically on login, redirect or show login
    if (!isAdminLoggedIn) {
      return <AdminLogin />;
    }

    if (currentPath === '/admin/login') {
      return <AdminLogin />;
    }

    // Admin Dashboard
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
      return (
        <AdminLayout activeTab="dashboard">
          <AdminDashboard />
        </AdminLayout>
      );
    }

    // Admin Products New
    if (currentPath === '/admin/products/new') {
      return (
        <AdminLayout activeTab="products">
          <AdminProductForm />
        </AdminLayout>
      );
    }

    // Admin Products Edit
    const editProductMatch = currentPath.match(/^\/admin\/products\/([^/]+)\/edit$/);
    if (editProductMatch) {
      return (
        <AdminLayout activeTab="products">
          <AdminProductForm productId={editProductMatch[1]} />
        </AdminLayout>
      );
    }

    // Admin Products List
    if (currentPath === '/admin/products') {
      return (
        <AdminLayout activeTab="products">
          <AdminProducts />
        </AdminLayout>
      );
    }

    // Admin Categories
    if (currentPath.startsWith('/admin/categories')) {
      return (
        <AdminLayout activeTab="categories">
          <AdminCategories />
        </AdminLayout>
      );
    }

    // Admin Cities
    if (currentPath.startsWith('/admin/cities')) {
      return (
        <AdminLayout activeTab="cities">
          <AdminCities />
        </AdminLayout>
      );
    }

    // Admin Orders Detail
    const orderDetailMatch = currentPath.match(/^\/admin\/orders\/([^/]+)$/);
    if (orderDetailMatch) {
      return (
        <AdminLayout activeTab="orders">
          <AdminOrderDetail orderId={orderDetailMatch[1]} />
        </AdminLayout>
      );
    }

    // Admin Orders List
    if (currentPath === '/admin/orders') {
      return (
        <AdminLayout activeTab="orders">
          <AdminOrders />
        </AdminLayout>
      );
    }

    // Admin Inventory
    if (currentPath === '/admin/inventory') {
      return (
        <AdminLayout activeTab="inventory">
          <AdminInventory />
        </AdminLayout>
      );
    }

    // Admin Payments
    if (currentPath === '/admin/payments') {
      return (
        <AdminLayout activeTab="payments">
          <AdminPayments />
        </AdminLayout>
      );
    }

    // Admin Customers
    if (currentPath === '/admin/customers') {
      return (
        <AdminLayout activeTab="customers">
          <AdminCustomers />
        </AdminLayout>
      );
    }

    // Admin Settings
    if (currentPath === '/admin/settings') {
      return (
        <AdminLayout activeTab="settings">
          <AdminSettings />
        </AdminLayout>
      );
    }

    // Fallback to Dashboard
    return (
      <AdminLayout activeTab="dashboard">
        <AdminDashboard />
      </AdminLayout>
    );
  }

  // ---------------- PUBLIC CUSTOMER STORE ROUTES ----------------

  let pageContent: React.ReactNode;

  if (currentPath === '/') {
    pageContent = <HomePage />;
  } else if (currentPath === '/shop') {
    pageContent = <ShopPage />;
  } else if (currentPath === '/clothing') {
    pageContent = <ShopPage initialType="clothing" />;
  } else if (currentPath === '/perfumes') {
    pageContent = <ShopPage initialType="perfume" />;
  } else if (currentPath.startsWith('/categories/')) {
    const slug = currentPath.replace('/categories/', '');
    pageContent = <ShopPage categorySlug={slug} />;
  } else if (currentPath === '/cities') {
    pageContent = <CitiesPage />;
  } else if (currentPath.startsWith('/cities/')) {
    const slug = currentPath.replace('/cities/', '');
    pageContent = <CityDetailPage slug={slug} />;
  } else if (currentPath.startsWith('/products/')) {
    const slug = currentPath.replace('/products/', '');
    pageContent = <ProductDetailPage slug={slug} />;
  } else if (currentPath === '/cart') {
    pageContent = <CartPage />;
  } else if (currentPath === '/checkout') {
    pageContent = <CheckoutPage />;
  } else if (currentPath.startsWith('/order-confirmation/')) {
    const orderNumber = currentPath.replace('/order-confirmation/', '');
    pageContent = <OrderConfirmationPage orderNumber={orderNumber} />;
  } else if (currentPath === '/track-order') {
    pageContent = <TrackOrderPage />;
  } else if (currentPath === '/about') {
    pageContent = <AboutPage />;
  } else if (currentPath === '/contact') {
    pageContent = <ContactPage />;
  } else {
    // Default fallback to Home
    pageContent = <HomePage />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0B0B] text-neutral-100">
      <Navbar />
      <main className="flex-1">{pageContent}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterView />
    </AppProvider>
  );
}
