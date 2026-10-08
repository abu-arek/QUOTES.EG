import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { InventoryItem } from '../types';
import { useApp } from '../context/AppContext';
import { Boxes, AlertTriangle, Check, RefreshCw } from 'lucide-react';

export const AdminInventory: React.FC = () => {
  const { settings } = useApp();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, number>>({});

  const lowStockThreshold = settings?.lowStockThreshold || 5;

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await api.getInventory();
      setItems(data);
      const initialMap: Record<string, number> = {};
      data.forEach((i) => {
        initialMap[i.variantId] = i.stockQuantity;
      });
      setEditValues(initialMap);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleStockChange = (variantId: string, val: number) => {
    setEditValues((prev) => ({
      ...prev,
      [variantId]: Math.max(0, val),
    }));
  };

  const handleSaveStock = async (variantId: string) => {
    try {
      setSavingId(variantId);
      const val = editValues[variantId];
      await api.updateStock(variantId, val);
      await fetchInventory();
    } catch (err: any) {
      alert(err.message || 'Failed to update stock quantity.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            INVENTORY &bull; STOCK LEVELS
          </h1>
          <p className="text-neutral-400 mt-1">
            Real-time stock ledger &bull; Low stock threshold: {lowStockThreshold} units.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="px-4 py-2 border border-white/20 text-neutral-300 hover:text-white uppercase flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>REFRESH STOCK</span>
        </button>
      </div>

      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          CHECKING STOCK RECORDS...
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8">
          No product variants in inventory. Create a product with variants to track inventory.
        </div>
      ) : (
        <div className="bg-[#121212] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-neutral-500 uppercase">
              <tr>
                <th className="py-3 px-4">PRODUCT PIECE</th>
                <th className="py-3 px-4">VARIANT</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">PRICE</th>
                <th className="py-3 px-4">CURRENT STOCK</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">INLINE UPDATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {items.map((item) => {
                const currentVal = editValues[item.variantId] ?? item.stockQuantity;
                const hasChanged = currentVal !== item.stockQuantity;

                return (
                  <tr key={item.variantId} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{item.productName}</div>
                      <div className="text-[10px] text-neutral-500 uppercase">{item.productType}</div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-300">
                      <div>{item.variantName}</div>
                      <div className="text-[10px] text-neutral-500">
                        {item.size && `Size: ${item.size} `}
                        {item.color && `Color: ${item.color} `}
                        {item.volume && `Volume: ${item.volume} `}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-400 font-mono">{item.sku}</td>
                    <td className="py-3.5 px-4 text-white tabular-nums">{item.price.toLocaleString()} EGP</td>
                    <td className="py-3.5 px-4 tabular-nums font-bold text-white">
                      {item.stockQuantity} units
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] px-2 py-0.5 border uppercase ${
                          item.status === 'OUT OF STOCK'
                            ? 'text-red-400 border-red-500/30 bg-red-950/40'
                            : item.status === 'LOW STOCK'
                            ? 'text-amber-400 border-amber-500/30 bg-amber-950/40'
                            : 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <input
                          type="number"
                          min={0}
                          value={currentVal}
                          onChange={(e) =>
                            handleStockChange(item.variantId, parseInt(e.target.value, 10) || 0)
                          }
                          className="w-20 bg-[#181818] border border-white/20 px-2 py-1 text-white text-right tabular-nums focus:outline-none focus:border-white"
                        />
                        <button
                          type="button"
                          disabled={savingId === item.variantId || !hasChanged}
                          onClick={() => handleSaveStock(item.variantId)}
                          className={`px-3 py-1 font-semibold uppercase text-[11px] transition-colors ${
                            hasChanged
                              ? 'bg-white text-black hover:bg-neutral-200 cursor-pointer'
                              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          }`}
                        >
                          {savingId === item.variantId ? '...' : 'SAVE'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
