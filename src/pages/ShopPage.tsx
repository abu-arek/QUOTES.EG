import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Product, Category, City } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Filter, SlidersHorizontal, X, Search, RotateCcw } from 'lucide-react';

interface ShopPageProps {
  initialType?: 'clothing' | 'perfume';
  categorySlug?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({ initialType, categorySlug }) => {
  const { currentPath, navigate, settings } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedType, setSelectedType] = useState<'all' | 'clothing' | 'perfume'>(
    initialType || (currentPath.includes('/clothing') ? 'clothing' : currentPath.includes('/perfumes') ? 'perfume' : 'all')
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(categorySlug || '');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [selectedConcentration, setSelectedConcentration] = useState<string>('');
  const [selectedFragranceFamily, setSelectedFragranceFamily] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'name'>('newest');
  const [searchQuery, setSearchQuery] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('q') || '';
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const brandSymbol = settings?.brandSymbol || '"';

  // Load Categories & Cities
  useEffect(() => {
    const loadTaxonomy = async () => {
      try {
        const [catList, cityList] = await Promise.all([
          api.getCategories(),
          api.getCities(false),
        ]);
        setCategories(catList);
        setCities(cityList);
      } catch (err) {
        console.error('Failed to load taxonomy:', err);
      }
    };
    loadTaxonomy();
  }, []);

  // Update selectedType when props or route changes
  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    } else if (currentPath.includes('/clothing')) {
      setSelectedType('clothing');
    } else if (currentPath.includes('/perfumes')) {
      setSelectedType('perfume');
    }
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [initialType, categorySlug, currentPath]);

  // Fetch Products based on all active filters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {
          publishedOnly: true,
          sortBy,
        };

        if (selectedType !== 'all') params.productType = selectedType;
        if (selectedCategory) params.categorySlug = selectedCategory;
        if (selectedSubcategory) params.subcategoryId = selectedSubcategory;
        if (selectedCity) params.citySlug = selectedCity;
        if (searchQuery.trim()) params.query = searchQuery.trim();

        if (selectedType === 'clothing' || selectedType === 'all') {
          if (selectedSize) params.size = selectedSize;
          if (selectedColor) params.color = selectedColor;
        }

        if (selectedType === 'perfume' || selectedType === 'all') {
          if (selectedGender) params.gender = selectedGender;
          if (selectedConcentration) params.concentration = selectedConcentration;
          if (selectedFragranceFamily) params.fragranceFamily = selectedFragranceFamily;
        }

        const res = await api.getProducts(params);
        setProducts(res);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    selectedType,
    selectedCategory,
    selectedSubcategory,
    selectedCity,
    selectedSize,
    selectedColor,
    selectedGender,
    selectedConcentration,
    selectedFragranceFamily,
    sortBy,
    searchQuery,
  ]);

  // Derived taxonomy lists
  const currentCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const rootCategories = categories.filter((c) => !c.parentId);
  const relevantSubcategories = categories.filter((c) => {
    if (selectedCategory && currentCategoryObj) {
      return c.parentId === currentCategoryObj.id;
    }
    if (selectedType === 'clothing') {
      const clothingRoot = categories.find((cat) => cat.slug === 'clothing');
      return clothingRoot && c.parentId === clothingRoot.id;
    }
    if (selectedType === 'perfume') {
      const perfumeRoot = categories.find((cat) => cat.slug === 'perfumes');
      return perfumeRoot && c.parentId === perfumeRoot.id;
    }
    return false;
  });

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSelectedSubcategory('');
    setSelectedCity('');
    setSelectedSize('');
    setSelectedColor('');
    setSelectedGender('');
    setSelectedConcentration('');
    setSelectedFragranceFamily('');
    setSearchQuery('');
  };

  const hasActiveFilters =
    Boolean(selectedCategory) ||
    Boolean(selectedSubcategory) ||
    Boolean(selectedCity) ||
    Boolean(selectedSize) ||
    Boolean(selectedColor) ||
    Boolean(selectedGender) ||
    Boolean(selectedConcentration) ||
    Boolean(selectedFragranceFamily) ||
    Boolean(searchQuery);

  return (
    <div className="min-h-screen text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Editorial Header */}
      <div className="border-b border-white/10 pb-8 mb-8">
        <div className="text-xs font-mono tracking-widest text-neutral-500 uppercase mb-2">
          {selectedType === 'clothing'
            ? 'ATELIER APPAREL'
            : selectedType === 'perfume'
            ? 'HAUTE PARFUMERIE'
            : 'COMPLETE CATALOG'}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold uppercase tracking-tight">
              {currentCategoryObj
                ? currentCategoryObj.name
                : selectedType === 'clothing'
                ? 'CLOTHING'
                : selectedType === 'perfume'
                ? 'PERFUMES'
                : 'SHOP'}
            </h1>
            {currentCategoryObj?.description && (
              <p className="mt-2 text-xs sm:text-sm font-mono text-neutral-400 max-w-2xl">
                {currentCategoryObj.description}
              </p>
            )}
          </div>
          <div className="text-xs font-mono text-neutral-400 tracking-wider">
            SHOWING <span className="text-white font-semibold tabular-nums">{products.length}</span> PIECES
          </div>
        </div>

        {/* Dynamic Type Selector Tabs (All / Clothing / Perfumes) */}
        <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 text-xs font-mono tracking-widest uppercase">
          <button
            onClick={() => {
              setSelectedType('all');
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className={`px-4 py-2 border transition-colors ${
              selectedType === 'all'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
            }`}
          >
            ALL
          </button>
          <button
            onClick={() => {
              setSelectedType('clothing');
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className={`px-4 py-2 border transition-colors ${
              selectedType === 'clothing'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
            }`}
          >
            CLOTHING
          </button>
          <button
            onClick={() => {
              setSelectedType('perfume');
              setSelectedCategory('');
              setSelectedSubcategory('');
            }}
            className={`px-4 py-2 border transition-colors ${
              selectedType === 'perfume'
                ? 'border-white bg-white text-black font-semibold'
                : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
            }`}
          >
            PERFUMES
          </button>

          {/* Dynamic Category Chips from Database */}
          {categories
            .filter((c) => {
              if (selectedType === 'clothing') return c.parentId === 'cat_clothing';
              if (selectedType === 'perfume') return c.parentId === 'cat_perfumes';
              return !c.parentId;
            })
            .map((cat) => {
              const isCatActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(isCatActive ? '' : cat.slug);
                    setSelectedSubcategory('');
                  }}
                  className={`px-4 py-2 border transition-colors whitespace-nowrap ${
                    isCatActive
                      ? 'border-white bg-white text-black font-semibold'
                      : 'border-white/10 text-neutral-400 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
        </div>
      </div>

      {/* Subcategories strip if selected category has subcategories */}
      {relevantSubcategories.length > 0 && (
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 text-[11px] font-mono tracking-wider uppercase">
          <span className="text-neutral-500 mr-1">SUBCATEGORIES:</span>
          {relevantSubcategories.map((sub) => {
            const isSubActive = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(isSubActive ? '' : sub.id)}
                className={`px-3 py-1 border transition-colors ${
                  isSubActive
                    ? 'border-white/60 bg-neutral-800 text-white'
                    : 'border-white/10 text-neutral-400 hover:text-white'
                }`}
              >
                {sub.name}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8 border-y border-white/5 text-xs font-mono">
        {/* Left: Mobile Filter Toggle & Quick City / Sorting */}
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex items-center gap-2 px-3 py-1.5 border border-white/20 hover:border-white transition-colors uppercase"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>FILTERS {hasActiveFilters ? `(ACTIVE)` : ''}</span>
          </button>

          {/* Quick City Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500 uppercase">CITY:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-[#121212] border border-white/10 px-2.5 py-1 text-white focus:outline-none focus:border-white uppercase"
            >
              <option value="">ALL CITIES</option>
              {cities.map((city) => (
                <option key={city.id} value={city.slug}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-neutral-400 hover:text-white flex items-center gap-1 underline underline-offset-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>

        {/* Right: Sort By */}
        <div className="flex items-center gap-2">
          <span className="text-neutral-500 uppercase">SORT:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#121212] border border-white/10 px-3 py-1 text-white focus:outline-none focus:border-white uppercase"
          >
            <option value="newest">NEWEST RELEASE</option>
            <option value="price_asc">PRICE: LOW TO HIGH</option>
            <option value="price_desc">PRICE: HIGH TO LOW</option>
            <option value="name">ALPHABETICAL</option>
          </select>
        </div>
      </div>

      {/* Expanded Filter Panel (Collapsible) */}
      {mobileFilterOpen && (
        <div className="bg-[#111111] border border-white/10 p-6 mb-8 text-xs font-mono space-y-6 animate-in fade-in duration-200">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <span className="font-semibold uppercase tracking-widest text-white">FILTER SPECIFICATIONS</span>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Clothing Filters: Sizes & Colors */}
            {(selectedType === 'clothing' || selectedType === 'all') && (
              <>
                <div>
                  <div className="text-neutral-400 uppercase mb-2">SIZE</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                        className={`px-2.5 py-1 border ${
                          selectedSize === size
                            ? 'border-white bg-white text-black font-semibold'
                            : 'border-white/10 text-neutral-400 hover:border-white/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-400 uppercase mb-2">COLOR</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Black', 'Charcoal', 'Slate', 'White', 'Off-White', 'Sand'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                        className={`px-2.5 py-1 border ${
                          selectedColor === color
                            ? 'border-white bg-white text-black font-semibold'
                            : 'border-white/10 text-neutral-400 hover:border-white/30'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Perfume Filters: Gender, Concentration, Fragrance Family */}
            {(selectedType === 'perfume' || selectedType === 'all') && (
              <>
                <div>
                  <div className="text-neutral-400 uppercase mb-2">GENDER</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Unisex', 'Men', 'Women'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(selectedGender === g ? '' : g)}
                        className={`px-2.5 py-1 border ${
                          selectedGender === g
                            ? 'border-white bg-white text-black font-semibold'
                            : 'border-white/10 text-neutral-400 hover:border-white/30'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-neutral-400 uppercase mb-2">FRAGRANCE FAMILY</div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Woody', 'Fresh', 'Citrus', 'Floral', 'Oriental', 'Spicy', 'Musky'].map((fam) => (
                      <button
                        key={fam}
                        onClick={() =>
                          setSelectedFragranceFamily(selectedFragranceFamily === fam ? '' : fam)
                        }
                        className={`px-2.5 py-1 border ${
                          selectedFragranceFamily === fam
                            ? 'border-white bg-white text-black font-semibold'
                            : 'border-white/10 text-neutral-400 hover:border-white/30'
                        }`}
                      >
                        {fam}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Product Grid (4 columns desktop, 3 tablet, 2 mobile) */}
      {loading ? (
        <div className="py-24 text-center text-xs font-mono tracking-widest text-neutral-500 uppercase">
          LOADING ARCHIVE...
        </div>
      ) : products.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center border border-white/10 bg-[#0F0F0F] p-8 flex flex-col items-center">
          <span className="text-4xl font-serif text-white/30 mb-4 select-none" aria-hidden="true">
            {brandSymbol}
          </span>
          <h3 className="text-xl sm:text-2xl font-display font-bold tracking-widest uppercase">
            {hasActiveFilters ? 'NO MATCHING PIECES FOUND' : 'PRODUCTS COMING SOON.'}
          </h3>
          <p className="mt-2 text-xs font-mono text-neutral-500 uppercase tracking-widest max-w-md">
            {hasActiveFilters
              ? 'NO RELEASES MATCH YOUR ACTIVE CRITERIA. TRY CLEARING YOUR FILTERS.'
              : 'THE ATELIER HAS NOT YET PUBLISHED PIECES FOR THIS SELECTION.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-6 px-5 py-2.5 bg-white text-black text-xs font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors"
            >
              RESET ALL FILTERS
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
