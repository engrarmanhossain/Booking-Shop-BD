import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LOCALITIES, AMENITIES } from '../data/mirsaraiData';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Home, 
  Users, 
  BedDouble, 
  X, 
  Check,
  ArrowUpDown
} from 'lucide-react';

export default function FilterBar({ 
  filters, 
  setFilters, 
  sortBy, 
  setSortBy, 
  totalResults, 
  totalCount 
}) {
  const { lang, t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (amenityId) => {
    setFilters((prev) => {
      const current = prev.amenities || [];
      const updated = current.includes(amenityId)
        ? current.filter((id) => id !== amenityId)
        : [...current, amenityId];
      return { ...prev, amenities: updated };
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      locality: 'all',
      propertyType: 'all',
      tenant: 'all',
      status: 'all',
      bedrooms: 'all',
      minRent: '',
      maxRent: '',
      amenities: []
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.locality !== 'all' || 
    filters.propertyType !== 'all' || 
    filters.tenant !== 'all' || 
    filters.status !== 'all' || 
    filters.bedrooms !== 'all' || 
    filters.minRent || 
    filters.maxRent || 
    (filters.amenities && filters.amenities.length > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 space-y-3">
      {/* Primary Row: Search Bar & Quick Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5">
        {/* Search Input */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleFilterChange('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Locality Selector in Mirsarai */}
        <div className="md:col-span-3 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4" />
          </div>
          <select
            value={filters.locality}
            onChange={(e) => handleFilterChange('locality', e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="all">{t('allLocalities')}</option>
            {LOCALITIES.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {lang === 'bn' ? loc.nameBn : loc.nameEn}
              </option>
            ))}
          </select>
        </div>

        {/* Property Type Dropdown */}
        <div className="md:col-span-3 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Home className="w-4 h-4" />
          </div>
          <select
            value={filters.propertyType}
            onChange={(e) => handleFilterChange('propertyType', e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-colors cursor-pointer appearance-none"
          >
            <option value="all">{t('allTypes')}</option>
            <option value="flat">{t('flat')}</option>
            <option value="house">{t('house')}</option>
            <option value="bachelor">{t('bachelor')}</option>
            <option value="sublet">{t('sublet')}</option>
            <option value="commercial">{t('commercial')}</option>
          </select>
        </div>

        {/* Advanced Filters Toggle & Sort */}
        <div className="md:col-span-2 flex items-center gap-1.5">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
              showAdvanced || (filters.amenities && filters.amenities.length > 0)
                ? 'bg-blue-50 border-blue-300 text-blue-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'ফিল্টার' : 'Filters'}</span>
            {filters.amenities && filters.amenities.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] flex items-center justify-center font-bold">
                {filters.amenities.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="pt-3 border-t border-slate-100 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Tenant Preference */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t('tenantPreference')}
              </label>
              <select
                value={filters.tenant}
                onChange={(e) => handleFilterChange('tenant', e.target.value)}
                className="w-full p-2 bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">{t('allTenants')}</option>
                <option value="family">{t('family')}</option>
                <option value="bachelorMale">{t('bachelorMale')}</option>
                <option value="bachelorFemale">{t('bachelorFemale')}</option>
                <option value="executive">{t('executive')}</option>
                <option value="anyTenant">{t('anyTenant')}</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t('bedrooms')}
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full p-2 bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">{t('anyBeds')}</option>
                <option value="1">1 {t('beds')}</option>
                <option value="2">2 {t('beds')}</option>
                <option value="3">3 {t('beds')}</option>
                <option value="4">4+ {t('beds')}</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t('statusFilter')}
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">{t('allStatus')}</option>
                <option value="available">{t('available')}</option>
                <option value="booked">{t('booked')}</option>
                <option value="rented">{t('rented')}</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {t('minRent')} - {t('maxRent')} (৳)
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  placeholder="Min ৳"
                  value={filters.minRent}
                  onChange={(e) => handleFilterChange('minRent', e.target.value)}
                  className="w-1/2 p-2 bg-slate-50 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
                <span className="text-slate-400">-</span>
                <input
                  type="number"
                  placeholder="Max ৳"
                  value={filters.maxRent}
                  onChange={(e) => handleFilterChange('maxRent', e.target.value)}
                  className="w-1/2 p-2 bg-slate-50 text-xs border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Amenities Multi-Checkboxes */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">
              {t('amenitiesLabel')}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AMENITIES.map((item) => {
                const isSelected = filters.amenities && filters.amenities.includes(item.id);
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleAmenity(item.id)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white font-medium shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar: Results Count, Sort Dropdown & Reset */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
        <div>
          <span>{t('showingResults', { count: totalResults, total: totalCount })}</span>
        </div>

        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 px-2 py-1 rounded-md hover:bg-rose-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t('clearFilters')}</span>
            </button>
          )}

          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none cursor-pointer text-xs"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="rentLow">{t('sortRentLow')}</option>
              <option value="rentHigh">{t('sortRentHigh')}</option>
              <option value="sizeHigh">{t('sortSizeHigh')}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
