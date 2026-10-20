import React, { useState } from 'react';
import { useAuth, DEFAULT_ADMIN } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Building2, 
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { login, register, quickAdminLogin } = useAuth();
  const { lang, t } = useLanguage();

  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('landlord'); // 'landlord' | 'renter'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

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
        onClose();
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
        onClose();
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
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md my-auto overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center border border-blue-400/30">
              <Building2 className="w-4 h-4" />
            </div>
            <span className="text-xs uppercase font-bold tracking-wider text-blue-300">
              {lang === 'bn' ? 'মীরসরাই প্রপার্টি পোর্টাল' : 'Mirsarai Property Hub'}
            </span>
          </div>

          <h2 className="text-xl font-black">
            {mode === 'login' ? t('loginTitle') : t('registerTitle')}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {t('authSubtitle')}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-xl bg-white/10 p-1 mt-4 backdrop-blur-md">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
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
                mode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{t('register')}</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Full Name for Registration */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('fullName')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('fullNamePlaceholder')}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          )}

          {/* Phone or Email Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('phoneOrEmail')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={t('phoneOrEmailPlaceholder')}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {identifier.includes('@') ? <Mail className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              {lang === 'bn' ? 'যেমন: 018... অথবা armanhossain.eee.info@gmail.com' : 'Enter either your phone or email'}
            </p>
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('password')} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('passwordPlaceholder')}
                className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Role Selection for Registration */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {t('selectRole')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('landlord')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    role === 'landlord'
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building2 className="w-4 h-4 mx-auto mb-1 text-blue-600" />
                  <span>{t('roleLandlord')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('renter')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                    role === 'renter'
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <UserPlus className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                  <span>{t('roleRenter')}</span>
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <span>{mode === 'login' ? t('login') : t('register')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Admin Login Pill */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleAdminQuickFill}
              className="w-full py-2 px-3 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 hover:border-purple-300 text-purple-900 rounded-xl text-xs font-bold transition-all flex items-center justify-between group shadow-2xs"
            >
              <div className="flex items-center gap-1.5 text-left">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <div>
                  <span className="block">{t('quickAdminLogin')}</span>
                  <span className="text-[10px] text-purple-600/80 font-normal">
                    armanhossain.eee.info@gmail.com
                  </span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Switch mode footer */}
          <div className="text-center pt-2 text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                {t('noAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError('');
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {t('register')}
                </button>
              </p>
            ) : (
              <p>
                {t('alreadyAccount')}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className="font-bold text-blue-600 hover:underline"
                >
                  {t('login')}
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
