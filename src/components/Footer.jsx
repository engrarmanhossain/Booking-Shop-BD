import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Building2, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ onSelectLocality }) {
  const { lang, t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: About */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <Building2 className="w-5 h-5 text-blue-500" />
              <span>{lang === 'bn' ? 'বুকিং শপ বিডি' : 'Booking Shop BD'}</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              {lang === 'bn'
                ? 'মীরসরাই উপজেলা ও বঙ্গবন্ধু শিল্পনগরী (বেজা) অঞ্চলের বাড়ি ও ফ্ল্যাট ভাড়ার আধুনিক ড্যাশবোর্ড ও লিস্টিং সিস্টেম।'
                : 'Modern house rental dashboard and tenant management hub for Mirsarai Upazila & Bangabandhu Economic Zone.'}
            </p>
          </div>

          {/* Col 2: Major Rental Hubs */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'প্রধান ভাড়ার এলাকা' : 'Key Rental Hubs'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectLocality('baraiyarhat')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• বারইয়ারহাট পৌরসভা' : '• Baraiyarhat Municipality'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('beza_economic_zone')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• বঙ্গবন্ধু শিল্পনগরী (বেজা)' : '• Bangabandhu Economic Zone'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('mirsarai_sadar')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• মীরসরাই সদর পৌরসভা' : '• Mirsarai Sadar'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('zorarganj')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• জোরারগঞ্জ বাজার' : '• Zorarganj Bazar'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Unions */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'অন্যান্য ইউনিয়ন' : 'Other Unions'}
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectLocality('mithachhara')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• মিঠাচছড়া বাজার' : '• Mithachhara Bazar'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('abu_torab')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• আবু তোরাব বাজার (মায়ানী)' : '• Abu Torab (Mayani)'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('karerhat')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• করেরহাট' : '• Karerhat'}
                </button>
              </li>
              <li>
                <button onClick={() => onSelectLocality('saherkhali')} className="hover:text-blue-400 transition-colors">
                  {lang === 'bn' ? '• সাহেরখালী ও মঘাদিয়া' : '• Saherkhali & Moghadia'}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              {lang === 'bn' ? 'জরুরি ও সহায়তা' : 'Local Assistance'}
            </h4>
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-1 text-[11px]">
              <span className="text-slate-300 font-semibold block">
                {lang === 'bn' ? 'মীরসরাই উপজেলা সহায়তা' : 'Mirsarai Upazila Info'}
              </span>
              <p className="text-slate-400">
                {lang === 'bn' ? 'চট্টগ্রাম জেলা, বাংলাদেশ' : 'Chattogram District, Bangladesh'}
              </p>
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold pt-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? '১০০% দালালমুক্ত সেবা' : 'Verified Direct Listings'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-xs">
          <div>
            © {new Date().getFullYear()} Booking Shop BD (বুকিং শপ বিডি). All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Built for the people of Mirsarai</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
