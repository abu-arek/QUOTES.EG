import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Users, Search, ShoppingBag } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await api.getAdminCustomers();
        setCustomers(data);
      } catch (err) {
        console.error('Failed to load customers:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            CLIENT DIRECTORY
          </h1>
          <p className="text-neutral-400 mt-1">
            Aggregated purchase history &bull; Lifetime spend &bull; Client contact logs.
          </p>
        </div>

        <div className="text-neutral-400">
          TOTAL CLIENTS: <span className="text-white font-bold tabular-nums">{customers.length}</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#121212] border border-white/10 p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-neutral-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by client name, email, or telephone..."
          className="w-full bg-transparent border-none text-white focus:outline-none placeholder-neutral-500"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          AGGREGATING CLIENT LEDGER...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8">
          No customer records logged yet.
        </div>
      ) : (
        <div className="bg-[#121212] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-neutral-500 uppercase">
              <tr>
                <th className="py-3 px-4">CLIENT NAME</th>
                <th className="py-3 px-4">EMAIL ADDRESS</th>
                <th className="py-3 px-4">TELEPHONE</th>
                <th className="py-3 px-4">ORDERS</th>
                <th className="py-3 px-4">VERIFIED SPEND</th>
                <th className="py-3 px-4 text-right">LAST PURCHASE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((c, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">{c.name}</td>
                  <td className="py-3.5 px-4 text-neutral-300 font-mono">{c.email}</td>
                  <td className="py-3.5 px-4 text-neutral-400 font-mono">{c.phone}</td>
                  <td className="py-3.5 px-4 tabular-nums text-white">
                    {c.ordersCount} {c.ordersCount === 1 ? 'order' : 'orders'}
                  </td>
                  <td className="py-3.5 px-4 tabular-nums text-emerald-400 font-semibold">
                    {c.totalSpend.toLocaleString()} EGP
                  </td>
                  <td className="py-3.5 px-4 text-neutral-400 text-right">
                    {new Date(c.lastOrderDate).toLocaleDateString()}
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
