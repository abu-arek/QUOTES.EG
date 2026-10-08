import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Order } from '../types';
import { CheckCircle, XCircle, CreditCard, ExternalLink, Clock } from 'lucide-react';

export const AdminPayments: React.FC = () => {
  const { navigate } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders for payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleVerify = async (orderId: string, decision: 'approve' | 'reject') => {
    try {
      setActionLoading(true);
      await api.verifyPayment(orderId, decision, adminNote);
      setAdminNote('');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err: any) {
      alert(err.message || 'Payment verification failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    if (filter === 'pending') {
      return o.paymentStatus === 'Payment Review' || (o.paymentStatus === 'Pending Payment' && o.receipt);
    }
    if (filter === 'approved') return o.paymentStatus === 'Payment Approved';
    if (filter === 'rejected') return o.paymentStatus === 'Payment Rejected';
    return true;
  });

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            INSTAPAY PAYMENT VERIFICATION DESK
          </h1>
          <p className="text-neutral-400 mt-1">
            Review customer transfer screenshots &bull; Approve funds or request re-upload.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 border uppercase transition-colors ${
              filter === 'pending'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            AWAITING REVIEW (
            {
              orders.filter(
                (o) =>
                  o.paymentStatus === 'Payment Review' ||
                  (o.paymentStatus === 'Pending Payment' && o.receipt)
              ).length
            }
            )
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 border uppercase transition-colors ${
              filter === 'approved'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            APPROVED
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-3 py-1.5 border uppercase transition-colors ${
              filter === 'rejected'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            REJECTED
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 border uppercase transition-colors ${
              filter === 'all'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:text-white'
            }`}
          >
            ALL
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          SYNCING RECEIPT ARCHIVE...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8 flex flex-col items-center">
          <Clock className="w-8 h-8 text-neutral-500 mb-3" />
          <h3 className="text-base font-bold uppercase tracking-wider">
            NO RECEIPTS CURRENTLY IN THIS QUEUE
          </h3>
          <p className="mt-1 text-neutral-500 uppercase">
            All customer transfer submissions are up to date.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((o) => (
            <div
              key={o.id}
              className="bg-[#121212] border border-white/10 p-5 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start border-b border-white/10 pb-3">
                  <div>
                    <span className="text-white font-bold text-sm tracking-wider">
                      {o.orderNumber}
                    </span>
                    <div className="text-[10px] text-neutral-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 border uppercase font-semibold ${
                      o.paymentStatus === 'Payment Approved'
                        ? 'border-emerald-500/30 text-emerald-300 bg-emerald-950/40'
                        : o.paymentStatus === 'Payment Rejected'
                        ? 'border-red-500/30 text-red-300 bg-red-950/40'
                        : 'border-amber-500/30 text-amber-300 bg-amber-950/40'
                    }`}
                  >
                    {o.paymentStatus}
                  </span>
                </div>

                <div className="py-3 space-y-1">
                  <div className="text-neutral-300 font-medium">{o.customerName}</div>
                  <div className="text-neutral-500 text-[11px]">{o.customerPhone}</div>
                  <div className="text-white font-bold tabular-nums text-sm pt-1">
                    {o.totalAmount.toLocaleString()} EGP
                  </div>
                </div>

                {/* Receipt Image Thumbnail */}
                {o.receipt ? (
                  <div className="my-2 border border-white/10 bg-black p-1 text-center">
                    <a
                      href={o.receipt.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group relative"
                    >
                      <img
                        src={o.receipt.receiptUrl}
                        alt="Receipt preview"
                        className="h-44 w-full object-contain mx-auto"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px]">
                        OPEN FULL RECEIPT
                      </div>
                    </a>
                  </div>
                ) : (
                  <div className="p-6 bg-black/30 border border-dashed border-white/10 text-center text-neutral-500 text-[11px]">
                    No receipt uploaded yet by customer.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-white/10 space-y-2">
                {o.paymentStatus !== 'Payment Approved' && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleVerify(o.id, 'approve')}
                      className="py-2 bg-emerald-600 text-white font-bold uppercase hover:bg-emerald-500 flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>APPROVE</span>
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        const note = window.prompt('Enter rejection note for client:');
                        if (note !== null) {
                          api.verifyPayment(o.id, 'reject', note).then(() => fetchOrders());
                        }
                      }}
                      className="py-2 bg-red-600 text-white font-bold uppercase hover:bg-red-500 flex items-center justify-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>REJECT</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate(`/admin/orders/${o.id}`)}
                  className="w-full py-1.5 border border-white/15 text-neutral-300 hover:text-white uppercase text-[11px] text-center"
                >
                  FULL ORDER DETAILS &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
