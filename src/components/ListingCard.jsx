import React from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { AMENITIES } from '../data/mirsaraiData';
import { 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Phone, 
  MessageSquare, 
  CheckCircle, 
  Calendar, 
  Edit3, 
  Trash2, 
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function ListingCard({ 
  listing, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onInquire,
  isPublicView = false 
}) {
  const { lang, t, formatCurrency } = useLanguage();

  const title = lang === 'bn' ? (listing.titleBn || listing.titleEn) : (listing.titleEn || listing.titleBn);
  const address = lang === 'bn' ? (listing.addressBn || listing.address) : (listing.address || listing.addressBn);
  const locality = lang === 'bn' ? listing.localityNameBn : listing.localityName;

  // Status color styling
  const statusStyles = {
    available: 'bg-emerald-500/10 text-emerald-700 border-emerald-300 ring-1 ring-emerald-500/20',
    booked: 'bg-amber-500/10 text-amber-700 border-amber-300 ring-1 ring-amber-500/20',
    rented: 'bg-slate-500/10 text-slate-700 border-slate-300 ring-1 ring-slate-500/20'
  };

  // Tenant preference label
  const getTenantLabel = (pref) => {
    switch(pref) {
      case 'family': return lang === 'bn' ? 'পরিবার' : 'Family';
      case 'bachelorMale': return lang === 'bn' ? 'ব্যাচেলর (পুরুষ)' : 'Bachelor (M)';
      case 'bachelorFemale': return lang === 'bn' ? 'ব্যাচেলর (মহিলা)' : 'Bachelor (F)';
      case 'executive': return lang === 'bn' ? 'কর্মকর্তা / ইঞ্জিনিয়ার' : 'Executive';
      default: return lang === 'bn' ? 'যেকোনো' : 'Any';
    }
  };

  // Property type label
  const getPropertyTypeLabel = (type) => {
    switch(type) {
      case 'flat': return lang === 'bn' ? 'ফ্ল্যাট' : 'Flat';
      case 'house': return lang === 'bn' ? 'বাড়ি' : 'House';
      case 'bachelor': return lang === 'bn' ? 'মেস রুম' : 'Mess Room';
      case 'sublet': return lang === 'bn' ? 'সাবলেট' : 'Sublet';
      case 'commercial': return lang === 'bn' ? 'কমার্সিয়াল' : 'Commercial';
      default: return type;
    }
  };

  const amenityMap = AMENITIES.reduce((acc, a) => {
    acc[a.id] = lang === 'bn' ? a.labelBn : a.labelEn;
    return acc;
  }, {});

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col group">
      {/* Card Image Banner */}
      <div className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onViewDetails(listing)}>
        <img
          src={listing.photoUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Top Floating Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Status Pill */}
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${statusStyles[listing.status] || statusStyles.available} pointer-events-auto`}>
              {listing.status === 'available' && (lang === 'bn' ? 'খালি আছে' : 'Available')}
              {listing.status === 'booked' && (lang === 'bn' ? 'বুকিং হয়েছে' : 'Booked')}
              {listing.status === 'rented' && (lang === 'bn' ? 'ভাড়া হয়ে গেছে' : 'Rented')}
            </span>

            {/* Property Type */}
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-black/60 text-white backdrop-blur-md pointer-events-auto">
              {getPropertyTypeLabel(listing.propertyType)}
            </span>
          </div>

          {/* Verified Badge */}
          {listing.isVerified && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-600 text-white shadow-xs pointer-events-auto">
              <CheckCircle className="w-3 h-3" />
              <span>{lang === 'bn' ? 'যাচাইকৃত' : 'Verified'}</span>
            </span>
          )}
        </div>

        {/* Price Tag Overlay at Bottom of Photo */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-white px-3 py-1.5 rounded-xl flex items-baseline gap-1.5 shadow-md">
          <span className="text-lg font-black tracking-tight text-emerald-400">
            {formatCurrency(listing.rentAmount)}
          </span>
          <span className="text-[11px] text-slate-300 font-medium">{t('perMonth')}</span>
        </div>

        {/* Tenant Preference Tag on bottom right */}
        <div className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-xs">
          {getTenantLabel(listing.tenantPreference)}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Locality & Address */}
          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-semibold mb-1">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-blue-600" />
            <span className="truncate">{locality}</span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onViewDetails(listing)}
            className="font-bold text-slate-900 text-base leading-snug line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer mb-2"
          >
            {title}
          </h3>

          <p className="text-xs text-slate-500 truncate mb-3">
            {address}
          </p>

          {/* Property Key Specs Grid */}
          <div className="grid grid-cols-4 gap-1 py-2 px-2.5 bg-slate-50 rounded-xl text-center border border-slate-100 mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">{t('beds')}</span>
              <span className="text-xs font-bold text-slate-800">
                {lang === 'bn' ? toBengaliNumerals(listing.bedrooms) : listing.bedrooms}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">{t('baths')}</span>
              <span className="text-xs font-bold text-slate-800">
                {lang === 'bn' ? toBengaliNumerals(listing.bathrooms) : listing.bathrooms}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">{t('sqft')}</span>
              <span className="text-xs font-bold text-slate-800">
                {lang === 'bn' ? toBengaliNumerals(listing.sqft) : listing.sqft}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-medium">{t('floor')}</span>
              <span className="text-xs font-bold text-slate-800 truncate block">
                {listing.floor ? listing.floor.split(' ')[0] : '—'}
              </span>
            </div>
          </div>

          {/* Selected Amenities Pills (Preview 2) */}
          {listing.amenities && listing.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {listing.amenities.slice(0, 2).map((aId) => (
                <span key={aId} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[140px]">
                  ✓ {amenityMap[aId] || aId}
                </span>
              ))}
              {listing.amenities.length > 2 && (
                <span className="text-[11px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                  +{listing.amenities.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Card Footer: Action Buttons */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {/* Quick Landlord Status Toggle (Non-Public View) */}
          {!isPublicView && (
            <div className="flex items-center justify-between text-xs pb-1">
              <span className="text-slate-400 font-medium">{t('statusFilter')}:</span>
              <button
                onClick={() => onToggleStatus(listing.id)}
                className={`text-xs font-bold px-2 py-0.5 rounded-md border transition-colors ${
                  listing.status === 'available'
                    ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle between Available and Rented status"
              >
                {listing.status === 'available' ? (lang === 'bn' ? '✓ খালি আছে' : '✓ Available') : (lang === 'bn' ? 'ভাড়া হয়ে গেছে' : 'Occupied')}
              </button>
            </div>
          )}

          {/* Contact Landlord CTA Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${listing.ownerPhone}`}
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('callNow')}</span>
            </a>

            <a
              href={`https://wa.me/${listing.ownerWhatsapp || listing.ownerPhone}?text=${encodeURIComponent(`Assalamu Alaikum. I am interested in your property in Mirsarai: "${title}" (Rent: ${listing.rentAmount} BDT). Is it currently available?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors border border-emerald-200"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('whatsapp')}</span>
            </a>
          </div>

          {/* Admin / Landlord controls or Public Inquire */}
          {isPublicView ? (
            <button
              onClick={() => onInquire(listing)}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              <span>{t('inquireNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center justify-between pt-1 text-slate-400">
              <button
                onClick={() => onViewDetails(listing)}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                <span>{t('viewDetails')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(listing)}
                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title={t('edit')}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDelete(listing.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title={t('delete')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
