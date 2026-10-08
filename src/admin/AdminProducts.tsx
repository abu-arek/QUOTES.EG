import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product } from '../types';
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Edit,
  Copy,
  Archive,
  Trash2,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

export const AdminProducts: React.FC = () => {
  const { navigate } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'clothing' | 'perfume'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'archived'>('all');

  // Safe Delete Modal State
  const [deleteModalProduct, setDeleteModalProduct] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts({ adminView: true });
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleTogglePublish = async (product: Product) => {
    try {
      await api.updateProduct(product.id, {
        product: { published: !product.published },
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to update publish status.');
    }
  };

  const handleDuplicate = async (product: Product) => {
    try {
      await api.duplicateProduct(product.id);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to duplicate product.');
    }
  };

  const handleArchive = async (product: Product) => {
    try {
      await api.updateProduct(product.id, {
        product: { archived: !product.archived, published: false },
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to archive product.');
    }
  };

  const handleConfirmDelete = async (hard: boolean) => {
    if (!deleteModalProduct) return;
    try {
      setIsDeleting(true);
      const res = await api.deleteProduct(deleteModalProduct.id, hard);
      alert(res.message);
      setDeleteModalProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    if (filterType !== 'all' && p.productType !== filterType) return false;
    if (statusFilter === 'published' && (!p.published || p.archived)) return false;
    if (statusFilter === 'draft' && (p.published || p.archived)) return false;
    if (statusFilter === 'archived' && !p.archived) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            PRODUCT ARCHIVE
          </h1>
          <p className="text-xs font-mono text-neutral-400 mt-1">
            Manage apparel &amp; fragrance pieces &bull; Safe deletion guarantees past order integrity.
          </p>
        </div>

        <button
          onClick={() => navigate('/admin/products/new')}
          className="px-5 py-2.5 bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW PIECE</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#121212] border border-white/10 p-4 text-xs font-mono">
        <div className="flex items-center gap-3 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, SKU, or keywords..."
            className="w-full bg-transparent border-none text-white focus:outline-none placeholder-neutral-500"
          />
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="bg-[#181818] border border-white/10 px-3 py-1.5 text-white focus:outline-none uppercase"
          >
            <option value="all">ALL TYPES</option>
            <option value="clothing">CLOTHING</option>
            <option value="perfume">PERFUMES</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-[#181818] border border-white/10 px-3 py-1.5 text-white focus:outline-none uppercase"
          >
            <option value="all">ALL STATUSES</option>
            <option value="published">PUBLISHED</option>
            <option value="draft">DRAFT</option>
            <option value="archived">ARCHIVED</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 ${viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
              title="List view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 ${viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'}`}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Content */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
          INDEXING ATELIER ARCHIVE...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8 flex flex-col items-center">
          <span className="text-3xl font-serif text-white/30 mb-4 select-none">"</span>
          <h3 className="text-lg font-mono font-bold tracking-widest uppercase">
            NO PRODUCTS FOUND
          </h3>
          <p className="mt-2 text-xs font-mono text-neutral-500 uppercase">
            {products.length === 0
              ? 'Your product database is currently empty (0 items). Add your first product or seed sample drops.'
              : 'No items match your active search and filter parameters.'}
          </p>
          <button
            onClick={() => navigate('/admin/products/new')}
            className="mt-6 px-5 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider"
          >
            CREATE FIRST PIECE
          </button>
        </div>
      ) : viewMode === 'list' ? (
        /* List View */
        <div className="bg-[#121212] border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="border-b border-white/10 text-neutral-500 uppercase">
              <tr>
                <th className="py-3 px-4">ITEM</th>
                <th className="py-3 px-4">TYPE</th>
                <th className="py-3 px-4">CATEGORY / CITY</th>
                <th className="py-3 px-4">PRICE</th>
                <th className="py-3 px-4">TOTAL STOCK</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => {
                const primaryImg = p.images.find((img) => img.isPrimary) || p.images[0];
                return (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 bg-neutral-900 border border-white/10 shrink-0 overflow-hidden">
                          {primaryImg?.url ? (
                            <img
                              src={primaryImg.url}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-serif text-white/20 text-xs">
                              "
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{p.name}</div>
                          <div className="text-[10px] text-neutral-500">SKU: {p.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-neutral-400">{p.productType}</td>
                    <td className="py-3 px-4 text-neutral-300">
                      <div>{p.category?.name || 'Unassigned'}</div>
                      {p.city && <div className="text-[10px] text-neutral-500">{p.city.name}</div>}
                    </td>
                    <td className="py-3 px-4 tabular-nums text-white font-medium">
                      {p.price.toLocaleString()} EGP
                    </td>
                    <td className="py-3 px-4 tabular-nums">
                      <span className={p.totalStock <= 0 ? 'text-red-400 font-bold' : p.totalStock <= 5 ? 'text-amber-400' : 'text-neutral-300'}>
                        {p.totalStock} units
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {p.archived ? (
                        <span className="text-[10px] text-neutral-500 uppercase px-2 py-0.5 border border-neutral-700">
                          ARCHIVED
                        </span>
                      ) : p.published ? (
                        <span className="text-[10px] text-emerald-400 uppercase px-2 py-0.5 border border-emerald-500/30">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 uppercase px-2 py-0.5 border border-amber-500/30">
                          DRAFT
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Publish toggle */}
                        <button
                          onClick={() => handleTogglePublish(p)}
                          className="text-neutral-400 hover:text-white p-1"
                          title={p.published ? 'Unpublish' : 'Publish'}
                        >
                          {p.published ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>

                        {/* View in Store */}
                        {p.published && (
                          <button
                            onClick={() => navigate(`/products/${p.slug}`)}
                            className="text-neutral-400 hover:text-white p-1"
                            title="View piece in store"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                          className="text-neutral-400 hover:text-white p-1"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          onClick={() => handleDuplicate(p)}
                          className="text-neutral-400 hover:text-white p-1"
                          title="Duplicate piece"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>

                        {/* Archive */}
                        <button
                          onClick={() => handleArchive(p)}
                          className="text-neutral-400 hover:text-amber-400 p-1"
                          title={p.archived ? 'Restore' : 'Archive'}
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>

                        {/* Safe Delete */}
                        <button
                          onClick={() => setDeleteModalProduct(p)}
                          className="text-neutral-500 hover:text-red-400 p-1"
                          title="Safe Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => {
            const primaryImg = p.images.find((img) => img.isPrimary) || p.images[0];
            return (
              <div
                key={p.id}
                className="bg-[#121212] border border-white/10 p-4 flex flex-col justify-between space-y-4"
              >
                <div className="relative aspect-[4/5] bg-neutral-900 border border-white/10 overflow-hidden">
                  {primaryImg?.url ? (
                    <img
                      src={primaryImg.url}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-serif text-white/20 text-3xl">
                      "
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex gap-1">
                    <span className="text-[10px] font-mono bg-black/80 px-2 py-0.5 text-white border border-white/10 uppercase">
                      {p.productType}
                    </span>
                    {p.published && (
                      <span className="text-[10px] font-mono bg-emerald-950/80 text-emerald-300 px-2 py-0.5 border border-emerald-500/20 uppercase">
                        LIVE
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="font-semibold text-white line-clamp-1">{p.name}</div>
                  <div className="text-neutral-400">{p.price.toLocaleString()} EGP</div>
                  <div className="text-neutral-500 text-[11px]">Stock: {p.totalStock} units</div>
                </div>

                <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs font-mono">
                  <button
                    onClick={() => navigate(`/admin/products/${p.id}/edit`)}
                    className="text-neutral-300 hover:text-white underline underline-offset-2"
                  >
                    EDIT
                  </button>
                  <button
                    onClick={() => setDeleteModalProduct(p)}
                    className="text-red-400 hover:text-red-300"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* SAFE DELETE CONFIRMATION MODAL (RULE 12) */}
      {deleteModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-white/20 p-6 space-y-6 text-xs font-mono">
            <div className="flex items-center gap-3 text-amber-400 border-b border-white/10 pb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm tracking-widest uppercase">
                SAFE DELETE SYSTEM &bull; DATA PROTECTION
              </h3>
            </div>

            <p className="text-neutral-300 leading-relaxed">
              You are deleting piece <strong className="text-white">"{deleteModalProduct.name}"</strong>.
            </p>

            <div className="p-3 bg-black/60 border border-white/10 text-[11px] text-neutral-400 space-y-1">
              <div>&bull; <strong>Historical Order Safety:</strong> Order records store complete item snapshots (name, price, SKU, variant). Deleting will NEVER corrupt or erase past purchases.</div>
              <div>&bull; <strong>Recommended Action:</strong> Archive / Unpublish to remove from public store while keeping internal references intact.</div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleConfirmDelete(false)}
                className="w-full py-3 bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200"
              >
                SAFELY ARCHIVE / UNPUBLISH (RECOMMENDED)
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={() => handleConfirmDelete(true)}
                className="w-full py-2.5 border border-red-500/40 text-red-400 hover:bg-red-950/40 uppercase tracking-wider"
              >
                FORCE PURGE CURRENT RECORD (PRESERVES ORDER SNAPSHOTS)
              </button>

              <button
                type="button"
                onClick={() => setDeleteModalProduct(null)}
                className="w-full py-2 text-neutral-500 hover:text-white uppercase tracking-wider"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
