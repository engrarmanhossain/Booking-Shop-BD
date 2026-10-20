import React from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { 
  Building2, 
  Home, 
  Table, 
  BarChart3, 
  Users, 
  Eye, 
  PlusCircle, 
  Download, 
  RotateCcw,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  onOpenAddModal, 
  onResetData, 
  onExportData,
  totalListings,
  activeLeadsCount
}) {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner - Mirsarai Economic Zone Alert */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 text-white text-xs font-medium py-1.5 px-4 text-center flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>{t('brandSubtitle')}</span>
        <span className="hidden md:inline-block bg-white/20 px-2 py-0.5 rounded-full text-[11px] font-semibold">
          {t('economicZoneBadge')}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab('listings')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">
                  {lang === 'bn' ? 'টু-লেট মীরসরাই' : 'To-Let Mirsarai'}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full border border-blue-200">
                  {lang === 'bn' ? 'পৌর ও ইউনিয়ন' : 'Mirsarai Hub'}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {lang === 'bn' ? 'বারইয়ারহাট • শিল্পনগরী • জোরারগঞ্জ • সদর' : 'Baraiyarhat • Shilpa Nagar • Zorarganj • Sadar'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setCurrentTab('listings')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'listings'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t('allListings')}</span>
              <span className="ml-1 px-1.5 py-0.2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold">
                {lang === 'bn' ? toBengaliNumerals(totalListings) : totalListings}
              </span>
            </button>

            <button
              onClick={() => setCurrentTab('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'table'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Table className="w-4 h-4" />
              <span>{t('tableView')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'analytics'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{t('analytics')}</span>
            </button>

            <button
              onClick={() => setCurrentTab('leads')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                currentTab === 'leads'
                  ? 'bg-white text-blue-600 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t('leads')}</span>
              {activeLeadsCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                  {lang === 'bn' ? toBengaliNumerals(activeLeadsCount) : activeLeadsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setCurrentTab('public')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'public'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
              title="Preview portal as an interested renter"
            >
              <Eye className="w-4 h-4" />
              <span>{t('publicPreview')}</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
              title="Switch language between Bengali and English"
            >
              <span className="text-sm">{lang === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
              <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Quick Export / Reset Tools */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={onExportData}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                title={t('exportData')}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onResetData}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title={t('resetData')}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Add Property Primary Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">{t('addListing')}</span>
              <span className="sm:hidden">{lang === 'bn' ? 'বিজ্ঞাপন' : 'Add'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="lg:hidden flex items-center justify-around py-2 border-t border-slate-100 overflow-x-auto gap-1">
          <button
            onClick={() => setCurrentTab('listings')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              currentTab === 'listings' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t('allListings')}</span>
          </button>
          <button
            onClick={() => setCurrentTab('table')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              currentTab === 'table' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>{t('tableView')}</span>
          </button>
          <button
            onClick={() => setCurrentTab('analytics')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              currentTab === 'analytics' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t('analytics')}</span>
          </button>
          <button
            onClick={() => setCurrentTab('leads')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              currentTab === 'leads' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t('leads')}</span>
          </button>
          <button
            onClick={() => setCurrentTab('public')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
              currentTab === 'public' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'text-slate-600'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{t('publicPreview')}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
