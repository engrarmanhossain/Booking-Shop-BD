import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Building2, 
  LogIn, 
  UserPlus, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight
} from 'lucide-react';

export default function LoginPage({ onEnterAsGuest, onSuccess }) {
  const { login, register } = useAuth();
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Building2 className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            {lang === 'bn' ? 'বুকিং শপ বিডি' : 'Booking Shop BD'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all shadow-sm"
          >
            <span className="text-sm">{lang === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
            <span>{lang === 'bn' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Browse as Guest */}
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

      {/* Centered Clean Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex flex-col justify-center">
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-5">
          
          {/* Card Header & Switcher */}
          <div>
            <div className="text-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <Building2 className="w-6 h-6" />
              </div>
              <h1 className="text-2xl font-black text-white">
                {mode === 'login' ? t('loginTitle') : t('registerTitle')}
              </h1>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex rounded-xl bg-slate-800 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Full Name for Registration */}
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

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>{mode === 'login' ? t('login') : t('register')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

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
      </main>

      {/* Clean Footer */}
      <footer className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 py-4 text-center text-slate-500 text-xs">
        © {new Date().getFullYear()} Booking Shop BD. All rights reserved.
      </footer>
    </div>
  );
}
