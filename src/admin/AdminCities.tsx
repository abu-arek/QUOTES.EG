import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { City } from '../types';
import {
  MapPin,
  Plus,
  Edit,
  Trash2,
  Archive,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from 'lucide-react';

export const AdminCities: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Egypt');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [featured, setFeatured] = useState(false);
  const [activeStatus, setActiveStatus] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const data = await api.getCities(true);
      setCities(data);
    } catch (err) {
      console.error('Failed to load cities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  const openCreateModal = () => {
    setEditingCity(null);
    setName('');
    setCountry('Egypt');
    setSlug('');
    setDescription('');
    setHeroImage('');
    setFeatured(false);
    setActiveStatus(true);
    setModalOpen(true);
  };

  const openEditModal = (c: City) => {
    setEditingCity(c);
    setName(c.name);
    setCountry(c.country);
    setSlug(c.slug);
    setDescription(c.description || '');
    setHeroImage(c.heroImage || '');
    setFeatured(c.featured);
    setActiveStatus(c.activeStatus);
    setModalOpen(true);
  };

  const handleNameInput = (val: string) => {
    setName(val);
    if (!editingCity) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        setUploadingImage(true);
        const res = await api.uploadImage(e.target.files[0]);
        setHeroImage(res.url);
      } catch (err: any) {
        alert(err.message || 'Image upload failed.');
      } finally {
        setUploadingImage(false);
      }
    }
  };

  const handleSaveCity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        country: country.trim(),
        slug: slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        heroImage: heroImage.trim(),
        thumbnailImage: heroImage.trim(),
        featured,
        activeStatus,
        displayOrder: editingCity ? editingCity.displayOrder : cities.length + 1,
      };

      if (editingCity) {
        await api.updateCity(editingCity.id, payload);
      } else {
        await api.createCity(payload);
      }

      setModalOpen(false);
      fetchCities();
    } catch (err: any) {
      alert(err.message || 'Failed to save city.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCity = async (city: City) => {
    if (!window.confirm(`Are you sure you want to delete "${city.name}"?`)) return;
    try {
      const res = await api.deleteCity(city.id, false);
      if (!res.success) {
        if (window.confirm(`${res.message}\n\nForce delete and unlink all products?`)) {
          await api.deleteCity(city.id, true);
          fetchCities();
        }
      } else {
        fetchCities();
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting city.');
    }
  };

  const handleToggleStatus = async (city: City) => {
    try {
      await api.updateCity(city.id, { activeStatus: !city.activeStatus });
      fetchCities();
    } catch (err: any) {
      alert(err.message || 'Error updating status.');
    }
  };

  return (
    <div className="space-y-8 text-white text-xs font-mono">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold uppercase tracking-tight">
            URBAN METROPOLIS MANAGEMENT
          </h1>
          <p className="text-neutral-400 mt-1">
            Configure cities, architectural editorial hero photos, and regional collections.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-5 py-2.5 bg-white text-black font-semibold uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>ADD NEW CITY</span>
        </button>
      </div>

      {/* Visual City Grid */}
      {loading ? (
        <div className="py-24 text-center text-neutral-500 uppercase tracking-widest">
          LOADING METROPOLITAN REGISTRY...
        </div>
      ) : cities.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-[#121212] p-8 flex flex-col items-center">
          <span className="text-3xl font-serif text-white/30 mb-4 select-none">"</span>
          <h3 className="text-lg font-bold tracking-widest uppercase">
            0 CITIES REGISTERED (RULE 55 EMPTY STATE)
          </h3>
          <p className="mt-2 text-neutral-500 uppercase max-w-md">
            Customer store will display "CITIES COMING SOON". Once you add or seed a city, it goes live.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 px-5 py-2.5 bg-white text-black font-semibold uppercase tracking-wider"
          >
            CREATE FIRST CITY
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cities.map((city) => (
            <div
              key={city.id}
              className="bg-[#121212] border border-white/10 overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-[16/10] bg-neutral-900 border-b border-white/10 overflow-hidden">
                {city.heroImage || city.thumbnailImage ? (
                  <img
                    src={city.heroImage || city.thumbnailImage}
                    alt={city.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-serif text-white/20 text-4xl">
                    "
                  </div>
                )}

                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-[10px] bg-black/80 px-2 py-0.5 border border-white/10 uppercase text-white">
                    {city.country}
                  </span>
                  {city.featured && (
                    <span className="text-[10px] bg-white text-black font-bold px-2 py-0.5 uppercase">
                      FEATURED
                    </span>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <span
                    className={`text-[10px] px-2 py-0.5 border uppercase ${
                      city.activeStatus
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-neutral-900 text-neutral-500 border-neutral-700'
                    }`}
                  >
                    {city.activeStatus ? 'ACTIVE' : 'ARCHIVED'}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-xl font-display font-bold uppercase tracking-tight text-white">
                    {city.name}
                  </h3>
                  <div className="text-[11px] text-neutral-500 font-mono">
                    /{city.slug}
                  </div>
                </div>

                {city.description && (
                  <p className="text-neutral-400 text-xs line-clamp-2 leading-relaxed">
                    {city.description}
                  </p>
                )}

                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleStatus(city)}
                    className="text-neutral-400 hover:text-white uppercase text-[11px]"
                  >
                    {city.activeStatus ? 'DEACTIVATE' : 'ACTIVATE'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(city)}
                      className="p-1.5 text-neutral-400 hover:text-white"
                      title="Edit City"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCity(city)}
                      className="p-1.5 text-neutral-500 hover:text-red-400"
                      title="Delete City"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE / EDIT CITY MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCity}
            className="max-w-lg w-full bg-[#141414] border border-white/20 p-6 sm:p-8 space-y-5"
          >
            <h3 className="text-sm font-bold uppercase tracking-wider text-white border-b border-white/10 pb-2">
              {editingCity ? 'EDIT URBAN METROPOLIS' : 'REGISTER NEW METROPOLIS'}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-400 uppercase mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameInput(e.target.value)}
                  placeholder="e.g. Cairo"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-neutral-400 uppercase mb-1">Country *</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="Egypt"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-neutral-400 uppercase mb-1">URL Slug</label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="cairo"
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-neutral-400 uppercase mb-1">Hero / Card Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    placeholder="Image URL or upload below"
                    className="flex-1 bg-[#181818] border border-white/15 px-3 py-2 text-white text-xs"
                  />
                  <button
                    type="button"
                    disabled={uploadingImage}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-white text-black font-semibold uppercase text-[11px] hover:bg-neutral-200"
                  >
                    {uploadingImage ? '...' : 'UPLOAD'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-neutral-400 uppercase mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Raw concrete, ancient stone, and nocturnal urban energy..."
                  className="w-full bg-[#181818] border border-white/15 px-3 py-2 text-white text-xs resize-none leading-relaxed"
                />
              </div>

              <div className="col-span-2 flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="accent-white"
                  />
                  <span>FEATURE ON HOMEPAGE GRID</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={activeStatus}
                    onChange={(e) => setActiveStatus(e.target.checked)}
                    className="accent-white"
                  />
                  <span>ACTIVE / PUBLISHED</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-neutral-400 hover:text-white uppercase"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-white text-black font-semibold uppercase hover:bg-neutral-200"
              >
                {submitting ? 'SAVING...' : 'SAVE CITY'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
