import React from 'react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { navigate, settings } = useApp();
  const brandSymbol = settings?.brandSymbol || '"';

  return (
    <footer className="bg-[#080808] border-t border-white/10 text-white pt-20 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center mb-16">
          {/* Official Brand Symbol */}
          <div className="text-4xl font-serif text-white/40 mb-3 select-none" aria-hidden="true">
            {brandSymbol}
          </div>
          <div className="text-2xl font-display font-bold tracking-[0.25em] text-white">
            QUOTES
          </div>
          <p className="mt-2 text-xs font-mono tracking-widest text-neutral-500 uppercase">
            EVERY CITY HAS AN IDENTITY.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-xs font-medium tracking-widest uppercase text-neutral-400 mb-16 border-y border-white/5 py-6">
          <button onClick={() => navigate('/cities')} className="hover:text-white transition-colors">
            CITIES
          </button>
          <button onClick={() => navigate('/shop')} className="hover:text-white transition-colors">
            SHOP
          </button>
          <button onClick={() => navigate('/track-order')} className="hover:text-white transition-colors">
            TRACK ORDER
          </button>
          <button onClick={() => navigate('/about')} className="hover:text-white transition-colors">
            ABOUT
          </button>
          <button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">
            CONTACT
          </button>
        </div>

        {/* Bottom row: copyright & admin link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-neutral-500">
          <div>
            &copy; {new Date().getFullYear()} {settings?.brandName || 'QUOTES'}. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span>CAIRO, EGYPT</span>
            <button
              onClick={() => navigate('/admin')}
              className="text-neutral-500 hover:text-white transition-colors"
            >
              ADMIN PORTAL
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
