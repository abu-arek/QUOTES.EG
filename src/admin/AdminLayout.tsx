import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MapPin,
  ShoppingBag,
  CreditCard,
  Boxes,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Sparkles,
  RotateCcw,
  Menu,
  X,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { navigate, logoutAdmin, adminUser, settings, refreshSettings } = useApp();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const brandSymbol = settings?.brandSymbol || '"';

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'products', label: 'PRODUCTS', icon: Package, path: '/admin/products' },
    { id: 'categories', label: 'CATEGORIES', icon: FolderTree, path: '/admin/categories' },
    { id: 'cities', label: 'CITIES', icon: MapPin, path: '/admin/cities' },
    { id: 'orders', label: 'ORDERS', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'payments', label: 'PAYMENTS', icon: CreditCard, path: '/admin/payments' },
    { id: 'inventory', label: 'INVENTORY', icon: Boxes, path: '/admin/inventory' },
    { id: 'customers', label: 'CUSTOMERS', icon: Users, path: '/admin/customers' },
    { id: 'settings', label: 'SETTINGS', icon: Settings, path: '/admin/settings' },
  ];

  const handleSeed = async () => {
    if (!window.confirm('Populate store with sample Cairo & Alexandria drops, heavyweight hoodie, and Extrait de Parfum?')) return;
    try {
      setActionLoading(true);
      const res = await api.seedSampleData();
      setActionNotice(res.message);
      await refreshSettings();
      setTimeout(() => setActionNotice(null), 4000);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to seed sample data.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetEmpty = async () => {
    if (!window.confirm('Reset store back to 0 Products and 0 Cities? This enables testing Rule 55 & 56 "PRODUCTS COMING SOON" and "CITIES COMING SOON".')) return;
    try {
      setActionLoading(true);
      const res = await api.resetEmptyState();
      setActionNotice(res.message);
      setTimeout(() => setActionNotice(null), 4000);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Failed to reset empty state.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0E0E0E] border-r border-white/10 shrink-0 select-none">
        {/* Brand Lockup */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-bold text-lg tracking-widest text-white">
              QUOTES
            </span>
            <span className="text-white/40 font-serif text-sm">{brandSymbol}</span>
            <span className="text-[10px] font-mono text-neutral-500 ml-1">ADMIN</span>
          </div>
        </div>

        {/* Store Status Pill */}
        <div className="px-6 py-3 border-b border-white/5 bg-black/40 text-[11px] font-mono flex items-center justify-between">
          <span className="text-neutral-400">STORE:</span>
          <span
            className={`font-semibold uppercase ${
              settings?.storeStatus === 'open' ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {settings?.storeStatus === 'open' ? '● OPEN' : '○ CLOSED'}
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-mono tracking-wider transition-colors ${
                  isActive
                    ? 'bg-white text-black font-semibold'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Testing Actions (For verifying rule 55 & 56) */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-black/40 text-[11px] font-mono">
          <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
            TEST &amp; DEMO ACTIONS
          </div>
          <button
            onClick={handleSeed}
            disabled={actionLoading}
            className="w-full flex items-center gap-2 px-2.5 py-2 border border-white/20 text-neutral-300 hover:text-white hover:border-white transition-colors"
            title="Populate live sample products & cities"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">SEED SAMPLE DROPS</span>
          </button>
          <button
            onClick={handleResetEmpty}
            disabled={actionLoading}
            className="w-full flex items-center gap-2 px-2.5 py-2 border border-white/10 text-neutral-400 hover:text-red-300 hover:border-red-500/40 transition-colors"
            title="Reset to 0 products and 0 cities to test Coming Soon state"
          >
            <RotateCcw className="w-3.5 h-3.5 text-red-400" />
            <span className="truncate">RESET EMPTY (RULE 55)</span>
          </button>
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/10 bg-[#0B0B0B] flex items-center justify-between text-xs font-mono">
          <div className="truncate mr-2">
            <div className="text-white font-medium truncate">{adminUser?.name || 'Administrator'}</div>
            <div className="text-[10px] text-neutral-500 truncate">Store Owner</div>
          </div>
          <button
            onClick={logoutAdmin}
            className="text-neutral-500 hover:text-white p-1"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Mobile Topbar for Admin */}
      <header className="md:hidden bg-[#0E0E0E] border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-baseline gap-1.5 font-display font-bold text-sm tracking-widest text-white">
          <span>QUOTES</span>
          <span className="text-white/40 font-serif">{brandSymbol}</span>
          <span className="text-[10px] font-mono text-neutral-500 ml-1">ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-mono text-neutral-400 flex items-center gap-1 border border-white/10 px-2 py-1"
          >
            <span>STORE</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-neutral-400 hover:text-white p-1"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      {mobileNavOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-white/10 p-4 space-y-2 font-mono text-xs">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                setMobileNavOpen(false);
              }}
              className={`w-full text-left px-3 py-2 uppercase ${
                activeTab === item.id ? 'bg-white text-black font-bold' : 'text-neutral-400'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-white/10 flex justify-between">
            <button onClick={handleSeed} className="text-amber-400 py-1">
              SEED SAMPLE DROPS
            </button>
            <button onClick={logoutAdmin} className="text-red-400 py-1">
              LOGOUT
            </button>
          </div>
        </div>
      )}

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <div className="h-14 border-b border-white/10 bg-[#0E0E0E] px-6 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 uppercase">SECTION:</span>
            <span className="text-white uppercase font-semibold">{activeTab}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 uppercase"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">VIEW PUBLIC STORE</span>
            </button>
          </div>
        </div>

        {/* Global Action Banner */}
        {actionNotice && (
          <div className="bg-emerald-950/60 border-b border-emerald-500/40 px-6 py-2.5 text-xs font-mono text-emerald-300">
            {actionNotice}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
