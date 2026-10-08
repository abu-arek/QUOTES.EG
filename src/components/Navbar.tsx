import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Menu, X, Shield, Search } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, cartCount, setIsCartDrawerOpen, settings } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const brandSymbol = settings?.brandSymbol || '"';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navLinks = [
    { label: 'CITIES', path: '/cities' },
    { label: 'TRACK ORDER', path: '/track-order' },
  ];

  return (
    <>
      {/* Top Notice if Store is Closed */}
      {settings?.storeStatus === 'closed' && (
        <div className="bg-[#1C1814] text-[#E0B075] text-xs font-mono tracking-wider py-1.5 px-4 text-center border-b border-[#3D2E1E]">
          STORE ARCHIVE MODE — CHECKOUT TEMPORARILY PAUSED FOR PRIVATE DROP
        </div>
      )}

      {/* Top Bar Contract: 3 zones */}
      <header className="sticky top-0 z-40 bg-[#0B0B0B]/90 backdrop-blur-md border-b border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Zone 1: Brand title, single element */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="group text-left text-xl font-bold tracking-widest text-white hover:text-white/80 transition-opacity flex items-baseline gap-1"
            >
              <span className="font-display">QUOTES</span>
              <span className="text-white/50 text-sm font-serif select-none" aria-hidden="true">
                {brandSymbol}
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 nav links, single-line clean text */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`transition-colors uppercase hover:text-white py-1 relative ${
                    isActive ? 'text-white' : 'text-neutral-400'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1px] bg-white" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-5">
            {/* Search Toggle */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-neutral-400 hover:text-white transition-colors p-1"
              title="Search store"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Admin Portal Shortcut */}
            <button
              onClick={() => navigate('/admin')}
              className="text-neutral-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 font-mono tracking-wider py-1 px-2 border border-white/10 hover:border-white/30"
              title="Owner Admin Portal"
            >
              <Shield className="w-3 h-3 text-neutral-400" />
              <span className="hidden sm:inline">ADMIN</span>
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="text-white hover:text-neutral-300 transition-colors flex items-center gap-2 text-xs font-mono tracking-wider group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
              <span className="tabular-nums font-semibold">BAG ({cartCount})</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-neutral-400 hover:text-white p-1"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Inline Search Bar */}
        {searchOpen && (
          <div className="border-t border-white/10 bg-[#121212] px-4 py-3">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, category, city, or SKU..."
                className="flex-1 bg-black/60 border border-white/20 text-white text-sm px-4 py-2 focus:outline-none focus:border-white tracking-wide"
                autoFocus
              />
              <button
                type="submit"
                className="bg-white text-black text-xs font-semibold uppercase tracking-wider px-5 py-2 hover:bg-neutral-200 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-neutral-400 hover:text-white px-2 text-sm"
              >
                Close
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-16 z-30 bg-[#0B0B0B] border-t border-white/10 p-6 md:hidden flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-[10px] font-mono tracking-widest text-neutral-500 uppercase">
              NAVIGATION
            </div>
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-lg font-display tracking-widest uppercase py-2 border-b border-white/5 ${
                  currentPath === link.path ? 'text-white' : 'text-neutral-400'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => {
                navigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left text-sm font-mono tracking-wider text-neutral-400 py-3 uppercase"
            >
              ATELIER ADMIN PORTAL
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-neutral-500 font-mono">
            QUOTES {brandSymbol} — CAIRO, EGYPT
          </div>
        </div>
      )}
    </>
  );
};
