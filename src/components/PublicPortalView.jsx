import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import ListingCard from './ListingCard';
import FilterBar from './FilterBar';
import { 
  Building2, 
  ArrowLeft, 
  Search, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function PublicPortalView({
  listings,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  onViewDetails,
  onInquire,
  onExitPreview
}) {
  const { lang, t } = useLanguage();

  return (
    <div className="space-y-6">
      {/* Top Notice: Previewing as Tenant */}
      <div className="bg-emerald-600 text-white p-3 sm:px-6 rounded-2xl flex items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-200" />
          <span>{t('tenantPortalNotice')}</span>
        </div>
        <button
          onClick={onExitPreview}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-50 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('backToDashboard')}</span>
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-blue-200 border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{lang === 'bn' ? 'মীরসরাইয়ের বিশ্বস্ত প্রপার্টি প্ল্যাটফর্ম' : 'Trusted Rental Platform of Mirsarai'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
            {lang === 'bn' ? 'মীরসরাইয়ে আপনার স্বপ্নের বাসা খুঁজুন সহজে' : 'Find Your Ideal Rental Home in Mirsarai'}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {lang === 'bn' 
              ? 'বারইয়ারহাট পৌরসভা, বঙ্গবন্ধু শিল্পনগরী (বেজা) এলাকা ও মীরসরাই সদরের সেরা ফ্যামিলি ফ্ল্যাট, ব্যাচেলর মেস ও কমার্শিয়াল স্পেস।' 
              : 'Best family apartments, bachelor mess rooms, and commercial office spaces across Baraiyarhat, Mirsarai Sadar, and Shilpa Nagar.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'সরাসরি বাড়িওয়ালা' : 'Direct Landlords'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'কোনো দালাল বা মিডিয়া ফি নেই' : '0% Brokerage Commission'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'সরাসরি কল ও হোয়াটসঅ্যাপ' : 'Instant Call & WhatsApp'}</span>
            </span>
          </div>
        </div>

        {/* Decorative backdrop graphics */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-blue-500/20 to-transparent pointer-events-none" />
      </div>

      {/* Filter Bar */}
      <FilterBar
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        totalResults={listings.length}
        totalCount={listings.length}
      />

      {/* Listings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            onViewDetails={onViewDetails}
            onInquire={onInquire}
            isPublicView={true}
          />
        ))}
      </div>
    </div>
  );
}
