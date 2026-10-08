import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, ProductVariant } from '../types';
import { ArrowLeft, Check, AlertCircle } from 'lucide-react';

interface ProductDetailPageProps {
  slug: string;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ slug }) => {
  const { addToCart, navigate, settings } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant Selection State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const brandSymbol = settings?.brandSymbol || '"';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          // Select first in-stock variant or first variant
          const firstInStock = data.variants.find((v) => v.stockQuantity > 0) || data.variants[0];
          setSelectedVariant(firstInStock);
        }
      } catch (err: any) {
        setError(err.message || 'Product could not be loaded.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
        RETRIEVING ATELIER ARCHIVE...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="text-4xl font-serif text-white/30 mb-4 select-none">"</div>
        <h2 className="text-2xl font-display font-bold uppercase tracking-tight text-white mb-2">
          PIECE NOT FOUND
        </h2>
        <p className="text-xs font-mono text-neutral-400 mb-8 uppercase">
          {error || 'This product does not exist or has been archived.'}
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200"
        >
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : [{ id: 'default', productId: product.id, url: '', alt: product.name, displayOrder: 1, isPrimary: true }];
  const currentImage = images[selectedImageIndex] || images[0];

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock = selectedVariant ? selectedVariant.stockQuantity : product.totalStock;
  const isOutOfStock = currentStock <= 0;
  const lowStockThreshold = settings?.lowStockThreshold || 5;
  const isLowStock = !isOutOfStock && currentStock <= lowStockThreshold;

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addToCart({
      productId: product.id,
      variantId: selectedVariant.id,
      productName: product.name,
      variantName: selectedVariant.name,
      size: selectedVariant.size,
      color: selectedVariant.color,
      volume: selectedVariant.volume,
      price: currentPrice,
      image: currentImage.url || '',
      quantity,
      maxStock: currentStock,
      sku: selectedVariant.sku,
    });

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white min-h-screen">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => window.history.back()}
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* LEFT COLUMN: Large Product Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Large Image (4:5 Aspect Ratio) */}
          <div className="relative aspect-[4/5] w-full bg-[#141414] border border-white/10 overflow-hidden">
            {currentImage.url ? (
              <img
                src={currentImage.url}
                alt={currentImage.alt || product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/20">
                <span className="text-6xl font-serif select-none" aria-hidden="true">
                  {brandSymbol}
                </span>
                <span className="text-xs font-mono tracking-widest uppercase mt-4">QUOTES ATELIER</span>
              </div>
            )}

            {/* City watermark badge */}
            {product.city && (
              <div className="absolute top-4 left-4 text-xs font-mono tracking-widest uppercase text-white/90 bg-black/60 backdrop-blur-sm px-3 py-1 border border-white/10">
                {product.city.name} COLLECTION
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-24 shrink-0 bg-[#141414] border transition-all overflow-hidden ${
                    selectedImageIndex === idx ? 'border-white opacity-100' : 'border-white/10 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.alt}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Contiguous Purchase Module */}
        <div className="lg:col-span-5 flex flex-col justify-start lg:sticky lg:top-24 h-fit space-y-8">
          {/* Taxonomy & City */}
          <div className="space-y-2 border-b border-white/10 pb-6">
            <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase flex items-center gap-2">
              <span>{product.category?.name || product.productType}</span>
              {product.subcategory && (
                <>
                  <span aria-hidden="true">/</span>
                  <span>{product.subcategory.name}</span>
                </>
              )}
              {product.city && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-white font-medium">{product.city.name}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-display font-bold uppercase tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price Row */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl font-mono font-semibold tabular-nums">
                {currentPrice.toLocaleString()} EGP
              </span>
              {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                <span className="text-sm font-mono text-neutral-500 line-through tabular-nums">
                  {product.compareAtPrice.toLocaleString()} EGP
                </span>
              )}
            </div>

            <div className="text-[11px] font-mono text-neutral-500 pt-1">
              SKU: <span className="text-neutral-300">{selectedVariant?.sku || product.sku}</span>
            </div>
          </div>

          {/* Description */}
          <div className="text-sm font-sans text-neutral-300 leading-relaxed">
            {product.description}
          </div>

          {/* VARIANTS SELECTION */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center text-xs font-mono tracking-wider">
                <span className="uppercase text-neutral-400">
                  {product.productType === 'clothing' ? 'SELECT VARIANT / SIZE' : 'SELECT VOLUME'}
                </span>
                {/* Stock feedback */}
                {isOutOfStock ? (
                  <span className="text-red-400 uppercase">OUT OF STOCK</span>
                ) : isLowStock ? (
                  <span className="text-amber-400 uppercase">ONLY {currentStock} REMAINING</span>
                ) : (
                  <span className="text-emerald-400 uppercase">IN STOCK</span>
                )}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isVariantOut = v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setQuantity(1);
                      }}
                      className={`p-3 border text-xs font-mono uppercase text-center transition-all relative ${
                        isSelected
                          ? 'border-white bg-white text-black font-semibold'
                          : isVariantOut
                          ? 'border-white/5 text-neutral-600 bg-neutral-900/50 cursor-pointer'
                          : 'border-white/20 text-neutral-300 hover:border-white/50'
                      }`}
                    >
                      <div>{v.size || v.volume || v.name}</div>
                      {v.color && <div className="text-[10px] opacity-75 mt-0.5">{v.color}</div>}
                      {isVariantOut && (
                        <div className="text-[9px] text-red-500 font-sans mt-0.5">Sold Out</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* QUANTITY & ADD TO BAG */}
          <div className="space-y-4 pt-4 border-t border-white/10">
            <div className="flex gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-white/20 text-xs font-mono h-12">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 h-full text-neutral-400 hover:text-white"
                  disabled={quantity <= 1 || isOutOfStock}
                >
                  -
                </button>
                <span className="px-3 tabular-nums font-semibold min-w-[32px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  className="px-4 h-full text-neutral-400 hover:text-white"
                  disabled={quantity >= currentStock || isOutOfStock}
                >
                  +
                </button>
              </div>

              {/* Add To Cart CTA */}
              <button
                type="button"
                disabled={isOutOfStock || settings?.storeStatus === 'closed'}
                onClick={handleAddToCart}
                className={`flex-1 h-12 px-6 text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2 ${
                  settings?.storeStatus === 'closed'
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : isOutOfStock
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : addedSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-black hover:bg-neutral-200'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : isOutOfStock ? (
                  <span>OUT OF STOCK</span>
                ) : settings?.storeStatus === 'closed' ? (
                  <span>CHECKOUT PAUSED</span>
                ) : (
                  <span>ADD TO BAG &bull; {(currentPrice * quantity).toLocaleString()} EGP</span>
                )}
              </button>
            </div>

            {/* Instapay / Shipping Notice */}
            <div className="text-[11px] font-mono text-neutral-500 space-y-1 pt-2">
              <div>&bull; Authentic Egyptian atelier craftsmanship &bull; Limited archival batches</div>
              <div>&bull; Domestic shipping across Egypt with secure InstaPay payment verification</div>
            </div>
          </div>

          {/* ATTRIBUTES ACCORDION / SPECIFICATIONS */}
          {product.attributes && product.attributes.length > 0 && (
            <div className="border-t border-white/10 pt-6 space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                MATERIAL &amp; ATELIER SPECIFICATIONS
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs font-mono">
                {product.attributes.map((attr) => (
                  <div key={attr.id || attr.key} className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-neutral-500 uppercase">{attr.key.replace(/_/g, ' ')}</span>
                    <span className="text-neutral-200 text-right">{attr.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
