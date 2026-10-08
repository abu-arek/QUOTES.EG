import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Search, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const TrackOrderPage: React.FC = () => {
  const { navigate, settings } = useApp();
  const [orderQuery, setOrderQuery] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('order') || '';
  });
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brandSymbol = settings?.brandSymbol || '"';

  const stages = [
    'Pending Payment',
    'Payment Review',
    'Payment Approved',
    'Preparing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!orderQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.trackOrder(orderQuery.trim());
      setOrderData(data);
    } catch (err: any) {
      setError(err.message || 'Order could not be found. Please check your order identifier.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderQuery.trim()) {
      handleSearch();
    }
  }, []);

  // Compute active stage index
  const currentStatus = orderData?.orderStatus || '';
  const currentStageIndex = stages.indexOf(currentStatus);
  const isCancelled = currentStatus === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white min-h-screen">
      <div className="border-b border-white/10 pb-8 mb-10">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
          CLIENT SERVICES
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">
          TRACK ORDER
        </h1>
        <p className="mt-2 text-xs sm:text-sm font-mono text-neutral-400">
          Enter your unique QUOTES order reference to view fulfillment status and payment verification history.
        </p>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="mb-12">
        <div className="flex gap-3">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
            placeholder="e.g. QUOTES-XXXXXX"
            className="flex-1 bg-[#121212] border border-white/20 px-5 py-3.5 text-sm text-white font-mono uppercase focus:outline-none focus:border-white tracking-widest"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black text-xs font-semibold uppercase tracking-widest px-8 py-3.5 hover:bg-neutral-200 transition-colors shrink-0"
          >
            {loading ? 'LOCATING...' : 'TRACK'}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono mb-8">
          {error}
        </div>
      )}

      {orderData && (
        <div className="space-y-10 animate-in fade-in duration-300">
          {/* Status Header */}
          <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
              <div>
                <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                  ORDER REFERENCE
                </div>
                <div className="text-2xl font-mono font-bold text-white mt-1">
                  {orderData.orderNumber}
                </div>
              </div>

              <div className="flex flex-col sm:items-end">
                <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
                  CURRENT STATUS
                </div>
                <div className="text-sm font-mono font-semibold uppercase px-3 py-1 bg-white/10 border border-white/20 text-white mt-1">
                  {orderData.orderStatus}
                </div>
              </div>
            </div>

            {/* Visual Timeline (Progress Stepper) */}
            {!isCancelled ? (
              <div className="pt-4">
                <div className="text-xs font-mono tracking-widest text-neutral-400 uppercase mb-6">
                  FULFILLMENT PROGRESSION
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {stages.map((st, idx) => {
                    const isPassed = currentStageIndex >= idx;
                    const isCurrent = currentStageIndex === idx;

                    return (
                      <div
                        key={st}
                        className={`p-3 border text-center font-mono text-[10px] uppercase transition-colors ${
                          isCurrent
                            ? 'border-white bg-white text-black font-bold'
                            : isPassed
                            ? 'border-white/40 bg-neutral-900 text-neutral-200'
                            : 'border-white/10 text-neutral-600 bg-black/40'
                        }`}
                      >
                        <div className="text-[9px] opacity-70 mb-1">0{idx + 1}</div>
                        <div className="truncate">{st}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-mono">
                THIS ORDER HAS BEEN CANCELLED.
              </div>
            )}

            {/* Payment & Receipt Status Notice */}
            <div className="p-4 bg-black/60 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-mono">
              <div>
                <span className="text-neutral-400 mr-2">PAYMENT VERIFICATION:</span>
                <span
                  className={
                    orderData.paymentStatus === 'Payment Approved'
                      ? 'text-emerald-400 font-semibold'
                      : orderData.paymentStatus === 'Payment Rejected'
                      ? 'text-red-400 font-semibold'
                      : 'text-amber-400 font-semibold'
                  }
                >
                  {orderData.paymentStatus}
                </span>
                {orderData.adminNote && (
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Note: {orderData.adminNote}
                  </div>
                )}
              </div>

              {/* Upload receipt link if pending or rejected */}
              {!orderData.hasReceiptUploaded || orderData.paymentStatus === 'Payment Rejected' ? (
                <button
                  onClick={() => navigate(`/order-confirmation/${orderData.orderNumber}`)}
                  className="px-3 py-1.5 bg-white text-black font-semibold uppercase text-[11px] hover:bg-neutral-200 transition-colors"
                >
                  UPLOAD RECEIPT NOW
                </button>
              ) : null}
            </div>
          </div>

          {/* Items In Order (Safe snapshot) */}
          <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
            <h3 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
              PIECES IN THIS ORDER ({orderData.itemsCount})
            </h3>

            <div className="divide-y divide-white/5">
              {orderData.items.map((item: any, i: number) => (
                <div key={i} className="py-4 first:pt-0 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.productName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-serif text-white/20">
                          "
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{item.productName}</div>
                      <div className="text-neutral-400 text-[11px] mt-0.5">
                        {item.size && `Size: ${item.size} `}
                        {item.volume && `Vol: ${item.volume} `}
                        {item.color && `· ${item.color} `}
                        &bull; Qty: {item.quantity}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-white font-semibold tabular-nums">
                    {(item.price * item.quantity).toLocaleString()} EGP
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline History Log */}
          {orderData.history && orderData.history.length > 0 && (
            <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-mono tracking-widest uppercase text-white pb-3 border-b border-white/10">
                AUDIT HISTORY LOG
              </h3>

              <div className="space-y-4 font-mono text-xs">
                {orderData.history.map((h: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-white/40 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-semibold text-white uppercase">{h.status}</span>
                        <span className="text-[11px] text-neutral-500">
                          {new Date(h.createdAt).toLocaleDateString()} &bull;{' '}
                          {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-neutral-400 text-xs mt-0.5">{h.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
