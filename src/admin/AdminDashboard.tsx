import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { DashboardStats } from '../types';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  Package,
  FolderTree,
  MapPin,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { navigate } = useApp();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="py-24 text-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
        COMPUTING ATELIER TELEMETRY...
      </div>
    );
  }

  const metricCards = [
    {
      label: 'TOTAL VERIFIED REVENUE',
      value: `${stats.totalRevenue.toLocaleString()} EGP`,
      desc: 'Approved InstaPay transfers',
      icon: DollarSign,
      action: () => navigate('/admin/orders'),
    },
    {
      label: 'TOTAL ORDERS',
      value: stats.totalOrders.toString(),
      desc: 'All customer order records',
      icon: ShoppingBag,
      action: () => navigate('/admin/orders'),
    },
    {
      label: 'PENDING PAYMENTS',
      value: stats.pendingPayments.toString(),
      desc: 'Receipts awaiting verification',
      icon: Clock,
      highlight: stats.pendingPayments > 0,
      action: () => navigate('/admin/payments'),
    },
    {
      label: 'ACTIVE PRODUCTS',
      value: `${stats.activeProductsCount} / ${stats.totalProducts}`,
      desc: 'Published in store catalog',
      icon: Package,
      action: () => navigate('/admin/products'),
    },
    {
      label: 'ACTIVE CITIES',
      value: `${stats.activeCitiesCount} / ${stats.totalCities}`,
      desc: 'Geographic urban hubs',
      icon: MapPin,
      action: () => navigate('/admin/cities'),
    },
    {
      label: 'CATEGORIES',
      value: stats.totalCategories.toString(),
      desc: 'Hierarchical taxonomy',
      icon: FolderTree,
      action: () => navigate('/admin/categories'),
    },
    {
      label: 'LOW STOCK ALERTS',
      value: stats.lowStockCount.toString(),
      desc: 'Variants near exhaustion',
      icon: AlertTriangle,
      highlight: stats.lowStockCount > 0,
      action: () => navigate('/admin/inventory'),
    },
    {
      label: 'OUT OF STOCK',
      value: stats.outOfStockCount.toString(),
      desc: 'Variants with zero units',
      icon: AlertTriangle,
      action: () => navigate('/admin/inventory'),
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            ATELIER OVERVIEW
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Real-time verified database metrics &bull; No simulated metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/products/new')}
            className="px-4 py-2 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors"
          >
            + NEW PRODUCT
          </button>
          <button
            onClick={() => navigate('/admin/cities/new')}
            className="px-4 py-2 border border-white/20 text-white text-xs font-mono uppercase tracking-wider hover:border-white transition-colors"
          >
            + NEW CITY
          </button>
        </div>
      </div>

      {/* Grid of Real Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={card.action}
              className={`p-6 border transition-all cursor-pointer bg-[#121212] group ${
                card.highlight
                  ? 'border-amber-500/40 hover:border-amber-400'
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <div className="flex items-center justify-between text-neutral-400 mb-3">
                <span className="text-[11px] font-mono tracking-widest uppercase">
                  {card.label}
                </span>
                <Icon
                  className={`w-4 h-4 ${
                    card.highlight ? 'text-amber-400' : 'text-neutral-500 group-hover:text-white'
                  }`}
                />
              </div>

              <div className="text-2xl sm:text-3xl font-mono font-bold text-white tabular-nums">
                {card.value}
              </div>

              <div className="text-[11px] font-mono text-neutral-500 mt-2 flex items-center justify-between">
                <span>{card.desc}</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                  &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#121212] border border-white/10 p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <h2 className="text-sm font-mono tracking-widest uppercase text-white font-semibold">
            RECENT CLIENT ORDERS
          </h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-1 uppercase"
          >
            <span>VIEW ALL ORDERS</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recentOrders.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-neutral-500 uppercase">
            NO ORDERS RECORDED YET. WAITING FOR CLIENT CHECKOUTS.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/10 text-neutral-500 uppercase">
                <tr>
                  <th className="py-3 px-2">ORDER REF</th>
                  <th className="py-3 px-2">CUSTOMER</th>
                  <th className="py-3 px-2">DATE</th>
                  <th className="py-3 px-2">TOTAL</th>
                  <th className="py-3 px-2">PAYMENT</th>
                  <th className="py-3 px-2">STATUS</th>
                  <th className="py-3 px-2 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2 font-bold text-white">{order.orderNumber}</td>
                    <td className="py-3 px-2 text-neutral-300">{order.customerName}</td>
                    <td className="py-3 px-2 text-neutral-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 tabular-nums text-white font-medium">
                      {order.totalAmount.toLocaleString()} EGP
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`text-[11px] ${
                          order.paymentStatus === 'Payment Approved'
                            ? 'text-emerald-400 font-semibold'
                            : order.paymentStatus === 'Payment Rejected'
                            ? 'text-red-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-neutral-300">{order.orderStatus}</span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => navigate(`/admin/orders/${order.id}`)}
                        className="text-neutral-400 hover:text-white underline underline-offset-2"
                      >
                        INSPECT
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
