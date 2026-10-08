import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { StoreSettings } from '../types';
import { Check, Settings, Save } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, refreshSettings } = useApp();
  const [formData, setFormData] = useState<StoreSettings>({
    brandName: 'QUOTES',
    brandSymbol: '"',
    contactEmail: 'contact@quotes-brand.com',
    contactPhone: '+20 100 123 4567',
    instapayAccount: 'quotes.store@instapay',
    instapayInstructions: 'Please transfer the exact order amount to our InstaPay handle: quotes.store@instapay. Once sent, upload a screenshot of your payment receipt below for instant order verification.',
    shippingFee: 85,
    freeShippingThreshold: 2000,
    lowStockThreshold: 5,
    storeStatus: 'open',
    storeClosedMessage: 'Our store is currently preparing the next private drop. You can explore the archive, but checkout is temporarily paused.',
    seoTitle: 'QUOTES — Luxury Egyptian Fashion & Fragrance',
    seoDescription: 'Editorial urban fashion and haute parfumerie conceived in Egypt. Architectural cuts and nocturnal scent journeys.',
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.updateSettings(formData);
      await refreshSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            ATELIER STORE SETTINGS
          </h1>
          <p className="text-neutral-400 mt-1">
            Global store policies &bull; InstaPay configuration &bull; Operational status.
          </p>
        </div>

        {success && (
          <div className="text-emerald-400 flex items-center gap-1.5 uppercase font-semibold">
            <Check className="w-4 h-4" />
            <span>CONFIG SAVED</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Brand & Identity */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
            01. BRAND IDENTITY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 uppercase mb-1">Brand Name *</label>
              <input
                type="text"
                required
                value={formData.brandName}
                onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                Official Brand Symbol (Exact one quotation mark: ") *
              </label>
              <input
                type="text"
                required
                maxLength={2}
                value={formData.brandSymbol}
                onChange={(e) => setFormData({ ...formData, brandSymbol: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white font-serif text-lg"
              />
              <span className="text-[10px] text-neutral-500 mt-0.5 block">
                Rule 1: Always ONE standalone double quotation mark. Never replace with curved quotes.
              </span>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Client Contact Email</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Client Contact Telephone / WhatsApp</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Store Operational Status */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
            02. STORE OPERATIONAL STATUS (RULE 43)
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/15 bg-black/40 flex-1">
                <input
                  type="radio"
                  name="store_st"
                  checked={formData.storeStatus === 'open'}
                  onChange={() => setFormData({ ...formData, storeStatus: 'open' })}
                  className="accent-white"
                />
                <div>
                  <div className="font-bold text-emerald-400 uppercase">STORE OPEN</div>
                  <div className="text-[11px] text-neutral-400">
                    Browsing and checkout fully active for customers.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/15 bg-black/40 flex-1">
                <input
                  type="radio"
                  name="store_st"
                  checked={formData.storeStatus === 'closed'}
                  onChange={() => setFormData({ ...formData, storeStatus: 'closed' })}
                  className="accent-white"
                />
                <div>
                  <div className="font-bold text-amber-400 uppercase">STORE CLOSED (ARCHIVE MODE)</div>
                  <div className="text-[11px] text-neutral-400">
                    Customers can browse archive but checkout is disabled with an explanatory banner.
                  </div>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Store Closed Message</label>
              <input
                type="text"
                value={formData.storeClosedMessage}
                onChange={(e) => setFormData({ ...formData, storeClosedMessage: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Section 3: InstaPay Payment Settings */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
            03. INSTAPAY EGYPT CONFIGURATION (RULE 25)
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                InstaPay Destination Account / Handle *
              </label>
              <input
                type="text"
                required
                value={formData.instapayAccount}
                onChange={(e) => setFormData({ ...formData, instapayAccount: e.target.value })}
                placeholder="quotes.store@instapay"
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                InstaPay Transfer Instructions Shown to Client *
              </label>
              <textarea
                rows={3}
                required
                value={formData.instapayInstructions}
                onChange={(e) => setFormData({ ...formData, instapayInstructions: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Shipping & Inventory Thresholds */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
            04. SHIPPING &amp; INVENTORY THRESHOLDS
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                Standard Shipping Fee (EGP)
              </label>
              <input
                type="number"
                min={0}
                value={formData.shippingFee}
                onChange={(e) => setFormData({ ...formData, shippingFee: Number(e.target.value) })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                Free Shipping Threshold (EGP)
              </label>
              <input
                type="number"
                min={0}
                value={formData.freeShippingThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })
                }
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white tabular-nums"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">
                Low Stock Warning Threshold (Units)
              </label>
              <input
                type="number"
                min={1}
                value={formData.lowStockThreshold}
                onChange={(e) =>
                  setFormData({ ...formData, lowStockThreshold: Number(e.target.value) })
                }
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Section 5: SEO Defaults */}
        <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
            05. SEO &amp; OPEN GRAPH METADATA
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-400 uppercase mb-1">SEO Title Tag</label>
              <input
                type="text"
                value={formData.seoTitle}
                onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">SEO Meta Description</label>
              <textarea
                rows={2}
                value={formData.seoDescription}
                onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white resize-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-white text-black font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'UPDATING...' : 'SAVE STORE CONFIGURATION'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
