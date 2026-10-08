import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { City, Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, Sparkles, Shirt, Droplets } from 'lucide-react';

interface CityDetailPageProps {
  slug: string;
}

export const CityDetailPage: React.FC<CityDetailPageProps> = ({ slug }) => {
  const { navigate, settings } = useApp();
  const [city, setCity] = useState<City | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewFilter, setViewFilter] = useState<'all' | 'clothing' | 'perfume'>('all');

  const brandSymbol = settings?.brandSymbol || '"';

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        setLoading(true);
        const data = await api.getCityBySlug(slug);
        setCity(data.city);
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to load city details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCityData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
        ALIGNING METROPOLITAN MATRIX...
      </div>
    );
  }

  if (!city) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-white">
        <div className="text-4xl font-serif text-white/30 mb-4 select-none">"</div>
        <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
          CITY NOT FOUND
        </h2>
        <p className="text-xs font-mono text-neutral-400 mb-8 uppercase">
          This city is not currently in the QUOTES geographic roster.
        </p>
        <button
          onClick={() => navigate('/cities')}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider"
        >
          VIEW ALL CITIES
        </button>
      </div>
    );
  }

  const clothingProducts = products.filter((p) => p.productType === 'clothing');
  const perfumeProducts = products.filter((p) => p.productType === 'perfume');

  return (
    <div className="text-white min-h-screen">
      {/* City Hero Banner */}
      <div className="relative min-h-[50vh] border-b border-white/10 flex flex-col justify-between p-6 sm:p-12 overflow-hidden bg-[#121212]">
        {city.heroImage && (
          <img
            src={city.heroImage}
            alt={city.name}
            className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale contrast-125"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-black/50 to-transparent" />

        {/* Back navigation */}
        <div className="relative z-10 flex items-center justify-between">
          <button
            onClick={() => navigate('/cities')}
            className="text-xs font-mono tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 uppercase transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>ALL CITIES</span>
          </button>

          <div className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 bg-black/60 px-3 py-1 border border-white/10">
            CLOTHING &amp; PERFUMES CAPSULE
          </div>
        </div>

        {/* City Title Lockup */}
        <div className="relative z-10 max-w-4xl mt-12">
          <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-2">
            METROPOLIS &bull; {city.country}
          </div>
          <h1 className="text-4xl sm:text-7xl font-display font-extrabold uppercase tracking-tight">
            {city.name}
          </h1>
          {city.description && (
            <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-300 max-w-2xl leading-relaxed">
              {city.description}
            </p>
          )}

          {/* Pill summary of pieces */}
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 text-white">
              <Shirt className="w-3.5 h-3.5 text-neutral-400" />
              <span>{clothingProducts.length} APPAREL PIECES</span>
            </span>
            <span aria-hidden="true">&bull;</span>
            <span className="flex items-center gap-1.5 text-white">
              <Droplets className="w-3.5 h-3.5 text-neutral-400" />
              <span>{perfumeProducts.length} HAUTE PERFUMES</span>
            </span>
          </div>
        </div>
      </div>

      {/* City Products Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Navigation & Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-baseline border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              METROPOLITAN DROP
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight mt-1">
              {city.name} COLLECTION
            </h2>
          </div>

          {/* Filter Type Tabs */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3 py-1.5 border transition-colors ${
                viewFilter === 'all'
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              ALL PIECES ({products.length})
            </button>
            <button
              onClick={() => setViewFilter('clothing')}
              className={`px-3 py-1.5 border transition-colors ${
                viewFilter === 'clothing'
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              CLOTHING ONLY ({clothingProducts.length})
            </button>
            <button
              onClick={() => setViewFilter('perfume')}
              className={`px-3 py-1.5 border transition-colors ${
                viewFilter === 'perfume'
                  ? 'border-white bg-white text-black font-semibold'
                  : 'border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              PERFUMES ONLY ({perfumeProducts.length})
            </button>
          </div>
        </div>

        {/* Empty State if no products at all in this city */}
        {products.length === 0 ? (
          <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
            <span className="text-4xl font-serif text-white/30 mb-4 select-none" aria-hidden="true">
              {brandSymbol}
            </span>
            <h3 className="text-xl font-display font-bold tracking-widest uppercase">
              NO PIECES CURRENTLY ASSIGNED TO {city.name}
            </h3>
            <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md">
              THE NEXT ARCHITECTURAL APPAREL &amp; PERFUME CAPSULE FOR THIS CITY IS IN PRODUCTION.
            </p>
          </div>
        ) : viewFilter === 'all' ? (
          /* ALL VIEW: Both Clothing and Perfumes displayed together side by side */
          <div className="space-y-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3 text-xs font-mono tracking-widest uppercase text-white font-semibold">
                <span className="flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-neutral-400" />
                  <span>APPAREL</span>
                </span>
                <span className="text-neutral-600">&amp;</span>
                <span className="flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-neutral-400" />
                  <span>PERFUMES</span>
                </span>
                <span className="text-neutral-500">&bull; {city.name} METROPOLITAN CAPSULE</span>
              </div>
              <span className="text-xs font-mono text-neutral-400">
                {products.length} TOTAL PIECES
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        ) : viewFilter === 'clothing' ? (
          /* CLOTHING ONLY VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
                CLOTHING CAPSULE &bull; {city.name}
              </div>
              <span className="text-xs font-mono text-neutral-400">{clothingProducts.length} PIECES</span>
            </div>

            {clothingProducts.length === 0 ? (
              <div className="py-16 text-center text-xs font-mono text-neutral-500 uppercase">
                NO CLOTHING PIECES CURRENTLY ASSIGNED TO {city.name}.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {clothingProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* PERFUMES ONLY VIEW */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="text-xs font-mono tracking-widest uppercase text-white font-semibold">
                HAUTE PARFUMERIE &bull; {city.name}
              </div>
              <span className="text-xs font-mono text-neutral-400">{perfumeProducts.length} FLACONS</span>
            </div>

            {perfumeProducts.length === 0 ? (
              <div className="py-16 text-center text-xs font-mono text-neutral-500 uppercase">
                NO PERFUMES CURRENTLY ASSIGNED TO {city.name}.
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                {perfumeProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
