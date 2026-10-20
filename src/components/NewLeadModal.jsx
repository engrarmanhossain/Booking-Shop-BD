import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { X, UserPlus, Building, Phone, Calendar } from 'lucide-react';

export default function NewLeadModal({ 
  isOpen, 
  onClose, 
  onSave, 
  listings, 
  preselectedListing = null 
}) {
  const { lang, t } = useLanguage();
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    tenantName: '',
    tenantPhone: '',
    tenantProfession: '',
    propertyId: '',
    propertyTitle: '',
    budget: '',
    desiredMoveIn: 'Immediate',
    status: 'new',
    notes: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        tenantName: currentUser ? currentUser.name : '',
        tenantPhone: currentUser ? (currentUser.phone || currentUser.email) : '',
        tenantProfession: '',
        propertyId: preselectedListing ? preselectedListing.id : (listings[0]?.id || ''),
        propertyTitle: preselectedListing ? (lang === 'bn' ? preselectedListing.titleBn : preselectedListing.titleEn) : '',
        budget: preselectedListing ? preselectedListing.rentAmount : '',
        desiredMoveIn: 'Immediate',
        status: 'new',
        notes: ''
      });
      setError('');
    }
  }, [isOpen, preselectedListing, currentUser, listings, lang]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.tenantName || !formData.tenantPhone) {
      setError(lang === 'bn' ? 'দয়া করে নাম ও ফোন নম্বর দিন' : 'Please provide name and phone number');
      return;
    }

    // Resolve property title
    const selectedProp = listings.find((l) => l.id === formData.propertyId);
    const resolvedTitle = selectedProp 
      ? (lang === 'bn' ? selectedProp.titleBn : selectedProp.titleEn) 
      : formData.propertyTitle || 'General Inquiry';

    onSave({
      ...formData,
      id: `lead-${Date.now()}`,
      propertyTitle: resolvedTitle,
      budget: Number(formData.budget) || 0,
      createdAt: new Date().toISOString().split('T')[0]
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg my-auto overflow-hidden animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('addNewLead')}</h2>
              <p className="text-xs text-slate-500">{lang === 'bn' ? 'ভাড়াটিয়ার যোগাযোগের তথ্য সংরক্ষণ করুন' : 'Record renter inquiry'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-xs text-rose-500 font-bold bg-rose-50 p-2 rounded-lg">{error}</p>}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('tenantName')} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.tenantName}
              onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
              placeholder="যেমন: তারেক হাসান"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tenantPhone')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.tenantPhone}
                onChange={(e) => setFormData({ ...formData, tenantPhone: e.target.value })}
                placeholder="01822334455"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tenantProfession')}
              </label>
              <input
                type="text"
                value={formData.tenantProfession}
                onChange={(e) => setFormData({ ...formData, tenantProfession: e.target.value })}
                placeholder="যেমন: ইঞ্জিনিয়ার, বেজা শিল্পনগর"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('interestedProperty')}
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
            >
              <option value="">{lang === 'bn' ? 'সাধারণ অনুসন্ধান (কোনো নির্দিষ্ট প্রপার্টি নয়)' : 'General Inquiry'}</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {lang === 'bn' ? (l.titleBn || l.titleEn) : (l.titleEn || l.titleBn)} - {l.rentAmount}৳
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('budget')} (৳)
              </label>
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="10000"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('desiredMoveIn')}
              </label>
              <input
                type="text"
                value={formData.desiredMoveIn}
                onChange={(e) => setFormData({ ...formData, desiredMoveIn: e.target.value })}
                placeholder="যেমন: ১লা নভেম্বর"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('notes')}
            </label>
            <textarea
              rows="2"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="আগ্রহীর বিশেষ কোনো চাহিদা (যেমন: ওয়াইফাই, গাড়ি পার্কিং)..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all"
            >
              {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
