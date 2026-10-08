import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Order, OrderStatus } from '../types';
import { ShoppingBag, Search, ExternalLink, Eye, Filter } from 'lucide-react';

export const AdminOrders: React.FC = () => {
  const { navigate } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await api.getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.orderStatus !== statusFilter) return false;
    if (paymentFilter !== 'all' && o.paymentStatus !== paymentFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerEmail.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            CLIENT ORDERS DIRECTORY
          </h1>
          <p className="text-neutral-400 mt-1">
            Real orders &bull; Immutable product snapshots &bull; InstaPay receipts review.
          </p>
        </div>

        <div className="text-neutral-400">
          TOTAL RECORDED: <span className="text-white font-bold tabular-nums">{orders.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] border border-white/10 p-4">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order number, client name, phone..."
            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Order Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#181818] border border-white/10 px-3 py-1.5 text-white focus:outline-none uppercase"
          >
            <option value="all">ALL ORDER STATUSES</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Payment Review">Payment Review</option>
            <option value="Payment Approved">Payment Approved</option>
            <option value="Preparing">Preparing</option>
            <option value="Shipped">Shipped</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Payment Status */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-[#181818] border border-white/10 px-3 py-1.5 text-white focus:outline-none uppercase"
          >
            <option value="all">ALL PAYMENTS</option>
            <option value="Pending Payment">Pending Payment</option>
            <option value="Payment Review">Payment Review (Needs Action)</option>
            <option value="Payment Approved">Payment Approved</option>
            <option value="Payment Rejected">Payment Rejected</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          FETCHING TRANSACTION LEDGER...
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8 flex flex-col items-center">
          <span className="text-3xl font-serif text-white/30 mb-4 select-none">"</span>
          <h3 className="text-lg font-bold tracking-widest uppercase">
            NO ORDERS FOUND
          </h3>
          <p className="mt-2 text-neutral-500 uppercase">
            {orders.length === 0
              ? 'No customer orders have been placed yet.'
              : 'No orders match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#121212] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-neutral-500 uppercase">
              <tr>
                <th className="py-3 px-4">ORDER REF</th>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">LOCATION</th>
                <th className="py-3 px-4">DATE</th>
                <th className="py-3 px-4">TOTAL</th>
                <th className="py-3 px-4">RECEIPT</th>
                <th className="py-3 px-4">PAYMENT</th>
                <th className="py-3 px-4">FULFILLMENT</th>
                <th className="py-3 px-4 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white tracking-wider">
                    {o.orderNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-white font-medium">{o.customerName}</div>
                    <div className="text-[10px] text-neutral-500">{o.customerPhone}</div>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">{o.shippingCity}</td>
                  <td className="py-3.5 px-4 text-neutral-400">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-white font-semibold">
                    {o.totalAmount.toLocaleString()} EGP
                  </td>
                  <td className="py-3.5 px-4">
                    {o.receipt ? (
                      <span className="text-[10px] text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 uppercase">
                        RECEIPT ATTACHED
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-500 uppercase">
                        AWAITING
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[11px] font-semibold ${
                        o.paymentStatus === 'Payment Approved'
                          ? 'text-emerald-400'
                          : o.paymentStatus === 'Payment Rejected'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-neutral-300">{o.orderStatus}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => navigate(`/admin/orders/${o.id}`)}
                      className="px-3 py-1 border border-white/20 hover:border-white text-white uppercase text-[11px] transition-colors"
                    >
                      INSPECT &bull; EDIT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
