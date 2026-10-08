import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { City } from '../types';
import { ArrowUpRight } from 'lucide-react';

export const CitiesPage: React.FC = () => {
  const { navigate, settings } = useApp();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  const brandSymbol = settings?.brandSymbol || '"';

  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        const data = await api.getCities(false);
        setCities(data);
      } catch (err) {
        console.error('Failed to load cities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCities();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white min-h-screen">
      <div className="border-b border-white/10 pb-8 mb-12">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
          URBAN GEOGRAPHY
        </div>
        <h1 className="text-3xl sm:text-6xl font-display font-bold uppercase tracking-tight">
          CITIES
        </h1>
        <p className="mt-4 text-xs sm:text-sm font-mono text-neutral-400 max-w-2xl leading-relaxed">
          Every city in the QUOTES canon anchors an architectural perspective and an olfactory memory. Browse each territory's dedicated apparel capsules and perfumes.
        </p>
      </div>

      {loading ? (
        <div className="py-24 text-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
          MAPPING URBAN GEOGRAPHY...
        </div>
      ) : cities.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
          <span className="text-4xl font-serif text-white/30 mb-4 select-none" aria-hidden="true">
            {brandSymbol}
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold tracking-widest uppercase">
            CITIES COMING SOON.
          </h3>
          <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md">
            NEW METROPOLITAN CHAPTERS ARE CURRENTLY UNDER ARCHITECTURAL STUDY.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {cities.map((city, idx) => {
            const isFeatured = city.featured;
            const spanClass = isFeatured
              ? 'md:col-span-8 aspect-[16/10]'
              : idx % 3 === 0
              ? 'md:col-span-6 aspect-[4/3]'
              : 'md:col-span-4 aspect-[3/4]';

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
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#151515]">
                    <span className="text-4xl font-serif text-white/20 select-none">"</span>
                    <span className="text-sm font-mono tracking-widest uppercase mt-4 text-neutral-300">
                      {city.name}
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-8 flex items-end justify-between">
                  <div className="space-y-1">
                    <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-2">
                      <span>{city.country}</span>
                      <span aria-hidden="true">&bull;</span>
                      <span className="text-white/80">CLOTHING &amp; PERFUMES</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-display font-bold uppercase tracking-tight text-white group-hover:translate-x-1 transition-transform">
                      {city.name}
                    </h2>
                    {city.description && (
                      <p className="text-xs text-neutral-300 font-mono line-clamp-2 max-w-lg pt-1">
                        {city.description}
                      </p>
                    )}
                  </div>

                  <div className="w-10 h-10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-colors shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
