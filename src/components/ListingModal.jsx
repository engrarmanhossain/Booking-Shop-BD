import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { LOCALITIES, AMENITIES, PRESET_PHOTOS } from '../data/mirsaraiData';
import { X, Upload, Check, Image as ImageIcon, Sparkles } from 'lucide-react';

export default function ListingModal({ isOpen, onClose, onSave, editingListing = null }) {
  const { lang, t } = useLanguage();

  const initialForm = {
    titleEn: '',
    titleBn: '',
    localityId: 'baraiyarhat',
    address: '',
    addressBn: '',
    propertyType: 'flat',
    tenantPreference: 'family',
    rentAmount: '',
    advanceAmount: '',
    serviceCharge: '',
    bedrooms: 2,
    bathrooms: 2,
    balconies: 1,
    sqft: 1000,
    floor: '2nd Floor (২য় তলা)',
    status: 'available',
    availableFrom: 'Immediate',
    photoUrl: PRESET_PHOTOS[0].url,
    amenities: ['water_deep', 'generator_ips', 'tiles'],
    ownerName: '',
    ownerPhone: '',
    ownerWhatsapp: '',
    description: '',
    descriptionBn: '',
    isVerified: true
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingListing) {
      setFormData({
        ...initialForm,
        ...editingListing
      });
    } else {
      setFormData(initialForm);
    }
    setErrors({});
  }, [editingListing, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const toggleAmenity = (amenityId) => {
    setFormData((prev) => {
      const current = prev.amenities || [];
      const updated = current.includes(amenityId)
        ? current.filter((id) => id !== amenityId)
        : [...current, amenityId];
      return { ...prev, amenities: updated };
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.titleEn && !formData.titleBn) {
      errs.title = lang === 'bn' ? 'বিজ্ঞাপনের একটি শিরোনাম দিন' : 'Title is required';
    }
    if (!formData.rentAmount || Number(formData.rentAmount) <= 0) {
      errs.rentAmount = lang === 'bn' ? 'সঠিক ভাড়া নির্ধারণ করুন' : 'Valid rent amount required';
    }
    if (!formData.ownerPhone) {
      errs.ownerPhone = lang === 'bn' ? 'যোগাযোগের ফোন নম্বর দিন' : 'Contact phone is required';
    }
    if (!formData.address && !formData.addressBn) {
      errs.address = lang === 'bn' ? 'সুনির্দিষ্ট ঠিকানা দিন' : 'Address is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Resolve locality names
    const localityObj = LOCALITIES.find((l) => l.id === formData.localityId) || LOCALITIES[0];

    const submission = {
      ...formData,
      id: editingListing ? editingListing.id : `prop-${Date.now()}`,
      localityName: localityObj.nameEn,
      localityNameBn: localityObj.nameBn,
      rentAmount: Number(formData.rentAmount),
      advanceAmount: Number(formData.advanceAmount || 0),
      serviceCharge: Number(formData.serviceCharge || 0),
      bedrooms: Number(formData.bedrooms),
      bathrooms: Number(formData.bathrooms),
      balconies: Number(formData.balconies),
      sqft: Number(formData.sqft),
      createdAt: editingListing ? editingListing.createdAt : new Date().toISOString().split('T')[0]
    };

    onSave(submission);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col my-auto overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {editingListing ? t('editPropertyTitle') : t('addNewPropertyTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {lang === 'bn' ? 'মীরসরাই উপজেলার সকল ইউনিয়ন ও পৌরসভার অন্তর্ভুক্ত' : 'Covering all unions & municipalities of Mirsarai'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Title in Bengali & English */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('propertyTitleBn')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.titleBn}
                onChange={(e) => handleChange('titleBn', e.target.value)}
                placeholder="যেমন: বারইয়ারহাটে ৩ বেডের আধুনিক ফ্ল্যাট ভাড়া"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('propertyTitleEn')}
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => handleChange('titleEn', e.target.value)}
                placeholder="e.g. Modern 3-Bed Flat in Baraiyarhat"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
          {errors.title && <p className="text-xs text-rose-500 font-semibold">{errors.title}</p>}

          {/* Locality & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('localityLabel')} <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.localityId}
                onChange={(e) => handleChange('localityId', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              >
                {LOCALITIES.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {lang === 'bn' ? loc.nameBn : loc.nameEn} ({loc.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('addressLabel')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.addressBn || formData.address}
                onChange={(e) => {
                  handleChange('addressBn', e.target.value);
                  handleChange('address', e.target.value);
                }}
                placeholder="যেমন: কলেজ রোড, বারইয়ারহাট ডিগ্রি কলেজের পাশে"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500"
              />
              {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Pricing Row: Rent, Advance, Service Charge */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div>
              <label className="block text-xs font-bold text-blue-900 mb-1">
                {t('rentAmount')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  value={formData.rentAmount}
                  onChange={(e) => handleChange('rentAmount', e.target.value)}
                  placeholder="12000"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl font-bold focus:border-blue-500"
                />
              </div>
              {errors.rentAmount && <p className="text-xs text-rose-500 mt-1">{errors.rentAmount}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('advanceAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  value={formData.advanceAmount}
                  onChange={(e) => handleChange('advanceAmount', e.target.value)}
                  placeholder="25000"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('serviceChargeAmount')}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">৳</span>
                <input
                  type="number"
                  value={formData.serviceCharge}
                  onChange={(e) => handleChange('serviceCharge', e.target.value)}
                  placeholder="1000"
                  className="w-full pl-8 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Property Type, Tenant Preference, Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('propertyType')}
              </label>
              <select
                value={formData.propertyType}
                onChange={(e) => handleChange('propertyType', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="flat">{t('flat')}</option>
                <option value="house">{t('house')}</option>
                <option value="bachelor">{t('bachelor')}</option>
                <option value="sublet">{t('sublet')}</option>
                <option value="commercial">{t('commercial')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('tenantPreference')}
              </label>
              <select
                value={formData.tenantPreference}
                onChange={(e) => handleChange('tenantPreference', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="family">{t('family')}</option>
                <option value="bachelorMale">{t('bachelorMale')}</option>
                <option value="bachelorFemale">{t('bachelorFemale')}</option>
                <option value="executive">{t('executive')}</option>
                <option value="anyTenant">{t('anyTenant')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('statusFilter')}
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
              >
                <option value="available">{t('available')}</option>
                <option value="booked">{t('booked')}</option>
                <option value="rented">{t('rented')}</option>
              </select>
            </div>
          </div>

          {/* Numerical Specs: Beds, Baths, Balconies, Size, Floor */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('bedroomsCount')}</label>
              <input
                type="number"
                min="0"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('bathroomsCount')}</label>
              <input
                type="number"
                min="0"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('balconiesCount')}</label>
              <input
                type="number"
                min="0"
                value={formData.balconies}
                onChange={(e) => handleChange('balconies', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('areaSize')}</label>
              <input
                type="number"
                value={formData.sqft}
                onChange={(e) => handleChange('sqft', e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center font-bold"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('floor')}</label>
              <input
                type="text"
                value={formData.floor}
                onChange={(e) => handleChange('floor', e.target.value)}
                placeholder="3rd Floor"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-center"
              />
            </div>
          </div>

          {/* Photo URL & Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('photoUrlLabel')}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="url"
                value={formData.photoUrl}
                onChange={(e) => handleChange('photoUrl', e.target.value)}
                placeholder="https://..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Quick Presets */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-500 font-medium">{t('orChoosePreset')}:</span>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {PRESET_PHOTOS.map((photo, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => handleChange('photoUrl', photo.url)}
                    className={`relative rounded-xl overflow-hidden aspect-16/10 border-2 transition-all group ${
                      formData.photoUrl === photo.url ? 'border-blue-600 ring-2 ring-blue-500/30' : 'border-transparent hover:opacity-90'
                    }`}
                  >
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    {formData.photoUrl === photo.url && (
                      <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities Multi-Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('amenitiesLabel')}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMENITIES.map((item) => {
                const isSelected = formData.amenities && formData.amenities.includes(item.id);
                return (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => toggleAmenity(item.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{lang === 'bn' ? item.labelBn : item.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Landlord Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('ownerName')}</label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleChange('ownerName', e.target.value)}
                placeholder="যেমন: হাজী রফিক"
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('ownerPhone')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.ownerPhone}
                onChange={(e) => handleChange('ownerPhone', e.target.value)}
                placeholder="01819..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
              {errors.ownerPhone && <p className="text-xs text-rose-500 mt-1">{errors.ownerPhone}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{t('ownerWhatsapp')}</label>
              <input
                type="text"
                value={formData.ownerWhatsapp}
                onChange={(e) => handleChange('ownerWhatsapp', e.target.value)}
                placeholder="8801819..."
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">{t('descriptionLabel')}</label>
            <textarea
              rows="3"
              value={formData.descriptionBn || formData.description}
              onChange={(e) => {
                handleChange('descriptionBn', e.target.value);
                handleChange('description', e.target.value);
              }}
              placeholder="বাড়ি সম্পর্কিত অতিরিক্ত তথ্য, বিলের নিয়ম, যাতায়াত ইত্যাদি..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white"
            />
          </div>
        </form>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            {editingListing ? t('saveChanges') : t('createListing')}
          </button>
        </div>
      </div>
    </div>
  );
}
