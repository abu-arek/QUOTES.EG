import React from 'react';
import { useApp } from '../context/AppContext';

export const AboutPage: React.FC = () => {
  const { navigate, settings } = useApp();
  const brandSymbol = settings?.brandSymbol || '"';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white min-h-screen">
      <div className="border-b border-white/10 pb-8 mb-12">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
          MANIFESTO
        </div>
        <h1 className="text-3xl sm:text-6xl font-display font-extrabold uppercase tracking-tight">
          ABOUT QUOTES
        </h1>
        <div className="text-4xl font-serif text-white/30 my-4 select-none" aria-hidden="true">
          {brandSymbol}
        </div>
      </div>

      <div className="space-y-12 text-sm font-sans text-neutral-300 leading-relaxed">
        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
            01. THE SYMBOL
          </h2>
          <p>
            The official brand symbol of QUOTES is <strong className="text-white font-serif text-lg">{brandSymbol}</strong> — one standalone double quotation mark. It signifies the start and punctuation of an unedited thought: raw, architectural, and deliberate. We reject imitation and superficial logos.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
            02. EGYPTIAN MATERIALITY
          </h2>
          <p>
            Egypt's history of luxury textile weaving and resin extraction is unequalled. In our Cairo ateliers, we harness 480–500 GSM dense combed Egyptian cotton, untreated selvedge textiles, and nocturnal botanical extracts. Each garment is drafted with architectural drop-shoulders and boxy silhouettes designed to command space.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-display font-bold uppercase tracking-tight text-white">
            03. NOCTURNAL PERFUMERY
          </h2>
          <p>
            Our haute parfumerie collection is formulated in small extraits batches with over 28% oil concentration. Compositions marry smoky atlas cedarwood and raw papyrus with midnight jasmine and dark amber, housed in heavy monolithic flacons that celebrate minimalist weight.
          </p>
        </section>

        <div className="pt-8 border-t border-white/10 flex gap-4">
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3.5 bg-white text-black font-semibold text-xs font-mono tracking-widest uppercase hover:bg-neutral-200 transition-colors"
          >
            EXPLORE THE ATELIER
          </button>
          <button
            onClick={() => navigate('/cities')}
            className="px-6 py-3.5 border border-white/20 text-white font-semibold text-xs font-mono tracking-widest uppercase hover:bg-white hover:text-black transition-colors"
          >
            DISCOVER CITIES
          </button>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { settings } = useApp();
  const brandSymbol = settings?.brandSymbol || '"';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-white min-h-screen">
      <div className="border-b border-white/10 pb-8 mb-12">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
          CLIENT LIAISON
        </div>
        <h1 className="text-3xl sm:text-6xl font-display font-extrabold uppercase tracking-tight">
          CONTACT
        </h1>
        <div className="text-4xl font-serif text-white/30 my-4 select-none" aria-hidden="true">
          {brandSymbol}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-xs font-mono">
        <div className="space-y-6">
          <div>
            <div className="text-neutral-500 uppercase mb-1">ATELIER HEADQUARTERS</div>
            <div className="text-sm font-semibold text-white">QUOTES BRAND ATELIER</div>
            <div className="text-neutral-400 mt-1">Cairo, Egypt</div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase mb-1">OFFICIAL EMAIL</div>
            <div className="text-sm text-white">
              {settings?.contactEmail || 'contact@quotes-brand.com'}
            </div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase mb-1">CLIENT ASSISTANCE &amp; INSTAPAY</div>
            <div className="text-sm text-white">
              {settings?.contactPhone || '+20 100 123 4567'}
            </div>
          </div>

          <div>
            <div className="text-neutral-500 uppercase mb-1">VERIFIED INSTAPAY HANDLE</div>
            <div className="text-sm text-white font-bold">
              {settings?.instapayAccount || 'quotes.store@instapay'}
            </div>
          </div>
        </div>

        <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
          <h3 className="text-sm font-display font-bold uppercase tracking-wider text-white">
            CLIENT INQUIRY
          </h3>
          <p className="text-neutral-400 text-xs font-sans leading-relaxed">
            For bespoke private sizing, fragrance consultation, or urgent courier status inquiries, please contact our atelier directly via email or our WhatsApp concierge.
          </p>
          <div className="pt-2 text-neutral-500 text-[11px]">
            HOURS OF OPERATION: SUNDAY &ndash; THURSDAY, 10:00 &ndash; 19:00 CLT
          </div>
        </div>
      </div>
    </div>
  );
};
