import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Category } from '../types';
import {
  FolderTree,
  Plus,
  Edit,
  Trash2,
  Archive,
  ChevronRight,
  AlertTriangle,
  FolderPlus,
} from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Create / Edit Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formParentId, setFormParentId] = useState<string | null>(null);
  const [formDesc, setFormDesc] = useState('');
  const [formType, setFormType] = useState<'clothing' | 'perfume' | 'general'>('clothing');
  const [submitting, setSubmitting] = useState(false);

  // Safe Delete Modal State
  const [deleteModalCategory, setDeleteModalCategory] = useState<Category | null>(null);
  const [deleteAction, setDeleteAction] = useState<'prevent' | 'reassign' | 'archive'>('reassign');
  const [targetCatId, setTargetCatId] = useState<string>('');
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = (parentId: string | null = null, defaultType: 'clothing' | 'perfume' | 'general' = 'clothing') => {
    setModalMode('create');
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormParentId(parentId);
    setFormDesc('');
    setFormType(defaultType);
  };

  const openEditModal = (cat: Category) => {
    setModalMode('edit');
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormParentId(cat.parentId);
    setFormDesc(cat.description || '');
    setFormType(cat.type);
  };

  const handleNameInput = (val: string) => {
    setFormName(val);
    if (!editingCategory) {
      setFormSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      setSubmitting(true);
      if (modalMode === 'edit' && editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: formDesc.trim(),
          parentId: formParentId,
          type: formType,
        });
      } else {
        await api.createCategory({
          name: formName.trim(),
          slug: formSlug.trim() || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: formDesc.trim(),
          parentId: formParentId,
          type: formType,
          displayOrder: categories.length + 1,
          activeStatus: true,
        });
      }
      setModalMode(null);
      fetchCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteModal = (cat: Category) => {
    setDeleteModalCategory(cat);
    setDeleteAction('archive');
    const otherCats = categories.filter((c) => c.id !== cat.id && !c.parentId);
    if (otherCats.length > 0) setTargetCatId(otherCats[0].id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalCategory) return;
    try {
      const res = await api.deleteCategory(deleteModalCategory.id, deleteAction, targetCatId);
      if (!res.success) {
        setDeleteWarning(res.message || 'Could not delete category.');
        return;
      }
      setDeleteModalCategory(null);
      setDeleteWarning(null);
      fetchCategories();
    } catch (err: any) {
      setDeleteWarning(err.message || 'Error deleting category.');
    }
  };

  // Organize into tree
  const rootCategories = categories.filter((c) => !c.parentId);
  const getSubcategories = (parentId: string) =>
    categories.filter((c) => c.parentId === parentId);

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            CATEGORY ARCHITECTURE
          </h1>
          <p className="text-neutral-400 mt-1">
            Dynamic hierarchical taxonomy: Root Category &rarr; Subcategory &rarr; Products.
          </p>
        </div>

        <button
          onClick={() => openCreateModal(null, 'clothing')}
          className="px-5 py-2.5 bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>NEW ROOT CATEGORY</span>
        </button>
      </div>

      {/* Visual Category Tree */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          PARSING TAXONOMY TREE...
        </div>
      ) : rootCategories.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8">
          No categories configured. Create a root category to begin.
        </div>
      ) : (
        <div className="space-y-6">
          {rootCategories.map((root) => {
            const subs = getSubcategories(root.id);
            return (
              <div key={root.id} className="bg-[#121212] border border-white/15 overflow-hidden">
                {/* Root Header */}
                <div className="p-4 sm:p-5 bg-black/60 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <FolderTree className="w-4 h-4 text-white" />
                    <div>
                      <div className="text-sm font-display font-bold uppercase tracking-wider text-white">
                        {root.name}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        Slug: /{root.slug} &bull; Type: {root.type}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCreateModal(root.id, root.type)}
                      className="px-3 py-1.5 border border-white/20 hover:border-white text-[11px] uppercase transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>ADD SUBCATEGORY</span>
                    </button>
                    <button
                      onClick={() => openEditModal(root)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Edit root category"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(root)}
                      className="p-1.5 text-neutral-500 hover:text-red-400"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="p-4 sm:p-6 space-y-3">
                  {subs.length === 0 ? (
                    <div className="text-neutral-500 text-[11px] italic py-2 pl-4">
                      No subcategories assigned. Click "+ ADD SUBCATEGORY" above.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {subs.map((sub) => {
                        const deepSubs = getSubcategories(sub.id);
                        return (
                          <div
                            key={sub.id}
                            className="p-3 bg-black/40 border border-white/10 flex flex-col justify-between space-y-2 hover:border-white/30 transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-semibold text-white uppercase flex items-center gap-1.5">
                                  <span>{sub.name}</span>
                                </div>
                                <div className="text-[10px] text-neutral-500">/{sub.slug}</div>
                                {sub.description && (
                                  <div className="text-[10px] text-neutral-400 mt-1 line-clamp-1">
                                    {sub.description}
                                  </div>
                                )}
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEditModal(sub)}
                                  className="text-neutral-400 hover:text-white p-1"
                                  title="Edit subcategory"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => openDeleteModal(sub)}
                                  className="text-neutral-500 hover:text-red-400 p-1"
                                  title="Delete subcategory"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Deep children if any */}
                            {deepSubs.length > 0 && (
                              <div className="pt-2 border-t border-white/5 flex flex-wrap gap-1">
                                {deepSubs.map((deep) => (
                                  <span
                                    key={deep.id}
                                    className="text-[9px] bg-neutral-900 px-1.5 py-0.5 border border-white/5 text-neutral-400"
                                  >
                                    {deep.name}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCategory}
            className="max-w-md w-full bg-[#141414] border border-white/20 p-6 space-y-5"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              {modalMode === 'create'
                ? formParentId
                  ? 'CREATE SUBCATEGORY'
                  : 'CREATE ROOT CATEGORY'
                : 'EDIT CATEGORY'}
            </h3>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Category Title *</label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => handleNameInput(e.target.value)}
                placeholder="e.g. Oversized Hoodies"
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">URL Slug</label>
              <input
                type="text"
                required
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Parent Category</label>
              <select
                value={formParentId || ''}
                onChange={(e) => setFormParentId(e.target.value || null)}
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white uppercase text-sm"
              >
                <option value="">NONE (ROOT CATEGORY)</option>
                {categories
                  .filter((c) => editingCategory ? c.id !== editingCategory.id : true)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-400 uppercase mb-1">Description</label>
              <textarea
                rows={2}
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Architectural brief or product characteristics..."
                className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-xs resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalMode(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white uppercase"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-white text-black font-semibold uppercase hover:bg-neutral-200"
              >
                {submitting ? 'SAVING...' : 'SAVE CATEGORY'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SAFE CATEGORY DELETE MODAL (RULE 13) */}
      {deleteModalCategory && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#141414] border border-white/20 p-6 space-y-6">
            <div className="flex items-center gap-3 text-amber-400 border-b border-white/10 pb-3">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-sm tracking-wider uppercase">
                SAFE CATEGORY DELETION
              </h3>
            </div>

            <p className="text-neutral-300">
              You requested deletion of category <strong className="text-white">"{deleteModalCategory.name}"</strong>.
            </p>

            {deleteWarning && (
              <div className="p-3 bg-red-950/40 border border-red-500/30 text-red-300 text-xs">
                {deleteWarning}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="del_act"
                  checked={deleteAction === 'archive'}
                  onChange={() => setDeleteAction('archive')}
                  className="mt-0.5 accent-white"
                />
                <div>
                  <div className="font-bold text-white uppercase">ARCHIVE CATEGORY (SAFE)</div>
                  <div className="text-[11px] text-neutral-400">
                    Hide from public storefront while preserving all product references.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="radio"
                  name="del_act"
                  checked={deleteAction === 'reassign'}
                  onChange={() => setDeleteAction('reassign')}
                  className="mt-0.5 accent-white"
                />
                <div className="flex-1">
                  <div className="font-bold text-white uppercase">MOVE PRODUCTS &amp; DELETE</div>
                  <div className="text-[11px] text-neutral-400 mb-2">
                    Move all products inside this category to another category:
                  </div>
                  <select
                    value={targetCatId}
                    onChange={(e) => setTargetCatId(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white text-xs uppercase"
                  >
                    {categories
                      .filter((c) => c.id !== deleteModalCategory.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                  </select>
                </div>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteModalCategory(null)}
                className="px-4 py-2 text-neutral-400 hover:text-white uppercase"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 text-white font-semibold uppercase hover:bg-red-500"
              >
                EXECUTE SAFE ACTION
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
