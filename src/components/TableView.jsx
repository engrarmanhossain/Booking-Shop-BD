import React, { useState } from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { 
  Edit3, 
  Trash2, 
  Eye, 
  Phone, 
  MapPin, 
  CheckCircle, 
  ArrowUpDown,
  Search,
  ExternalLink
} from 'lucide-react';

export default function TableView({ 
  listings, 
  onViewDetails, 
  onEdit, 
  onDelete, 
  onToggleStatus 
}) {
  const { lang, t, formatCurrency } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = listings.filter((l) => {
    const text = `${l.titleEn} ${l.titleBn} ${l.localityName} ${l.localityNameBn} ${l.ownerPhone} ${l.ownerName}`.toLowerCase();
    return text.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Table Header & Quick Search */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">{t('tableView')}</h3>
          <p className="text-xs text-slate-500">
            {lang === 'bn' ? `মোট ${toBengaliNumerals(filtered.length)} টি প্রপার্টি তালিকাভুক্ত` : `Total ${filtered.length} properties listed`}
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">{t('propertyTitle')}</th>
              <th className="py-3 px-3">{t('localityLabel')}</th>
              <th className="py-3 px-3">{t('propertyType')}</th>
              <th className="py-3 px-3">{t('rentAmount')}</th>
              <th className="py-3 px-3">{t('bedrooms')} / {t('baths')}</th>
              <th className="py-3 px-3 text-center">{t('statusFilter')}</th>
              <th className="py-3 px-3">{t('contactOwner')}</th>
              <th className="py-3 px-4 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-8 text-center text-slate-400">
                  {lang === 'bn' ? 'কোনো প্রপার্টি পাওয়া যায়নি' : 'No properties found matching criteria'}
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const title = lang === 'bn' ? (item.titleBn || item.titleEn) : (item.titleEn || item.titleBn);
                const locality = lang === 'bn' ? item.localityNameBn : item.localityName;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Property Thumbnail & Title */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.photoUrl}
                          alt={title}
                          className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200"
                        />
                        <div className="max-w-xs">
                          <span 
                            onClick={() => onViewDetails(item)}
                            className="font-bold text-slate-900 hover:text-blue-600 cursor-pointer line-clamp-1 text-xs"
                          >
                            {title}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {lang === 'bn' ? item.addressBn || item.address : item.address}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Locality */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md text-[11px]">
                        {locality}
                      </span>
                    </td>

                    {/* Type */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600 capitalize">
                      {item.propertyType}
                    </td>

                    {/* Rent */}
                    <td className="py-3 px-3 whitespace-nowrap font-bold text-blue-700">
                      {formatCurrency(item.rentAmount)}
                    </td>

                    {/* Beds / Baths */}
                    <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                      {lang === 'bn' 
                        ? `${toBengaliNumerals(item.bedrooms)} বেড / ${toBengaliNumerals(item.bathrooms)} বাথ`
                        : `${item.bedrooms} Bed / ${item.bathrooms} Bath`}
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onToggleStatus(item.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${
                          item.status === 'available'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                            : item.status === 'booked'
                            ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                        }`}
                        title="Click to toggle status"
                      >
                        {item.status === 'available' && (lang === 'bn' ? 'খালি' : 'Available')}
                        {item.status === 'booked' && (lang === 'bn' ? 'বুকড' : 'Booked')}
                        {item.status === 'rented' && (lang === 'bn' ? 'ভাড়া শেষ' : 'Rented')}
                      </button>
                    </td>

                    {/* Landlord Contact */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="text-slate-800 font-medium">{item.ownerName || 'Owner'}</div>
                      <a href={`tel:${item.ownerPhone}`} className="text-[11px] text-blue-600 hover:underline">
                        {item.ownerPhone}
                      </a>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewDetails(item)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t('viewDetails')}
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title={t('edit')}
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
