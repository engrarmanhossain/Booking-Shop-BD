import React, { useState } from 'react';
import { useAuth, DEFAULT_ADMIN } from '../context/AuthContext';
import { useLanguage, toBengaliNumerals } from '../context/LanguageContext';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Compass,
  KeyRound,
  EyeIcon
} from 'lucide-react';

export default function LoginPage({ onEnterAsGuest, onSuccess }) {
  const { login, register, quickAdminLogin } = useAuth();
  const { lang, toggleLang, t } = useLanguage();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('landlord'); // 'landlord' | 'renter'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError(lang === 'bn' ? 'মোবাইল নম্বর অথবা ইমেইল প্রদান করুন' : 'Please provide email or phone number');
      return;
    }
    if (!password.trim()) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড প্রদান করুন' : 'Password is required');
      return;
    }

    if (mode === 'login') {
      const res = login(identifier, password);
      if (res.success) {
        if (onSuccess) onSuccess(t('loginSuccess'));
      } else {
        setError(t('invalidCredentials'));
      }
    } else {
      if (!fullName.trim()) {
        setError(lang === 'bn' ? 'আপনার পুরো নাম দিন' : 'Full name is required');
        return;
      }
      const res = register({
        name: fullName,
        identifier,
        password,
        role
      });
      if (res.success) {
        if (onSuccess) onSuccess(t('registerSuccess'));
      } else {
        setError(res.message || t('invalidCredentials'));
      }
    }
  };

  const handleAdminQuickFill = () => {
    setIdentifier(DEFAULT_ADMIN.email);
    setPassword(DEFAULT_ADMIN.password);
    const res = quickAdminLogin();
    if (res.success) {
      if (onSuccess) onSuccess(lang === 'bn' ? 'অ্যাডমিন হিসেবে লগইন সফল হয়েছে!' : 'Logged in as Admin (Arman Hossain)!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Bar with Language Toggle */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">
                {lang === 'bn' ? 'টু-লেট মীরসরাই' : 'To-Let Mirsarai'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-300 rounded-full border border-blue-400/30">
                {lang === 'bn' ? 'পৌর ও ইউনিয়ন' : 'Mirsarai Hub'}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {lang === 'bn' ? 'বারইয়ারহাট • শিল্পনগরী • জোরারগঞ্জ • সদর' : 'Baraiyarhat • Shilpa Nagar • Zorarganj • Sadar'}
            </p>
          </div>
        </div>

        {/* Right side Language switcher & Skip to Guest */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <span className="text-sm">{lang === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
            <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {onEnterAsGuest && (
            <button
              onClick={onEnterAsGuest}
              className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl transition-colors hover:bg-slate-800/60"
            >
              <span>{t('guestBrowse')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Content: Split Grid */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full items-center">
          
          {/* Left Column: Platform Highlights & Mirsarai Context */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-semibold text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>{t('economicZoneBadge')}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {lang === 'bn' ? (
                <>মীরসরাইয়ে বাড়ি ও ফ্ল্যাট ভাড়ার <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">স্মার্ট ড্যাশবোর্ড</span></>
              ) : (
                <>Modern House Rent & Property Portal for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Mirsarai</span></>
              )}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {lang === 'bn'
                ? 'বারইয়ারহাট পৌরসভা, বঙ্গবন্ধু শিল্পনগরী (বেজা) এলাকা ও মীরসরাই সদরের সকল ফ্যামিলি বাসা, ব্যাচেলর মেস ও কমার্শিয়াল স্পেস পরিচালনা ও অনুসন্ধান করুন।'
                : 'Manage properties, track prospective tenant leads, and analyze rental trends across Baraiyarhat, Sadar, Zorarganj, and the Economic Zone.'}
            </p>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto lg:mx-0 text-left pt-2">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">
                    {lang === 'bn' ? 'সরাসরি বাড়িওয়ালা' : 'Verified Landlords'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'কোনো দালাল বা অতিরিক্ত ফি নেই' : '0% Brokerage & Direct Connect'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">
                    {lang === 'bn' ? 'শিল্পনগরী ও পৌর এলাকা' : 'All 16+ Mirsarai Unions'}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {lang === 'bn' ? 'বারইয়ারহাট, জোরারগঞ্জ ও সদর' : 'Baraiyarhat, Sadar & BEZA'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick credentials hint box */}
            <div className="p-4 bg-slate-900/80 border border-purple-500/30 rounded-2xl max-w-xl mx-auto lg:mx-0 text-left space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                <KeyRound className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'অ্যাডমিন অ্যাকাউন্ট তথ্য' : 'System Admin Credentials'}</span>
              </div>
              <div className="text-xs text-slate-300 flex flex-wrap gap-x-4 gap-y-1">
                <span>Email: <strong className="text-purple-200">armanhossain.eee.info@gmail.com</strong></span>
                <span>Password: <strong className="text-purple-200 font-mono">arman2026**</strong></span>
              </div>
            </div>
          </div>

          {/* Right Column: Login / Register Form Card */}
          <div className="lg:col-span-5 w-full max-w-md mx-auto">
            <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
              
              {/* Card Header & Switcher */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-black text-white">
                    {mode === 'login' ? t('loginTitle') : t('registerTitle')}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md border border-blue-400/30">
                    {mode === 'login' ? 'Auth' : 'New User'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {t('authSubtitle')}
                </p>

                {/* Tabs */}
                <div className="flex rounded-xl bg-slate-800 p-1 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'login'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t('login')}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMode('register');
                      setError('');
                    }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      mode === 'register'
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t('register')}</span>
                  </button>
                </div>
              </div>

              {/* Form Element */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                    {error}
                  </div>
                )}

                {/* Full Name (if registering) */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      {t('fullName')} <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={t('fullNamePlaceholder')}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                )}

                {/* Identifier: Phone or Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('phoneOrEmail')} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={t('phoneOrEmailPlaceholder')}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Password with Eye toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {t('password')} <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t('passwordPlaceholder')}
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role selection if registering */}
                {mode === 'register' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      {t('selectRole')}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRole('landlord')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          role === 'landlord'
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                        <span>{t('roleLandlord')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setRole('renter')}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                          role === 'renter'
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700/50'
                        }`}
                      >
                        <UserPlus className="w-4 h-4 mx-auto mb-1 text-indigo-400" />
                        <span>{t('roleRenter')}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <span>{mode === 'login' ? t('login') : t('register')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* 1-Click Quick Admin Login Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleAdminQuickFill}
                  className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-950/70 to-indigo-950/70 border border-purple-500/40 hover:border-purple-400 text-purple-200 rounded-xl text-xs font-bold transition-all flex items-center justify-between group shadow-sm"
                >
                  <div className="flex items-center gap-2 text-left">
                    <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <div>
                      <span className="block text-white font-bold">{t('quickAdminLogin')}</span>
                      <span className="text-[10px] text-purple-300/80 font-normal">
                        armanhossain.eee.info@gmail.com
                      </span>
                    </div>
                  </div>
                  <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-125 transition-transform" />
                </button>
              </div>

              {/* Browse as Guest Option */}
              {onEnterAsGuest && (
                <div className="pt-2 border-t border-slate-800 text-center">
                  <button
                    type="button"
                    onClick={onEnterAsGuest}
                    className="text-xs text-slate-400 hover:text-white font-semibold transition-colors flex items-center justify-center gap-1.5 mx-auto py-1"
                  >
                    <span>{t('guestBrowse')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 border-t border-slate-900 text-slate-500 text-xs flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © {new Date().getFullYear()} To-Let Mirsarai • Mirsarai Upazila Property Hub
        </div>
        <div>
          <span>{t('trustedBy')}</span>
        </div>
      </footer>
    </div>
  );
}
