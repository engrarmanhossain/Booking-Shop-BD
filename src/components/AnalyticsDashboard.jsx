import React from 'react';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { LOCALITIES } from '../data/mirsaraiData';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Building2, 
  Users, 
  Compass, 
  Sparkles, 
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

export default function AnalyticsDashboard({ listings, leads }) {
  const { lang, t, formatCurrency } = useLanguage();

  // 1. Average Rent by Locality Data
  const localityRentData = LOCALITIES.map((loc) => {
    const matched = listings.filter((l) => l.localityId === loc.id);
    const avg = matched.length > 0
      ? Math.round(matched.reduce((acc, c) => acc + (Number(c.rentAmount) || 0), 0) / matched.length)
      : 0;
    return {
      name: lang === 'bn' ? loc.nameBn.split(' ')[0] : loc.nameEn.split(' ')[0],
      fullName: lang === 'bn' ? loc.nameBn : loc.nameEn,
      avgRent: avg,
      count: matched.length
    };
  }).filter((d) => d.count > 0 || d.avgRent > 0);

  // 2. Property Distribution by Type
  const typeCounts = listings.reduce((acc, l) => {
    acc[l.propertyType] = (acc[l.propertyType] || 0) + 1;
    return acc;
  }, {});

  const typeLabels = {
    flat: lang === 'bn' ? 'ফ্ল্যাট' : 'Apartment',
    house: lang === 'bn' ? 'স্বতন্ত্র বাড়ি' : 'House',
    bachelor: lang === 'bn' ? 'মেস রুম' : 'Bachelor',
    sublet: lang === 'bn' ? 'সাবলেট' : 'Sublet',
    commercial: lang === 'bn' ? 'দোকান/অফিস' : 'Commercial'
  };

  const propertyTypeData = Object.entries(typeCounts).map(([type, count]) => ({
    name: typeLabels[type] || type,
    value: count
  }));

  // 3. Occupancy Status
  const statusCounts = {
    available: listings.filter((l) => l.status === 'available').length,
    rented: listings.filter((l) => l.status === 'rented').length,
    booked: listings.filter((l) => l.status === 'booked').length,
  };

  const occupancyRate = listings.length > 0
    ? Math.round(((statusCounts.rented + statusCounts.booked) / listings.length) * 100)
    : 0;

  const occupancyPieData = [
    { name: lang === 'bn' ? 'খালি আছে' : 'Available', value: statusCounts.available, color: '#10b981' },
    { name: lang === 'bn' ? 'ভাড়া সম্পন্ন' : 'Rented', value: statusCounts.rented, color: '#64748b' },
    { name: lang === 'bn' ? 'বুকিং' : 'Booked', value: statusCounts.booked, color: '#f59e0b' }
  ].filter((d) => d.value > 0);

  // 4. Tenant Type Preferences
  const tenantPrefCounts = listings.reduce((acc, l) => {
    acc[l.tenantPreference] = (acc[l.tenantPreference] || 0) + 1;
    return acc;
  }, {});

  const tenantLabels = {
    family: lang === 'bn' ? 'পরিবার' : 'Family',
    bachelorMale: lang === 'bn' ? 'ব্যাচেলর (পুরুষ)' : 'Bachelor (M)',
    bachelorFemale: lang === 'bn' ? 'মহিলা মেস' : 'Female Mess',
    executive: lang === 'bn' ? 'কর্মকর্তা (BEZA)' : 'BEZA Executive',
    anyTenant: lang === 'bn' ? 'যেকোনো' : 'Any'
  };

  const tenantData = Object.entries(tenantPrefCounts).map(([k, count]) => ({
    name: tenantLabels[k] || k,
    count
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-xs font-bold text-blue-300 mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'মীরসরাই হাউজিং মার্কেট ট্রেন্ড' : 'Mirsarai Housing Market Trends'}</span>
          </div>
          <h2 className="text-2xl font-black mb-2">{t('analyticsTitle')}</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            {t('analyticsSubtitle')}
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Building2 className="w-72 h-72 text-white" />
        </div>
      </div>

      {/* Grid of Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Average Rent by Locality */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{t('avgRentByArea')}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'bn' ? 'বিভিন্ন ইউনিয়নে মাসিক গড় বাসা ও রুম ভাড়া' : 'Average monthly rent across Mirsarai areas'}
            </p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localityRentData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis 
                  dataKey="name" 
                  angle={-20} 
                  textAnchor="end" 
                  interval={0} 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(val) => [formatCurrency(val), lang === 'bn' ? 'গড় ভাড়া' : 'Avg Rent']} 
                  labelFormatter={(name, items) => items[0]?.payload?.fullName || name}
                  contentStyle={{ borderRadius: '12px', fontSize: '12px', borderColor: '#e2e8f0' }}
                />
                <Bar dataKey="avgRent" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Property Type Breakdown (Pie) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{t('listingsByPropType')}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'bn' ? 'ফ্ল্যাট, বাড়ি, মেস ও বাণিজ্যিক স্পেসের ভাগ' : 'Breakdown of properties by category'}
            </p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Occupancy Status Gauge */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{t('occupancyRateTitle')}</h3>
              <p className="text-xs text-slate-500">{t('occupancyRateNote')}</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-indigo-700">
                {lang === 'bn' ? toBengaliNumerals(occupancyRate) : occupancyRate}%
              </span>
              <span className="text-xs text-slate-400 block font-medium">Occupancy</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 mb-4 overflow-hidden flex">
            <div 
              style={{ width: `${(statusCounts.rented / listings.length) * 100}%` }} 
              className="bg-slate-500 h-full" 
              title="Rented"
            />
            <div 
              style={{ width: `${(statusCounts.booked / listings.length) * 100}%` }} 
              className="bg-amber-400 h-full" 
              title="Booked"
            />
            <div 
              style={{ width: `${(statusCounts.available / listings.length) * 100}%` }} 
              className="bg-emerald-500 h-full" 
              title="Available"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
              <span className="block font-bold text-base">
                {lang === 'bn' ? toBengaliNumerals(statusCounts.available) : statusCounts.available}
              </span>
              <span>{lang === 'bn' ? 'খালি আছে' : 'Available'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
              <span className="block font-bold text-base">
                {lang === 'bn' ? toBengaliNumerals(statusCounts.booked) : statusCounts.booked}
              </span>
              <span>{lang === 'bn' ? 'বুকিং' : 'Booked'}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200">
              <span className="block font-bold text-base">
                {lang === 'bn' ? toBengaliNumerals(statusCounts.rented) : statusCounts.rented}
              </span>
              <span>{lang === 'bn' ? 'ভাড়া শেষ' : 'Rented'}</span>
            </div>
          </div>
        </div>

        {/* Chart 4: Tenant Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-1">{t('listingsByTenantPref')}</h3>
            <p className="text-xs text-slate-500 mb-4">
              {lang === 'bn' ? 'পরিবার বনাম ব্যাচেলর ও শিল্পনগরীর কর্মকর্তা' : 'Tenant audience targeting'}
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tenantData} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip contentStyle={{ borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Key Mirsarai Market Takeaways */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-slate-900 text-base">{t('marketTakeawayTitle')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-blue-700 block text-sm">
              {lang === 'bn' ? '১. বেজা শিল্পনগরীর প্রভাব' : '1. BEZA Economic Zone'}
            </span>
            <p className="text-slate-600 leading-relaxed">{t('insight1')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-indigo-700 block text-sm">
              {lang === 'bn' ? '২. বারইয়ারহাটের ফ্ল্যাট চাহিদা' : '2. Baraiyarhat Hub'}
            </span>
            <p className="text-slate-600 leading-relaxed">{t('insight2')}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-bold text-emerald-700 block text-sm">
              {lang === 'bn' ? '৩. মেস ও সাশ্রয়ী রুমের গতি' : '3. Bachelor & Budget Turnaround'}
            </span>
            <p className="text-slate-600 leading-relaxed">{t('insight3')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
