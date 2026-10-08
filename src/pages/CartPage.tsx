import React from 'react';
import { useApp } from '../context/AppContext';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    updateCartQuantity,
    removeFromCart,
    navigate,
    settings,
  } = useApp();

  const freeThreshold = settings?.freeShippingThreshold || 2000;
  const shippingFee = cartSubtotal >= freeThreshold ? 0 : settings?.shippingFee || 85;
  const total = cartSubtotal + shippingFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white min-h-screen">
      <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
        <div>
          <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-1">
            BAG INVENTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">
            YOUR BAG ({cart.length})
          </h1>
        </div>
        <button
          onClick={() => navigate('/shop')}
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-white uppercase flex items-center gap-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>CONTINUE SHOPPING</span>
        </button>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
          <span className="text-4xl font-serif text-white/30 mb-4 select-none">"</span>
          <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
            YOUR BAG IS CURRENTLY EMPTY
          </h2>
          <p className="text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md mb-8">
            SELECT ARCHITECTURAL PIECES OR ESSENCES FROM OUR RECENT DROPS TO COMMENCE YOUR ORDER.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            DISCOVER THE COLLECTION
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-6">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {cart.map((item) => (
                <div key={item.variantId} className="py-6 flex gap-6 items-start">
                  {/* Thumbnail */}
                  <div className="w-24 h-32 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-white/20 text-2xl">
                        "
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between h-32">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-base font-semibold text-white tracking-wide">
                          {item.productName}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-neutral-500 hover:text-white transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-xs font-mono text-neutral-400 mt-1 flex flex-wrap gap-2">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>&bull; Color: {item.color}</span>}
                        {item.volume && <span>&bull; Volume: {item.volume}</span>}
                        <span className="text-neutral-500">&bull; SKU: {item.sku}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      {/* Stepper */}
                      <div className="flex items-center border border-white/20 text-xs font-mono h-9">
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                          className="px-3 h-full text-neutral-400 hover:text-white"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 tabular-nums font-semibold min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                          className="px-3 h-full text-neutral-400 hover:text-white"
                          disabled={item.quantity >= item.maxStock}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-base font-mono font-semibold tabular-nums text-white">
                        {(item.price * item.quantity).toLocaleString()} EGP
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Column */}
          <div className="lg:col-span-4 bg-[#111111] border border-white/10 p-6 sm:p-8 h-fit space-y-6">
            <h2 className="text-sm font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
              ORDER SUMMARY
            </h2>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>SUBTOTAL</span>
                <span className="tabular-nums text-white">{cartSubtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>ESTIMATED SHIPPING</span>
                <span className="tabular-nums text-white">
                  {shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} EGP`}
                </span>
              </div>
              {cartSubtotal < freeThreshold && (
                <div className="text-[11px] text-neutral-500 pt-1">
                  Add {(freeThreshold - cartSubtotal).toLocaleString()} EGP more for complimentary shipping.
                </div>
              )}
              <div className="flex justify-between text-base font-semibold text-white pt-4 border-t border-white/10">
                <span>TOTAL</span>
                <span className="tabular-nums">{total.toLocaleString()} EGP</span>
              </div>
            </div>

            <button
              disabled={settings?.storeStatus === 'closed'}
              onClick={() => navigate('/checkout')}
              className={`w-full py-4 px-6 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${
                settings?.storeStatus === 'closed'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <span>{settings?.storeStatus === 'closed' ? 'CHECKOUT PAUSED' : 'PROCEED TO CHECKOUT'}</span>
              {settings?.storeStatus !== 'closed' && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="text-[11px] font-mono text-neutral-500 space-y-1">
              <div>&bull; Payment verified via InstaPay transfer</div>
              <div>&bull; Receipt upload required upon order completion</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
