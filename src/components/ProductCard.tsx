import React from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigate } = useApp();

  const primaryImage =
    product.images.find((img) => img.isPrimary)?.url ||
    product.images[0]?.url ||
    '';

  const secondaryImage = product.images[1]?.url;
  const isOutOfStock = product.totalStock <= 0;

  return (
    <div
      onClick={() => navigate(`/products/${product.slug}`)}
      className="group cursor-pointer flex flex-col text-left transition-transform duration-200"
    >
      {/* 4:5 Product Image Box */}
      <div className="relative aspect-[4/5] w-full bg-[#141414] overflow-hidden border border-white/5">
        {primaryImage ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                secondaryImage ? 'group-hover:opacity-0' : ''
              }`}
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#151515] text-white/20">
            <span className="text-3xl font-serif select-none" aria-hidden="true">
              "
            </span>
            <span className="text-[10px] font-mono tracking-widest uppercase mt-2">QUOTES</span>
          </div>
        )}

        {/* Stock or City Kicker */}
        {isOutOfStock ? (
          <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase text-red-400 bg-black/80 px-2 py-0.5 border border-red-500/20">
            OUT OF STOCK
          </div>
        ) : product.city ? (
          <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest uppercase text-neutral-300 bg-black/60 px-2 py-0.5 border border-white/10">
            {product.city.name}
          </div>
        ) : null}

        {/* Quick View / View Prompt on Hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-between items-center text-xs font-mono">
          <span className="text-white/80 uppercase tracking-widest text-[11px]">VIEW PIECE</span>
          <span className="text-white">&rarr;</span>
        </div>
      </div>

      {/* Metadata */}
      <div className="mt-3 space-y-1">
        {/* Category & City kicker */}
        <div className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase flex items-center gap-1.5">
          <span>{product.category?.name || product.productType}</span>
          {product.subcategory && (
            <>
              <span aria-hidden="true">/</span>
              <span>{product.subcategory.name}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold tracking-wide text-neutral-100 group-hover:text-white line-clamp-1">
          {product.name}
        </h3>

        {/* Price & Compare */}
        <div className="flex items-center gap-2 pt-0.5">
          <span className="text-xs font-mono font-medium text-white tabular-nums">
            {product.price.toLocaleString()} EGP
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs font-mono text-neutral-500 line-through tabular-nums">
              {product.compareAtPrice.toLocaleString()} EGP
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
