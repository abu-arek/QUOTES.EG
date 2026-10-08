import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  CreditCard,
  Truck,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

interface AdminOrderDetailProps {
  orderId: string;
}

export const AdminOrderDetail: React.FC<AdminOrderDetailProps> = ({ orderId }) => {
  const { navigate } = useApp();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Status Change State
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusNote, setStatusNote] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Payment Verification State
  const [adminPaymentNote, setAdminPaymentNote] = useState('');
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.getAdminOrderById(orderId);
      setData(res);
      setNewStatus(res.order.orderStatus);
    } catch (err: any) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    try {
      setUpdatingStatus(true);
      await api.updateOrderStatus(orderId, newStatus, statusNote);
      setStatusNote('');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVerifyPayment = async (decision: 'approve' | 'reject') => {
    try {
      setVerifyingPayment(true);
      await api.verifyPayment(orderId, decision, adminPaymentNote);
      setAdminPaymentNote('');
      fetchOrder();
    } catch (err: any) {
      alert(err.message || 'Payment verification failed.');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
        LOADING ORDER RECORD...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center text-white">
        <h2 className="text-xl font-bold uppercase">ORDER NOT FOUND</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="mt-4 px-4 py-2 bg-white text-black text-xs font-mono uppercase"
        >
          RETURN TO ORDERS
        </button>
      </div>
    );
  }

  const { order, items, history, receipt } = data;

  const orderStatuses = [
    'Pending Payment',
    'Payment Review',
    'Payment Approved',
    'Preparing',
    'Shipped',
    'Out for Delivery',
    'Delivered',
    'Cancelled',
  ];

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => navigate('/admin/orders')}
          className="text-neutral-400 hover:text-white flex items-center gap-2 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>ALL ORDERS</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase">REFERENCE:</span>
          <span className="font-bold text-white text-sm tracking-wider">{order.orderNumber}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items Snapshots & Customer Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Order Items Snapshots (CRITICAL REQUIREMENT 12 & 54) */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                PURCHASED PIECES SNAPSHOTS ({items.length})
              </h2>
              <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-2 py-0.5 uppercase">
                SAFE DELETE PROTECTED
              </span>
            </div>

            <p className="text-[11px] text-neutral-400">
              Snapshots preserve immutable product names, historical prices, and SKUs regardless of catalog changes or future deletions.
            </p>

            <div className="divide-y divide-white/5 pt-2">
              {items.map((item: any) => (
                <div key={item.id} className="py-4 first:pt-0 flex gap-4 items-center">
                  <div className="w-14 h-16 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
                    {item.imageSnapshot ? (
                      <img
                        src={item.imageSnapshot}
                        alt={item.productNameSnapshot}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-serif text-white/20">
                        "
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="font-bold text-white text-sm">
                      {item.productNameSnapshot}
                    </div>
                    <div className="text-neutral-400 text-[11px] mt-0.5 space-x-2">
                      {item.sizeSnapshot && <span>Size: {item.sizeSnapshot}</span>}
                      {item.colorSnapshot && <span>Color: {item.colorSnapshot}</span>}
                      {item.volumeSnapshot && <span>Vol: {item.volumeSnapshot}</span>}
                      <span className="text-neutral-500">SKU: {item.skuSnapshot}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-white font-semibold tabular-nums">
                      {item.lineTotal.toLocaleString()} EGP
                    </div>
                    <div className="text-neutral-500 text-[11px]">
                      {item.quantity} &times; {item.priceSnapshot.toLocaleString()} EGP
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal & Total */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-neutral-400">
                <span>SUBTOTAL</span>
                <span className="tabular-nums text-white">{order.subtotal.toLocaleString()} EGP</span>
              </div>
              <div className="flex justify-between text-neutral-400">
                <span>SHIPPING FEE</span>
                <span className="tabular-nums text-white">
                  {order.shippingFee === 0 ? 'FREE' : `${order.shippingFee.toLocaleString()} EGP`}
                </span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/10">
                <span>TOTAL AMOUNT</span>
                <span className="tabular-nums">{order.totalAmount.toLocaleString()} EGP</span>
              </div>
            </div>
          </div>

          {/* Customer Shipping & Contact Information */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              CLIENT &amp; DELIVERY PROFILE
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-neutral-500 uppercase block mb-1">CLIENT NAME</span>
                <span className="text-white font-semibold">{order.customerName}</span>
              </div>
              <div>
                <span className="text-neutral-500 uppercase block mb-1">PHONE NUMBER</span>
                <span className="text-white font-mono">{order.customerPhone}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 uppercase block mb-1">EMAIL ADDRESS</span>
                <span className="text-white font-mono">{order.customerEmail}</span>
              </div>
              <div className="col-span-2">
                <span className="text-neutral-500 uppercase block mb-1">DELIVERY ADDRESS</span>
                <span className="text-white leading-relaxed">
                  {order.shippingAddress}, {order.shippingCity}
                </span>
              </div>
              {order.notes && (
                <div className="col-span-2">
                  <span className="text-neutral-500 uppercase block mb-1">ADDITIONAL CLIENT NOTES</span>
                  <span className="text-neutral-300 italic">{order.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Payment Review & Order Status Management */}
        <div className="lg:col-span-5 space-y-8">
          {/* PAYMENT VERIFICATION MODULE (RULE 27) */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-5">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                INSTAPAY PAYMENT REVIEW
              </h2>
              <span
                className={`text-[10px] px-2 py-0.5 border uppercase ${
                  order.paymentStatus === 'Payment Approved'
                    ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
                    : order.paymentStatus === 'Payment Rejected'
                    ? 'border-red-500/30 text-red-300 bg-red-950/40'
                    : 'border-amber-500/30 text-amber-300 bg-amber-950/40'
                }`}
              >
                {order.paymentStatus}
              </span>
            </div>

            {/* Receipt Preview */}
            {receipt ? (
              <div className="space-y-4">
                <div className="text-[11px] text-neutral-400 flex justify-between">
                  <span>FILENAME: {receipt.originalFilename}</span>
                  <span>{new Date(receipt.uploadedAt).toLocaleDateString()}</span>
                </div>

                <div className="border border-white/10 bg-black p-2 flex items-center justify-center max-h-72 overflow-hidden">
                  <a
                    href={receipt.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group relative"
                  >
                    <img
                      src={receipt.receiptUrl}
                      alt="Payment Receipt"
                      className="max-h-64 object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs">
                      CLICK TO EXPAND RECEIPT
                    </div>
                  </a>
                </div>

                {receipt.adminNote && (
                  <div className="p-3 bg-black/40 border border-white/10 text-[11px]">
                    <span className="text-neutral-400">ADMIN NOTE: </span>
                    <span className="text-neutral-200">{receipt.adminNote}</span>
                  </div>
                )}

                {/* Verification Controls */}
                <div className="space-y-3 pt-2">
                  <input
                    type="text"
                    value={adminPaymentNote}
                    onChange={(e) => setAdminPaymentNote(e.target.value)}
                    placeholder="Optional verification note or rejection reason..."
                    className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-xs"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      disabled={verifyingPayment}
                      onClick={() => handleVerifyPayment('approve')}
                      className="py-2.5 bg-emerald-600 text-white font-bold uppercase hover:bg-emerald-500 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>APPROVE PAYMENT</span>
                    </button>

                    <button
                      type="button"
                      disabled={verifyingPayment}
                      onClick={() => handleVerifyPayment('reject')}
                      className="py-2.5 bg-red-600 text-white font-bold uppercase hover:bg-red-500 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT RECEIPT</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 border border-dashed border-white/15 text-center text-neutral-400 space-y-2">
                <Clock className="w-6 h-6 mx-auto text-neutral-500" />
                <p>No payment receipt uploaded yet by customer.</p>
                <div className="text-[10px] text-neutral-500">
                  Customer has been instructed to transfer {order.totalAmount.toLocaleString()} EGP via InstaPay.
                </div>
              </div>
            )}
          </div>

          {/* FULFILLMENT STATUS CONTROL */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              UPDATE FULFILLMENT STATUS
            </h2>

            <div>
              <label className="block text-neutral-400 uppercase mb-1.5">New Stage Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white uppercase text-xs"
              >
                {orderStatuses.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1.5">Audit Note</label>
              <input
                type="text"
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="e.g. Dispatched with Cairo private courier"
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-xs"
              />
            </div>

            <button
              type="button"
              disabled={updatingStatus}
              onClick={handleUpdateStatus}
              className="w-full py-2.5 bg-white text-black font-semibold uppercase hover:bg-neutral-200 transition-colors"
            >
              {updatingStatus ? 'COMMITTING...' : 'UPDATE ORDER STATUS'}
            </button>
          </div>

          {/* AUDIT LOG TIMELINE */}
          <div className="bg-[#121212] border border-white/10 p-6 space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-3">
              AUDIT TRAIL &bull; STATUS LOG
            </h2>

            <div className="space-y-4">
              {history.map((h: any, i: number) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-white/40 mt-1 shrink-0" />
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className="font-bold text-white uppercase">{h.status}</span>
                      <span className="text-[10px] text-neutral-500">
                        {new Date(h.createdAt).toLocaleDateString()} &bull;{' '}
                        {new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-0.5">{h.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
