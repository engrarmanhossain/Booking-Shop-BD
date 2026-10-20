import React from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { AMENITIES } from '../data/mirsaraiData';
import { 
  X, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Phone, 
  MessageSquare, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  UserCheck, 
  Building,
  Sparkles,
  Share2
} from 'lucide-react';

export default function ListingDetailModal({ listing, onClose, onInquire }) {
  const { lang, t, formatCurrency } = useLanguage();

  if (!listing) return null;

  const title = lang === 'bn' ? (listing.titleBn || listing.titleEn) : (listing.titleEn || listing.titleBn);
  const address = lang === 'bn' ? (listing.addressBn || listing.address) : (listing.address || listing.addressBn);
  const locality = lang === 'bn' ? listing.localityNameBn : listing.localityName;
  const description = lang === 'bn' ? (listing.descriptionBn || listing.description) : (listing.description || listing.descriptionBn);

  const amenityMap = AMENITIES.reduce((acc, a) => {
    acc[a.id] = lang === 'bn' ? a.labelBn : a.labelEn;
    return acc;
  }, {});

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Booking Shop BD: ${title} - ${formatCurrency(listing.rentAmount)}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(lang === 'bn' ? 'লিংক কপি করা হয়েছে!' : 'Listing link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header with image */}
        <div className="relative aspect-16/9 sm:aspect-21/9 bg-slate-900 overflow-hidden">
          <img
            src={listing.photoUrl || "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80"}
            alt={title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
          
          {/* Top Bar inside image */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-600 text-white shadow-md flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{locality}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors"
                title="Share listing"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Title & Price inside image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatCurrency(listing.rentAmount)}
              </span>
              <span className="text-xs text-slate-300 font-medium">{t('perMonth')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold leading-tight">{title}</h2>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Address & Meta */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-semibold">
                {t('availableFrom')}: {listing.availableFrom}
              </span>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold">
                {listing.status === 'available' ? (lang === 'bn' ? 'খালি আছে' : 'Available') : listing.status}
              </span>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">{t('rentAmount')}</span>
              <span className="text-base font-extrabold text-blue-700">{formatCurrency(listing.rentAmount)}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">{t('advance')}</span>
              <span className="text-base font-extrabold text-slate-800">
                {listing.advanceAmount ? formatCurrency(listing.advanceAmount) : '—'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 font-medium block">{t('serviceCharge')}</span>
              <span className="text-base font-extrabold text-slate-800">
                {listing.serviceCharge ? formatCurrency(listing.serviceCharge) : (lang === 'bn' ? 'কোনো চার্জ নেই' : 'None')}
              </span>
            </div>
          </div>

          {/* Specs Details */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {lang === 'bn' ? 'প্রপার্টির বিবরণ' : 'Property Specifications'}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">{t('bedrooms')}</span>
                <span className="text-base font-bold text-slate-900">
                  {lang === 'bn' ? toBengaliNumerals(listing.bedrooms) : listing.bedrooms} {t('beds')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">{t('baths')}</span>
                <span className="text-base font-bold text-slate-900">
                  {lang === 'bn' ? toBengaliNumerals(listing.bathrooms) : listing.bathrooms} {t('baths')}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">{t('balconies')}</span>
                <span className="text-base font-bold text-slate-900">
                  {lang === 'bn' ? toBengaliNumerals(listing.balconies) : listing.balconies}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-xs text-slate-400 block">{t('areaSize')}</span>
                <span className="text-base font-bold text-slate-900">
                  {lang === 'bn' ? toBengaliNumerals(listing.sqft) : listing.sqft} sqft
                </span>
              </div>
            </div>
          </div>

          {/* Amenities Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              {t('amenitiesLabel')}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {listing.amenities && listing.amenities.map((aId) => (
                <div key={aId} className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800 font-medium">
                  <div className="w-5 h-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{amenityMap[aId] || aId}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                {t('descriptionLabel')}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {description}
              </p>
            </div>
          )}

          {/* Landlord Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-blue-400 font-bold text-lg">
                {listing.ownerName ? listing.ownerName.charAt(0) : 'M'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base">{listing.ownerName || 'Mirsarai Landlord'}</span>
                  {listing.isVerified && (
                    <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/40 px-2 py-0.5 rounded-full font-bold">
                      {lang === 'bn' ? 'যাচাইকৃত' : 'Verified'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-300">{listing.ownerPhone}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={`tel:${listing.ownerPhone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Phone className="w-4 h-4 text-blue-600" />
                <span>{t('callNow')}</span>
              </a>

              <a
                href={`https://wa.me/${listing.ownerWhatsapp || listing.ownerPhone}?text=${encodeURIComponent(`Assalamu Alaikum. I want to inquire about: "${title}" in Mirsarai.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('whatsapp')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            {t('cancel')}
          </button>

          <button
            onClick={() => {
              onClose();
              onInquire(listing);
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('inquireNow')}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
