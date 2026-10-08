import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartCount,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    navigate,
    settings,
  } = useApp();

  if (!isCartDrawerOpen) return null;

  const freeThreshold = settings?.freeShippingThreshold || 2000;
  const shippingFee = cartSubtotal >= freeThreshold ? 0 : settings?.shippingFee || 85;
  const progressToFree = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#111111] border-l border-white/10 flex flex-col shadow-2xl text-white">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-5 h-5 text-neutral-400" />
              <h2 className="text-sm font-mono tracking-widest uppercase">
                SHOPPING BAG ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="text-neutral-400 hover:text-white p-1"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Banner */}
          <div className="bg-[#181818] px-6 py-3 border-b border-white/5">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span>
                {cartSubtotal >= freeThreshold
                  ? 'FREE EXPRESS SHIPPING UNLOCKED'
                  : `ADD ${(freeThreshold - cartSubtotal).toLocaleString()} EGP FOR FREE SHIPPING`}
              </span>
              <span className="tabular-nums text-neutral-400">{progressToFree}%</span>
            </div>
            <div className="w-full bg-white/10 h-1 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${progressToFree}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-white/5">
            {cart.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center">
                <div className="text-3xl font-serif text-white/20 mb-4 select-none">"</div>
                <p className="text-sm font-mono tracking-widest text-neutral-400 mb-6 uppercase">
                  YOUR BAG IS EMPTY
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/shop');
                  }}
                  className="bg-white text-black text-xs font-semibold uppercase tracking-wider py-3 px-6 hover:bg-neutral-200 transition-colors"
                >
                  EXPLORE THE COLLECTION
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.variantId} className="pt-6 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-neutral-900 border border-white/5 shrink-0 overflow-hidden relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-white/30 text-xl">
                        "
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-semibold tracking-wide text-white line-clamp-1">
                          {item.productName}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.variantId)}
                          className="text-neutral-500 hover:text-white p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Variant metadata */}
                      <div className="text-xs text-neutral-400 font-mono mt-1 space-x-2">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>· Color: {item.color}</span>}
                        {item.volume && <span>Vol: {item.volume}</span>}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/20 text-xs font-mono">
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-2 py-1 tabular-nums min-w-[24px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-1 text-neutral-400 hover:text-white"
                          disabled={item.quantity >= item.maxStock}
                        >
                          +
                        </button>
                      </div>

                      <div className="text-sm font-mono font-medium tabular-nums">
                        {(item.price * item.quantity).toLocaleString()} EGP
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0B0B0B] space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-neutral-400">
                  <span>SUBTOTAL</span>
                  <span className="tabular-nums">{cartSubtotal.toLocaleString()} EGP</span>
                </div>
                <div className="flex justify-between text-neutral-400">
                  <span>SHIPPING</span>
                  <span className="tabular-nums">
                    {shippingFee === 0 ? 'FREE' : `${shippingFee.toLocaleString()} EGP`}
                  </span>
                </div>
                <div className="flex justify-between text-white font-semibold text-sm pt-2 border-t border-white/10">
                  <span>TOTAL ESTIMATE</span>
                  <span className="tabular-nums">
                    {(cartSubtotal + shippingFee).toLocaleString()} EGP
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  disabled={settings?.storeStatus === 'closed'}
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/checkout');
                  }}
                  className={`w-full py-3.5 px-4 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${
                    settings?.storeStatus === 'closed'
                      ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  <span>{settings?.storeStatus === 'closed' ? 'CHECKOUT PAUSED' : 'PROCEED TO CHECKOUT'}</span>
                  {settings?.storeStatus !== 'closed' && <ArrowRight className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-2.5 text-center text-xs font-mono tracking-wider text-neutral-400 hover:text-white transition-colors"
                >
                  VIEW FULL BAG
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
