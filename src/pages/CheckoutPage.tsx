import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, cartSubtotal, clearCart, navigate, settings } = useApp();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Cairo',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center text-white min-h-[60vh]">
        <div className="text-4xl font-serif text-white/30 mb-4 select-none">"</div>
        <h2 className="text-2xl font-display font-bold uppercase tracking-tight mb-2">
          YOUR BAG IS EMPTY
        </h2>
        <p className="text-xs font-mono text-neutral-400 mb-8 uppercase">
          Add pieces to your bag prior to entering the checkout atelier.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-3 bg-white text-black text-xs font-semibold uppercase tracking-wider"
        >
          EXPLORE THE COLLECTION
        </button>
      </div>
    );
  }

  const freeThreshold = settings?.freeShippingThreshold || 2000;
  const shippingFee = cartSubtotal >= freeThreshold ? 0 : settings?.shippingFee || 85;
  const estimatedTotal = cartSubtotal + shippingFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city) {
      setError('Please provide all required shipping and contact details.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const itemsPayload = cart.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        quantity: i.quantity,
      }));

      const res = await api.createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        shippingAddress: formData.address,
        shippingCity: formData.city,
        notes: formData.notes,
        items: itemsPayload,
      });

      // Clear cart
      clearCart();

      // Navigate to confirmation page
      navigate(`/order-confirmation/${res.order.orderNumber}`);
    } catch (err: any) {
      setError(err.message || 'Failed to complete order. Please review your bag and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white min-h-screen">
      <div className="mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="text-xs font-mono tracking-widest text-neutral-400 hover:text-white flex items-center gap-2 uppercase transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>BACK TO BAG</span>
        </button>
      </div>

      <div className="border-b border-white/10 pb-6 mb-12">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-1">
          ORDER FULFILLMENT
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">
          CHECKOUT
        </h1>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Customer & Shipping Information */}
        <div className="lg:col-span-7 space-y-8">
          {/* Section: Customer Contact */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono tracking-widest uppercase text-neutral-400 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>01. CONTACT DETAILS</span>
              <span className="text-[10px] text-neutral-500">REQUIRED</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Karim El-Sayed"
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Phone Number (Egypt) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +20 100 123 4567"
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Email Address (For Order Tracking &amp; Receipt Confirmation) *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. karim@example.com"
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section: Shipping Address */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono tracking-widest uppercase text-neutral-400 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>02. DOMESTIC SHIPPING DESTINATION</span>
              <span className="text-[10px] text-neutral-500">EGYPT</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Governorate / City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white uppercase"
                >
                  <option value="Cairo">Cairo (Greater Cairo)</option>
                  <option value="Giza">Giza</option>
                  <option value="Alexandria">Alexandria</option>
                  <option value="El Gouna">El Gouna / Hurghada</option>
                  <option value="New Cairo / Tagamoa">New Cairo / Tagamoa</option>
                  <option value="Sheikh Zayed / 6th October">Sheikh Zayed / 6th October</option>
                  <option value="Mansoura">Mansoura</option>
                  <option value="Tanta">Tanta</option>
                  <option value="North Coast">North Coast (Sahel)</option>
                  <option value="Other Egypt Region">Other Governorates</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  District / Zone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zamalek / Maadi / Heliopolis"
                  value={formData.address.split(',')[1] || ''}
                  onChange={(e) => {
                    const street = formData.address.split(',')[0] || '';
                    setFormData({ ...formData, address: `${street}, ${e.target.value}` });
                  }}
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Detailed Street Address, Building, &amp; Apartment *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Street name, building number, floor, apartment number"
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide resize-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-mono text-neutral-400 uppercase mb-1.5">
                  Delivery Notes (Optional)
                </label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Special instructions for the courier, gate codes, etc."
                  className="w-full bg-[#121212] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tracking-wide"
                />
              </div>
            </div>
          </div>

          {/* Section: Payment Method */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono tracking-widest uppercase text-neutral-400 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>03. PAYMENT PROTOCOL</span>
              <span className="text-[10px] text-neutral-500">INSTAPAY EGYPT</span>
            </h2>

            <div className="p-5 border border-white/20 bg-[#121212] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full" />
                  <span className="text-sm font-semibold tracking-wider uppercase font-mono">
                    INSTAPAY TRANSFER
                  </span>
                </div>
                <span className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase border border-white/20 px-2 py-0.5">
                  INSTANT BANK-TO-BANK
                </span>
              </div>
              <p className="text-xs text-neutral-300 font-mono leading-relaxed">
                {settings?.instapayInstructions ||
                  'Transfer exact amount to our official InstaPay handle. You will be prompted to upload your transfer receipt immediately on the next screen for real-time verification.'}
              </p>
              <div className="pt-2 text-xs font-mono text-neutral-400 flex items-center gap-2">
                <span>DESTINATION:</span>
                <span className="text-white font-bold tracking-wider">
                  {settings?.instapayAccount || 'quotes.store@instapay'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#111111] border border-white/10 p-6 sm:p-8 space-y-6">
            <h2 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
              BAG BREAKDOWN ({cart.length} PIECES)
            </h2>

            {/* List of items snapshot */}
            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.variantId} className="flex gap-4 items-center">
                  <div className="w-12 h-16 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>
                  <div className="flex-1 text-xs">
                    <div className="font-semibold text-white line-clamp-1">{item.productName}</div>
                    <div className="text-neutral-400 font-mono text-[11px] mt-0.5">
                      {item.size && `Size: ${item.size} `}
                      {item.volume && `Vol: ${item.volume} `}
                      {item.color && `· ${item.color} `}
                      &times; {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-mono tabular-nums text-white">
                    {(item.price * item.quantity).toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-neutral-400">
                <span>SUBTOTAL</span>
                <span className="tabular-nums text-white">{cartSubtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>SHIPPING FEE</span>
                <span className="tabular-nums text-white">
                  {shippingFee === 0 ? 'COMPLIMENTARY' : `${shippingFee.toLocaleString()} EGP`}
                </span>
              </div>
              <div className="flex justify-between text-base font-semibold text-white pt-4 border-t border-white/10">
                <span>ORDER TOTAL</span>
                <span className="tabular-nums">{estimatedTotal.toLocaleString()} EGP</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={loading || settings?.storeStatus === 'closed'}
              className={`w-full py-4 px-6 text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-colors ${
                loading
                  ? 'bg-neutral-800 text-neutral-500 cursor-wait'
                  : settings?.storeStatus === 'closed'
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-white text-black hover:bg-neutral-200'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'SECURING ORDER...' : 'CONFIRM & PROCEED TO PAYMENT'}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-neutral-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-neutral-400" />
              <span>AUTHENTICATED ATELIER VERIFICATION</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
