import React, { useState } from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { 
  Users, 
  PlusCircle, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Briefcase,
  Building
} from 'lucide-react';

export default function LeadsManager({ 
  leads, 
  onUpdateStatus, 
  onDeleteLead, 
  onOpenNewLeadModal,
  listings 
}) {
  const { lang, t, formatCurrency } = useLanguage();
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredLeads = leads.filter((l) => {
    if (filterStatus === 'all') return true;
    return l.status === filterStatus;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">{t('statusNew')}</span>;
      case 'contacted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">{t('statusContacted')}</span>;
      case 'viewing_scheduled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">{t('statusViewingScheduled')}</span>;
      case 'negotiating':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">{t('statusNegotiating')}</span>;
      case 'converted':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">{t('statusConverted')}</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">{t('statusCancelled')}</span>;
      default:
        return status;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Action */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-slate-900">{t('leadsTitle')}</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">{t('leadsSubtitle')}</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">{lang === 'bn' ? 'সকল স্ট্যাটাস' : 'All Statuses'}</option>
            <option value="new">{t('statusNew')}</option>
            <option value="contacted">{t('statusContacted')}</option>
            <option value="viewing_scheduled">{t('statusViewingScheduled')}</option>
            <option value="negotiating">{t('statusNegotiating')}</option>
            <option value="converted">{t('statusConverted')}</option>
            <option value="cancelled">{t('statusCancelled')}</option>
          </select>

          {/* Add Inquiry Button */}
          <button
            onClick={onOpenNewLeadModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('addNewLead')}</span>
          </button>
        </div>
      </div>

      {/* Leads List / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLeads.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">
              {lang === 'bn' ? 'কোনো ভাড়াটিয়ার অনুসন্ধান পাওয়া যায়নি' : 'No tenant inquiries recorded'}
            </p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{lead.tenantName}</h3>
                    {lead.tenantProfession && (
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{lead.tenantProfession}</span>
                      </span>
                    )}
                  </div>
                  <div>{getStatusBadge(lead.status)}</div>
                </div>

                {/* Property Interested */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs mb-3 space-y-1">
                  <div className="flex items-center gap-1.5 text-blue-700 font-semibold line-clamp-1">
                    <Building className="w-3.5 h-3.5 shrink-0" />
                    <span>{lead.propertyTitle || 'General Mirsarai Inquiry'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>{t('budget')}: <strong className="text-slate-800">{lead.budget ? formatCurrency(lead.budget) : '—'}</strong></span>
                    <span>{t('desiredMoveIn')}: <strong className="text-slate-800">{lead.desiredMoveIn || 'Immediate'}</strong></span>
                  </div>
                </div>

                {/* Notes */}
                {lead.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/60 border border-amber-100 p-2.5 rounded-xl mb-4 italic">
                    "{lead.notes}"
                  </p>
                )}
              </div>

              {/* Actions & Status Dropdown */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <label className="text-[11px] font-bold text-slate-500">{t('leadStatus')}:</label>
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                    className="text-xs font-semibold py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                  >
                    <option value="new">{t('statusNew')}</option>
                    <option value="contacted">{t('statusContacted')}</option>
                    <option value="viewing_scheduled">{t('statusViewingScheduled')}</option>
                    <option value="negotiating">{t('statusNegotiating')}</option>
                    <option value="converted">{t('statusConverted')}</option>
                    <option value="cancelled">{t('statusCancelled')}</option>
                  </select>
                </div>

                {/* Direct Call & WhatsApp Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${lead.tenantPhone}`}
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-600" />
                    <span>{lead.tenantPhone}</span>
                  </a>

                  <a
                    href={`https://wa.me/88${lead.tenantPhone.replace(/^0+/, '')}?text=${encodeURIComponent(`Assalamu Alaikum ${lead.tenantName}. Regarding your inquiry about rent in Mirsarai (${lead.propertyTitle || 'property'}). When would you like to schedule a visit?`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl transition-colors border border-emerald-200"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>

                {/* Delete button */}
                <div className="flex justify-end pt-1">
                  <button
                    onClick={() => onDeleteLead(lead.id)}
                    className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{t('delete')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
