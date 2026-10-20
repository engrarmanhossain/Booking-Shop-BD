import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export function toBengaliNumerals(num) {
  if (num === null || num === undefined) return '';
  const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return String(num).replace(/\d/g, (d) => bnDigits[Number(d)]);
}

export function formatCurrency(amount, lang = 'bn') {
  if (amount === undefined || amount === null) return '';
  const formattedEn = Number(amount).toLocaleString('en-IN');
  if (lang === 'bn') {
    return `৳ ${toBengaliNumerals(formattedEn)}`;
  }
  return `৳ ${formattedEn}`;
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('tolet_mirsarai_lang') || 'bn';
  });

  useEffect(() => {
    localStorage.setItem('tolet_mirsarai_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key, vars = {}) => {
    const dict = translations[lang] || translations.en;
    let text = dict[key] || translations.en[key] || key;

    // Substitute variables like {count}
    Object.keys(vars).forEach((vKey) => {
      let val = vars[vKey];
      if (lang === 'bn' && typeof val === 'number') {
        val = toBengaliNumerals(val);
      }
      text = text.replace(new RegExp(`\\{${vKey}\\}`, 'g'), val);
    });

    return text;
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'bn' ? 'en' : 'bn'));
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t, formatCurrency: (amt) => formatCurrency(amt, lang) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
