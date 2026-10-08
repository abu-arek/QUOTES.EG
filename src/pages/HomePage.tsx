import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, City } from '../types';
import { ProductCard } from '../components/ProductCard';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate, settings } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const brandSymbol = settings?.brandSymbol || '"';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodList, cityList] = await Promise.all([
          api.getProducts({ publishedOnly: true }),
          api.getCities(false),
        ]);
        setProducts(prodList);
        setCities(cityList);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8);

  return (
    <div className="min-h-screen text-white">
      {/* ----------------- EDITORIAL HERO SECTION ----------------- */}
      <section className="relative min-h-[85vh] flex flex-col justify-between border-b border-white/10 px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">

        {/* Top Kicker */}
        <div className="relative z-20 flex justify-between items-start text-xs font-mono tracking-widest text-neutral-400 uppercase">
          <div className="flex items-center gap-2">
            <span>ATELIER EGYPT</span>
            <span aria-hidden="true">·</span>
            <span>EDITION 2026</span>
          </div>
          <div className="hidden sm:block text-neutral-500">
            FASHION &bull; HAUTE PARFUMERIE
          </div>
        </div>

        {/* Hero Typography Spec:
            "
            QUOTES
            EVERY CITY
            HAS AN IDENTITY.
        */}
        <div className="relative z-20 my-auto py-12 max-w-5xl">
          <div className="text-5xl sm:text-7xl font-serif text-white/40 mb-2 select-none" aria-hidden="true">
            {brandSymbol}
          </div>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-display font-extrabold tracking-tight uppercase leading-[0.95]">
            QUOTES
          </h1>
          <p className="mt-6 text-2xl sm:text-4xl md:text-5xl font-display font-light tracking-wide text-neutral-300 uppercase max-w-3xl leading-tight">
            EVERY CITY<br />HAS AN IDENTITY.
          </p>
        </div>

        {/* Navigation Chapters:
            01 / CITIES
            02 / SHOP
            03 / TRACK ORDER
            04 / BRAND
        */}
        <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-white/10 text-xs font-mono tracking-widest uppercase">
          <button
            onClick={() => navigate('/cities')}
            className="text-left py-3 group hover:text-white transition-colors flex items-center justify-between border-b sm:border-b-0 border-white/5"
          >
            <div>
              <span className="text-neutral-500 mr-2">01 /</span>
              <span className="text-neutral-200 group-hover:text-white font-medium">CITIES</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/shop')}
            className="text-left py-3 group hover:text-white transition-colors flex items-center justify-between border-b sm:border-b-0 border-white/5"
          >
            <div>
              <span className="text-neutral-500 mr-2">02 /</span>
              <span className="text-neutral-200 group-hover:text-white font-medium">SHOP</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/track-order')}
            className="text-left py-3 group hover:text-white transition-colors flex items-center justify-between border-b sm:border-b-0 border-white/5"
          >
            <div>
              <span className="text-neutral-500 mr-2">03 /</span>
              <span className="text-neutral-200 group-hover:text-white font-medium">TRACK ORDER</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>

          <button
            onClick={() => navigate('/about')}
            className="text-left py-3 group hover:text-white transition-colors flex items-center justify-between"
          >
            <div>
              <span className="text-neutral-500 mr-2">04 /</span>
              <span className="text-neutral-200 group-hover:text-white font-medium">BRAND</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </section>

      {/* ----------------- SECTION 01: CITIES GRID ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              01 / IDENTITY
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight uppercase mt-1">
              CITIES
            </h2>
          </div>
          <button
            onClick={() => navigate('/cities')}
            className="mt-4 sm:mt-0 text-xs font-mono tracking-widest text-neutral-400 hover:text-white uppercase flex items-center gap-1.5 group"
          >
            <span>VIEW ALL CITIES</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* COMING SOON LOGIC FOR CITIES */}
        {cities.length === 0 ? (
          <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
            <span className="text-4xl font-serif text-white/30 mb-4 select-none" aria-hidden="true">
              {brandSymbol}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-widest uppercase">
              CITIES COMING SOON.
            </h3>
            <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md">
              THE URBAN GEOGRAPHY OF QUOTES IS EXPANDING. ARCHITECTURAL IDENTITIES IN PROGRESS.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {cities.map((city, idx) => {
              // Asymmetric grid: featured cities span 8 cols, others span 4 or 6 cols
              const spanClass = city.featured
                ? 'md:col-span-8 aspect-[16/10]'
                : idx % 2 === 0
                ? 'md:col-span-4 aspect-[4/5]'
                : 'md:col-span-4 aspect-[4/5]';

              return (
                <div
                  key={city.id}
                  onClick={() => navigate(`/cities/${city.slug}`)}
                  className={`group relative overflow-hidden bg-[#141414] border border-white/10 cursor-pointer ${spanClass}`}
                >
                  {city.heroImage || city.thumbnailImage ? (
                    <img
                      src={city.heroImage || city.thumbnailImage}
                      alt={city.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-4xl font-serif text-white/20 select-none">"</span>
                      <span className="text-sm font-mono tracking-widest uppercase mt-4 text-neutral-400">
                        {city.name}
                      </span>
                    </div>
                  )}

                  {/* Scrim Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* City Details */}
                  <div className="absolute inset-x-0 bottom-0 p-6 flex items-end justify-between">
                    <div>
                      <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                        <span>{city.country}</span>
                        <span aria-hidden="true">&bull;</span>
                        <span className="text-white/80">CLOTHING &amp; PERFUMES</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform">
                        {city.name}
                      </h3>
                      {city.description && (
                        <p className="text-xs text-neutral-300 font-mono line-clamp-1 mt-1 max-w-md hidden sm:block">
                          {city.description}
                        </p>
                      )}
                    </div>

                    <div className="w-9 h-9 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ----------------- SECTION 02: PRODUCTS / FEATURED ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-b border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-baseline mb-12 border-b border-white/10 pb-6">
          <div>
            <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              02 / CURATED PIECES
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight uppercase mt-1">
              CURRENT RELEASE
            </h2>
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0 text-xs font-mono tracking-widest uppercase">
            <button
              onClick={() => navigate('/shop')}
              className="text-white hover:text-neutral-300 transition-colors flex items-center gap-1 group"
            >
              <span>EXPLORE ALL ARCHIVES</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* COMING SOON LOGIC FOR PRODUCTS */}
        {products.length === 0 ? (
          <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
            <span className="text-4xl font-serif text-white/30 mb-4 select-none" aria-hidden="true">
              {brandSymbol}
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold tracking-widest uppercase">
              PRODUCTS COMING SOON.
            </h3>
            <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md">
              THE ATELIER IS CURRENTLY PREPARING THE FIRST ARCHITECTURAL CAPSULE. ARCHIVAL RELEASES IMMINENT.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* ----------------- SECTION 03: BRAND MANIFESTO ----------------- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
              05 / BRAND MANIFESTO
            </div>
            <h2 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight leading-tight">
              ARCHITECTURAL FORM.<br />NOCTURNAL ESSENCE.
            </h2>
            <div className="text-2xl font-serif text-white/40 select-none" aria-hidden="true">
              {brandSymbol}
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6 text-sm text-neutral-300 font-sans leading-relaxed border-l border-white/10 pl-6 sm:pl-10">
            <p>
              QUOTES was born in Cairo from an uncompromising desire for raw tactile truth. We do not manufacture fleeting seasonal trends. We engineer heavyweight apparel with drop-shoulder volumes and monolithic silhouettes, mirrored by an olfactive catalog of dark woods, raw papyrus, and midnight resins.
            </p>
            <p className="text-neutral-400 font-mono text-xs leading-normal">
              Every city possesses an indelible frequency. Our garments and extraits de parfum honor those urban coordinates with mathematical weight and Egyptian material mastery.
            </p>
            <div className="pt-4 flex items-center gap-6">
              <button
                onClick={() => navigate('/about')}
                className="text-xs font-mono tracking-widest uppercase text-white hover:text-neutral-300 underline underline-offset-4"
              >
                READ THE ATELIER ARCHIVE &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
