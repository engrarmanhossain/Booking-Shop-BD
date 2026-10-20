import React from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { 
  Building, 
  CheckCircle2, 
  Wallet, 
  Users, 
  MapPin, 
  Flame,
  ArrowUpRight
} from 'lucide-react';

export default function StatsCards({ 
  listings, 
  leads, 
  filters, 
  setFilters, 
  onSelectLeadTab 
}) {
  const { lang, t, formatCurrency } = useLanguage();

  const total = listings.length;
  const availableCount = listings.filter((l) => l.status === 'available').length;
  const rentedCount = listings.filter((l) => l.status === 'rented').length;
  const bookedCount = listings.filter((l) => l.status === 'booked').length;

  const avgRent = total > 0 
    ? Math.round(listings.reduce((acc, curr) => acc + (Number(curr.rentAmount) || 0), 0) / total) 
    : 0;

  const activeLeads = leads.filter((lead) => lead.status !== 'converted' && lead.status !== 'cancelled').length;

  // Find most frequent locality
  const localityCounts = listings.reduce((acc, curr) => {
    acc[curr.localityId] = (acc[curr.localityId] || 0) + 1;
    return acc;
  }, {});
  let topLocalityName = lang === 'bn' ? 'বারইয়ারহাট' : 'Baraiyarhat';
  if (Object.keys(localityCounts).length > 0) {
    const topId = Object.entries(localityCounts).sort((a, b) => b[1] - a[1])[0][0];
    const match = listings.find((l) => l.localityId === topId);
    if (match) {
      topLocalityName = lang === 'bn' ? match.localityNameBn : match.localityName;
    }
  }

  const handleQuickFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  return (
    <div className="space-y-4">
      {/* 4 Primary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Listings */}
        <div 
          onClick={() => handleQuickFilter({ status: 'all' })}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('totalProperties')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'bn' ? toBengaliNumerals(total) : total}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {lang === 'bn' ? 'টি বিজ্ঞাপন' : 'units'}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>{lang === 'bn' ? `${toBengaliNumerals(availableCount)} খালি` : `${availableCount} available`}</span>
            <span>•</span>
            <span className="inline-block w-2 h-2 rounded-full bg-slate-400"></span>
            <span>{lang === 'bn' ? `${toBengaliNumerals(rentedCount)} ভাড়া` : `${rentedCount} rented`}</span>
          </div>
        </div>

        {/* Card 2: Available Units */}
        <div 
          onClick={() => handleQuickFilter({ status: 'available' })}
          className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
            filters.status === 'available'
              ? 'bg-emerald-50/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30'
              : 'bg-white border-slate-200/90 shadow-xs hover:border-emerald-400 hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              {t('availableUnits')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
              {lang === 'bn' ? toBengaliNumerals(availableCount) : availableCount}
            </span>
            <span className="text-xs text-emerald-700 font-medium">
              {lang === 'bn' ? 'খালি ফ্ল্যাট/রুম' : 'vacant units'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <span>{lang === 'bn' ? 'এখনই ওঠার জন্য প্রস্তুত' : 'Ready for move-in'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>

        {/* Card 3: Average Rent in Mirsarai */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('avgRent')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-indigo-950 tracking-tight">
              {formatCurrency(avgRent)}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {t('perMonth')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-indigo-500" />
            <span>{lang === 'bn' ? `মূল হাব: ${topLocalityName}` : `Top area: ${topLocalityName}`}</span>
          </div>
        </div>

        {/* Card 4: Tenant Inquiries / Leads */}
        <div 
          onClick={onSelectLeadTab}
          className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {t('activeInquiries')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {lang === 'bn' ? toBengaliNumerals(activeLeads) : activeLeads}
            </span>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">
              {lang === 'bn' ? 'আগ্রহী ভাড়াটিয়া' : 'hot leads'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-medium flex items-center gap-1 group-hover:underline">
            <span>{lang === 'bn' ? 'সকল অনুসন্ধান পরিচালনা করুন' : 'Manage inquiries'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Quick Filter Pill Shortcuts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar text-xs">
        <span className="text-slate-400 font-semibold flex items-center gap-1 whitespace-nowrap pl-1">
          <Flame className="w-3.5 h-3.5 text-amber-500" />
          {lang === 'bn' ? 'জনপ্রিয় ফিল্টার:' : 'Quick filters:'}
        </span>

        <button
          onClick={() => handleQuickFilter({ locality: 'baraiyarhat' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.locality === 'baraiyarhat'
              ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'bn' ? 'বারইয়ারহাট' : 'Baraiyarhat'}
        </button>

        <button
          onClick={() => handleQuickFilter({ locality: 'beza_economic_zone' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.locality === 'beza_economic_zone'
              ? 'bg-emerald-600 text-white border-emerald-600 font-medium shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70'
          }`}
        >
          {lang === 'bn' ? 'বঙ্গবন্ধু শিল্পনগর (BEZA)' : 'Economic Zone (BEZA)'}
        </button>

        <button
          onClick={() => handleQuickFilter({ tenant: 'family' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.tenant === 'family'
              ? 'bg-indigo-600 text-white border-indigo-600 font-medium shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'bn' ? 'পরিবার / ফ্যামিলি' : 'Family Only'}
        </button>

        <button
          onClick={() => handleQuickFilter({ tenant: 'bachelorMale' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.tenant === 'bachelorMale'
              ? 'bg-indigo-600 text-white border-indigo-600 font-medium shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'bn' ? 'ব্যাচেলর মেস' : 'Bachelor Mess'}
        </button>

        <button
          onClick={() => handleQuickFilter({ maxRent: '8000' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.maxRent === '8000'
              ? 'bg-purple-600 text-white border-purple-600 font-medium shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'bn' ? '৳ ৮,০০০ এর নিচে' : 'Under ৳8,000'}
        </button>

        <button
          onClick={() => handleQuickFilter({ bedrooms: '3' })}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors border ${
            filters.bedrooms === '3'
              ? 'bg-blue-600 text-white border-blue-600 font-medium shadow-xs'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          {lang === 'bn' ? '৩ বেডরুম' : '3 Bedrooms'}
        </button>

        {(filters.search || filters.locality !== 'all' || filters.propertyType !== 'all' || filters.tenant !== 'all' || filters.status !== 'all' || filters.bedrooms !== 'all' || filters.minRent || filters.maxRent) && (
          <button
            onClick={() => setFilters({
              search: '',
              locality: 'all',
              propertyType: 'all',
              tenant: 'all',
              status: 'all',
              bedrooms: 'all',
              minRent: '',
              maxRent: '',
              amenities: []
            })}
            className="px-2.5 py-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full font-bold whitespace-nowrap"
          >
            {t('clearFilters')} ✕
          </button>
        )}
      </div>
    </div>
  );
}
