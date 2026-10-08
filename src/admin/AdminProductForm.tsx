import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, Category, City, ProductVariant, ProductImage } from '../types';
import {
  ArrowLeft,
  Check,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface AdminProductFormProps {
  productId?: string; // If edit mode
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({ productId }) => {
  const { navigate } = useApp();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Taxonomy Lists
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);

  // STEP 1: Product Type
  const [productType, setProductType] = useState<'clothing' | 'perfume'>('clothing');

  // STEP 2: Basic Info
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(1850);
  const [compareAtPrice, setCompareAtPrice] = useState<number | null>(null);
  const [sku, setSku] = useState('');

  // STEP 3: Classification
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState<string>('');
  const [cityId, setCityId] = useState<string>('');

  // STEP 4: Images
  const [images, setImages] = useState<{ url: string; alt: string; isPrimary: boolean; displayOrder: number }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // STEP 5: Variants
  const [variants, setVariants] = useState<
    { name: string; size?: string; color?: string; volume?: string; sku: string; price: number; stockQuantity: number; displayOrder: number }[]
  >([
    { name: 'Standard M', size: 'M', color: 'Black', sku: 'QTS-01-M', price: 1850, stockQuantity: 10, displayOrder: 1 },
  ]);

  // STEP 7: Dynamic Attributes
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([
    { key: 'material', value: '100% Egyptian Combed Cotton (480 GSM)' },
    { key: 'fit', value: 'Oversized Boxy Silhouette' },
  ]);

  // STEP 8: Publish
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);

  // Fetch Taxonomy and Existing Product if Editing
  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const [catList, cityList] = await Promise.all([
          api.getCategories(),
          api.getCities(true),
        ]);
        setCategories(catList);
        setCities(cityList);

        if (productId) {
          const existing = await api.getProducts({ adminView: true }).then((list) =>
            list.find((p) => p.id === productId)
          );
          if (existing) {
            setProductType(existing.productType);
            setName(existing.name);
            setSlug(existing.slug);
            setDescription(existing.description || '');
            setPrice(existing.price);
            setCompareAtPrice(existing.compareAtPrice || null);
            setSku(existing.sku);
            setCategoryId(existing.categoryId);
            setSubcategoryId(existing.subcategoryId || '');
            setCityId(existing.cityId || '');
            setPublished(existing.published);
            setFeatured(existing.featured);

            if (existing.images && existing.images.length > 0) {
              setImages(
                existing.images.map((img, i) => ({
                  url: img.url,
                  alt: img.alt,
                  isPrimary: img.isPrimary,
                  displayOrder: img.displayOrder || i + 1,
                }))
              );
            }

            if (existing.variants && existing.variants.length > 0) {
              setVariants(
                existing.variants.map((v, i) => ({
                  name: v.name,
                  size: v.size,
                  color: v.color,
                  volume: v.volume,
                  sku: v.sku,
                  price: v.price,
                  stockQuantity: v.stockQuantity,
                  displayOrder: v.displayOrder || i + 1,
                }))
              );
            }

            if (existing.attributes && existing.attributes.length > 0) {
              setAttributes(
                existing.attributes.map((a) => ({ key: a.key, value: a.value }))
              );
            }
          }
        } else {
          // Defaults for new product
          const defaultCat = catList.find((c) => c.slug === 'clothing' || c.type === 'clothing');
          if (defaultCat) setCategoryId(defaultCat.id);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to initialize form.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [productId]);

  // Handle auto-slug and SKU generator
  const handleNameChange = (val: string) => {
    setName(val);
    if (!productId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setSlug(generatedSlug);
      const generatedSku = `QTS-${val.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
      setSku(generatedSku);
    }
  };

  // Switch product type adaptations
  const handleTypeSwitch = (type: 'clothing' | 'perfume') => {
    setProductType(type);
    if (type === 'perfume') {
      const perfumeCat = categories.find((c) => c.slug === 'perfumes' || c.type === 'perfume');
      if (perfumeCat) setCategoryId(perfumeCat.id);
      setVariants([
        { name: '50ml Flacon', volume: '50ml', sku: `${sku || 'QTS-PF'}-50ML`, price: price || 2400, stockQuantity: 15, displayOrder: 1 },
        { name: '100ml Flacon', volume: '100ml', sku: `${sku || 'QTS-PF'}-100ML`, price: (price || 2400) * 1.5, stockQuantity: 8, displayOrder: 2 },
      ]);
      setAttributes([
        { key: 'gender', value: 'Unisex' },
        { key: 'concentration', value: 'Extrait de Parfum (28% oil concentration)' },
        { key: 'fragrance_family', value: 'Woody' },
        { key: 'top_notes', value: 'Smoked Bergamot, Cardamom' },
        { key: 'heart_notes', value: 'Egyptian Papyrus, Orris' },
        { key: 'base_notes', value: 'Cedarwood, Dark Amber' },
      ]);
    } else {
      const clothingCat = categories.find((c) => c.slug === 'clothing' || c.type === 'clothing');
      if (clothingCat) setCategoryId(clothingCat.id);
      setVariants([
        { name: 'M / Black', size: 'M', color: 'Black', sku: `${sku || 'QTS-CL'}-M-BLK`, price: price || 1850, stockQuantity: 12, displayOrder: 1 },
        { name: 'L / Black', size: 'L', color: 'Black', sku: `${sku || 'QTS-CL'}-L-BLK`, price: price || 1850, stockQuantity: 8, displayOrder: 2 },
        { name: 'XL / Black', size: 'XL', color: 'Black', sku: `${sku || 'QTS-CL'}-XL-BLK`, price: price || 1850, stockQuantity: 5, displayOrder: 3 },
      ]);
      setAttributes([
        { key: 'material', value: '100% Egyptian Combed Cotton (480 GSM)' },
        { key: 'fit', value: 'Oversized Boxy Silhouette' },
        { key: 'care', value: 'Cold wash inside out. Do not tumble dry.' },
      ]);
    }
  };

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingImage(true);
        const res = await api.uploadImage(e.target.files[0]);
        setImages((prev) => [
          ...prev,
          {
            url: res.url,
            alt: name || 'Product image',
            isPrimary: prev.length === 0,
            displayOrder: prev.length + 1,
          },
        ]);
      } catch (err: any) {
        alert(err.message || 'Failed to upload image.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  // Add external image URL
  const addImageUrl = () => {
    const url = window.prompt('Enter Image URL (e.g. /src/assets/images/... or public path):');
    if (url?.trim()) {
      setImages((prev) => [
        ...prev,
        {
          url: url.trim(),
          alt: name || 'Product image',
          isPrimary: prev.length === 0,
          displayOrder: prev.length + 1,
        },
      ]);
    }
  };

  // Submit product creation or update
  const handleSubmit = async (publishImmediate: boolean) => {
    if (!name.trim()) {
      setError('Please provide a piece title in Step 2.');
      setCurrentStep(2);
      return;
    }
    if (!price || price <= 0) {
      setError('Please provide a valid price in Step 2.');
      setCurrentStep(2);
      return;
    }
    if (productType === 'clothing' && !categoryId) {
      setError('Please select a clothing category in Step 3.');
      setCurrentStep(3);
      return;
    }
    if (productType === 'perfume' && !cityId) {
      setError('Every perfume must belong to a City in QUOTES. Please select an Urban City Capsule in Step 3.');
      setCurrentStep(3);
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        product: {
          productType,
          name: name.trim(),
          slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: description.trim(),
          price: Number(price),
          compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
          sku: sku.trim() || `QTS-${Date.now().toString(36).toUpperCase()}`,
          categoryId,
          subcategoryId: subcategoryId || null,
          cityId: cityId || null,
          featured,
          published: publishImmediate,
        },
        images,
        variants,
        attributes,
      };

      if (productId) {
        await api.updateProduct(productId, payload);
      } else {
        await api.createProduct(payload);
      }

      navigate('/admin/products');
    } catch (err: any) {
      setError(err.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'TYPE' },
    { num: 2, label: 'BASIC INFO' },
    { num: 3, label: 'CLASSIFICATION' },
    { num: 4, label: 'IMAGES' },
    { num: 5, label: 'VARIANTS' },
    { num: 6, label: 'INVENTORY' },
    { num: 7, label: 'ATTRIBUTES' },
    { num: 8, label: 'PUBLISH' },
  ];

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-mono text-neutral-500 uppercase tracking-widest">
        INITIALIZING FORM MATRIX...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-white text-xs font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-neutral-400 hover:text-white flex items-center gap-2 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO PRODUCTS</span>
        </button>

        <div className="text-neutral-400 uppercase tracking-widest">
          {productId ? 'EDIT PIECE' : '8-STEP CREATION FLOW'}
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-500/30 text-red-300">
          {error}
        </div>
      )}

      {/* 8-Step Stepper Bar */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 border-b border-white/10 pb-6">
        {stepsList.map((st) => (
          <button
            key={st.num}
            type="button"
            onClick={() => setCurrentStep(st.num)}
            className={`p-2 text-center border transition-all ${
              currentStep === st.num
                ? 'border-white bg-white text-black font-bold'
                : currentStep > st.num
                ? 'border-white/30 text-neutral-300 bg-neutral-900/60'
                : 'border-white/10 text-neutral-500'
            }`}
          >
            <div className="text-[10px] opacity-75">0{st.num}</div>
            <div className="truncate text-[10px] font-semibold">{st.label}</div>
          </button>
        ))}
      </div>

      {/* STEP CONTAINER */}
      <div className="bg-[#121212] border border-white/10 p-6 sm:p-8 space-y-6">
        {/* STEP 1: PRODUCT TYPE */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              STEP 1: SELECT PRODUCT TYPE
            </h2>
            <p className="text-neutral-400">
              QUOTES produces architectural apparel capsules and haute parfumerie. Sizing, inventory fields, and attributes adapt automatically.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                onClick={() => handleTypeSwitch('clothing')}
                className={`p-6 border cursor-pointer transition-all ${
                  productType === 'clothing'
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 hover:border-white/40 text-neutral-300 bg-black/40'
                }`}
              >
                <div className="text-lg font-bold font-display uppercase tracking-wider">
                  CLOTHING
                </div>
                <p className="text-[11px] mt-2 opacity-80 leading-normal">
                  Hoodies, sweatpants, t-shirts, shirts, denim, jackets. Sized in XS–XXL, custom waists, or one-size.
                </p>
              </div>

              <div
                onClick={() => handleTypeSwitch('perfume')}
                className={`p-6 border cursor-pointer transition-all ${
                  productType === 'perfume'
                    ? 'border-white bg-white text-black'
                    : 'border-white/15 hover:border-white/40 text-neutral-300 bg-black/40'
                }`}
              >
                <div className="text-lg font-bold font-display uppercase tracking-wider">
                  PERFUME
                </div>
                <p className="text-[11px] mt-2 opacity-80 leading-normal">
                  Extraits de parfum, flacons, discovery sets. Classified by volume (30ml, 50ml, 100ml) &amp; fragrance notes.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: BASIC INFORMATION */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              STEP 2: BASIC INFORMATION
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-neutral-400 uppercase mb-1.5">Piece Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Nocturne Heavyweight Hoodie"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1.5">URL Slug *</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="nocturne-heavyweight-hoodie"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1.5">SKU Prefix *</label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="QTS-HD-NOC-01"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1.5">Base Price (EGP) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tabular-nums"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1.5">Compare-at Price (EGP, Optional)</label>
                <input
                  type="number"
                  value={compareAtPrice || ''}
                  onChange={(e) => setCompareAtPrice(e.target.value ? Number(e.target.value) : null)}
                  placeholder="2200"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white tabular-nums"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-neutral-400 uppercase mb-1.5">Piece Description *</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Architectural cuts, cotton weave details, or fragrance olfactory journey..."
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CLASSIFICATION */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              STEP 3: {productType === 'clothing' ? 'CATEGORY & CITY ASSIGNMENT' : 'CITY ASSIGNMENT (PERFUMES BELONG TO A CITY)'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* City Selection: Required for Perfume, highly recommended for Clothing */}
              <div>
                <label className="block text-neutral-400 uppercase mb-1.5">
                  Urban City Capsule {productType === 'perfume' ? '*' : '(Optional)'}
                </label>
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white uppercase"
                >
                  <option value="">{productType === 'perfume' ? 'SELECT CITY (REQUIRED)' : 'GENERAL DROP (NO CITY)'}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.country})
                    </option>
                  ))}
                </select>
                {productType === 'perfume' && (
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Every perfume product must belong to a City in QUOTES.
                  </p>
                )}
              </div>

              {/* Clothing Category: Required for Clothing, Optional for Perfume */}
              {productType === 'clothing' ? (
                <>
                  <div>
                    <label className="block text-neutral-400 uppercase mb-1.5">Category *</label>
                    <select
                      value={categoryId}
                      onChange={(e) => {
                        setCategoryId(e.target.value);
                        setSubcategoryId('');
                      }}
                      className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white uppercase"
                    >
                      <option value="">SELECT CATEGORY</option>
                      {categories
                        .filter((c) => c.type !== 'perfume')
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.parentId ? '(Sub)' : ''}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 uppercase mb-1.5">Subcategory (Optional)</label>
                    <select
                      value={subcategoryId}
                      onChange={(e) => setSubcategoryId(e.target.value)}
                      className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white uppercase"
                    >
                      <option value="">NONE / UNASSIGNED</option>
                      {categories
                        .filter((c) => c.parentId === categoryId)
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="sm:col-span-2">
                  <label className="block text-neutral-400 uppercase mb-1.5">Optional Collection Tag</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-[#181818] border border-white/15 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-white uppercase"
                  >
                    <option value="">STANDALONE FRAGRANCE (NO GLOBAL CATEGORY)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Perfumes are products inside a City, not a separate top-level global category.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: IMAGES */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                STEP 4: EDITORIAL PRODUCT GALLERY
              </h2>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="px-3 py-1.5 border border-white/20 hover:border-white text-[11px] uppercase transition-colors"
                >
                  + ADD IMAGE URL
                </button>
                <button
                  type="button"
                  disabled={uploadingImage}
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-black font-semibold text-[11px] uppercase hover:bg-neutral-200 transition-colors"
                >
                  {uploadingImage ? 'UPLOADING...' : '+ UPLOAD FILE'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {images.length === 0 ? (
              <div className="border border-dashed border-white/20 p-12 text-center text-neutral-400">
                <ImageIcon className="w-8 h-8 mx-auto mb-3 text-neutral-500" />
                <p>No images attached yet. Upload real photography or input an image URL.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative aspect-[4/5] bg-black border border-white/15 group overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />

                    {/* Primary Badge */}
                    {img.isPrimary && (
                      <div className="absolute top-2 left-2 bg-white text-black text-[9px] font-bold px-1.5 py-0.5 uppercase">
                        PRIMARY
                      </div>
                    )}

                    {/* Actions */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/80 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) =>
                              prev.map((item, i) => ({ ...item, isPrimary: i === idx }))
                            );
                          }}
                          className="text-[10px] text-neutral-300 hover:text-white uppercase"
                        >
                          SET PRIMARY
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setImages((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 uppercase ml-auto"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 5: VARIANTS */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                STEP 5: PRODUCT VARIANTS ({productType === 'clothing' ? 'SIZES & COLORS' : 'VOLUMES'})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setVariants((prev) => [
                    ...prev,
                    {
                      name: `Variant ${prev.length + 1}`,
                      sku: `${sku || 'QTS'}-V${prev.length + 1}`,
                      price,
                      stockQuantity: 10,
                      displayOrder: prev.length + 1,
                    },
                  ]);
                }}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-[11px] uppercase transition-colors"
              >
                + ADD CUSTOM VARIANT
              </button>
            </div>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/10 grid grid-cols-2 sm:grid-cols-6 gap-3 items-end">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] text-neutral-500 uppercase mb-1">Variant Name</label>
                    <input
                      type="text"
                      value={v.name}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].name = e.target.value;
                        setVariants(copy);
                      }}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white"
                    />
                  </div>

                  {productType === 'clothing' ? (
                    <>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase mb-1">Size (Custom)</label>
                        <input
                          type="text"
                          value={v.size || ''}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].size = e.target.value;
                            setVariants(copy);
                          }}
                          placeholder="M / 32 / One Size"
                          className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-neutral-500 uppercase mb-1">Color</label>
                        <input
                          type="text"
                          value={v.color || ''}
                          onChange={(e) => {
                            const copy = [...variants];
                            copy[idx].color = e.target.value;
                            setVariants(copy);
                          }}
                          placeholder="Slate / Black"
                          className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-neutral-500 uppercase mb-1">Volume (Custom)</label>
                      <input
                        type="text"
                        value={v.volume || ''}
                        onChange={(e) => {
                          const copy = [...variants];
                          copy[idx].volume = e.target.value;
                          setVariants(copy);
                        }}
                        placeholder="50ml / 100ml"
                        className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-[10px] text-neutral-500 uppercase mb-1">Price (EGP)</label>
                    <input
                      type="number"
                      value={v.price}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].price = Number(e.target.value);
                        setVariants(copy);
                      }}
                      className="w-full bg-[#181818] border border-white/15 px-3 py-1.5 text-white tabular-nums"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={variants.length <= 1}
                      onClick={() => setVariants((prev) => prev.filter((_, i) => i !== idx))}
                      className="p-2 text-red-400 hover:text-red-300 disabled:opacity-30"
                      title="Remove variant"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: INVENTORY */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              STEP 6: STOCK QUANTITIES PER VARIANT
            </h2>

            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">{v.name}</div>
                    <div className="text-[11px] text-neutral-400">SKU: {v.sku}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-neutral-400">UNITS:</span>
                    <input
                      type="number"
                      min={0}
                      value={v.stockQuantity}
                      onChange={(e) => {
                        const copy = [...variants];
                        copy[idx].stockQuantity = Math.max(0, parseInt(e.target.value, 10) || 0);
                        setVariants(copy);
                      }}
                      className="w-24 bg-[#181818] border border-white/15 px-3 py-1.5 text-white tabular-nums text-right font-bold"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-neutral-400 border-t border-white/10 pt-4">
              TOTAL CALCULATED PIECE INVENTORY:{' '}
              <span className="text-white font-bold tabular-nums">
                {variants.reduce((sum, v) => sum + (v.stockQuantity || 0), 0)} units
              </span>
            </div>
          </div>
        )}

        {/* STEP 7: ATTRIBUTES */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                STEP 7: DYNAMIC ATTRIBUTES ({productType.toUpperCase()})
              </h2>
              <button
                type="button"
                onClick={() => {
                  setAttributes((prev) => [...prev, { key: 'attribute_name', value: 'value' }]);
                }}
                className="px-3 py-1.5 border border-white/20 hover:border-white text-[11px] uppercase transition-colors"
              >
                + ADD CUSTOM ATTRIBUTE
              </button>
            </div>

            <div className="space-y-3">
              {attributes.map((attr, idx) => (
                <div key={idx} className="p-3 bg-black/40 border border-white/10 flex gap-3 items-center">
                  <input
                    type="text"
                    value={attr.key}
                    onChange={(e) => {
                      const copy = [...attributes];
                      copy[idx].key = e.target.value;
                      setAttributes(copy);
                    }}
                    placeholder="Key (e.g. material, notes)"
                    className="w-1/3 bg-[#181818] border border-white/15 px-3 py-1.5 text-white uppercase text-[11px]"
                  />
                  <input
                    type="text"
                    value={attr.value}
                    onChange={(e) => {
                      const copy = [...attributes];
                      copy[idx].value = e.target.value;
                      setAttributes(copy);
                    }}
                    placeholder="Value (e.g. 500 GSM Combed Cotton)"
                    className="flex-1 bg-[#181818] border border-white/15 px-3 py-1.5 text-white text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => setAttributes((prev) => prev.filter((_, i) => i !== idx))}
                    className="text-red-400 hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 8: PUBLISH SETTINGS */}
        {currentStep === 8 && (
          <div className="space-y-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              STEP 8: VISIBILITY &amp; LAUNCH
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-black/40 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 accent-white"
                />
                <div>
                  <div className="font-semibold text-white uppercase">PUBLISH IMMEDIATELY</div>
                  <div className="text-[11px] text-neutral-400">
                    If checked, this piece will instantly become visible in the customer storefront.
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-black/40 border border-white/10 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 accent-white"
                />
                <div>
                  <div className="font-semibold text-white uppercase">FEATURE ON HOMEPAGE</div>
                  <div className="text-[11px] text-neutral-400">
                    Include in the primary 02 / CURRENT RELEASE grid on the front page.
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Stepper Navigation Buttons */}
        <div className="flex justify-between items-center border-t border-white/10 pt-6">
          <button
            type="button"
            disabled={currentStep === 1}
            onClick={() => setCurrentStep((p) => Math.max(1, p - 1))}
            className="px-5 py-2.5 border border-white/20 text-neutral-300 hover:text-white disabled:opacity-30 uppercase"
          >
            &larr; PREVIOUS STEP
          </button>

          <div className="flex gap-3">
            {currentStep < 8 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((p) => Math.min(8, p + 1))}
                className="px-6 py-2.5 bg-white text-black font-semibold uppercase hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSubmit(false)}
                  className="px-5 py-2.5 border border-white/20 text-white uppercase hover:border-white transition-colors"
                >
                  SAVE AS DRAFT
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleSubmit(true)}
                  className="px-6 py-2.5 bg-white text-black font-bold uppercase hover:bg-neutral-200 transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{saving ? 'COMMITTING...' : 'PUBLISH PIECE'}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
