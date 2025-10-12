'use client';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/data/en.json';
import es from '@/data/es.json';

type Dict = typeof en;
type Lang = 'en' | 'es';

const dictionaries: Record<Lang, Dict> = { en, es };

type I18nContextType = {
  lang: Lang;
  t: (path: string) => string;
  dict: Dict;
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  // Auto-detect language from browser; no UI toggle, no persistence needed
  useEffect(() => {
    const nav = (typeof navigator !== 'undefined' && (navigator.language || (navigator as any).userLanguage)) || 'en';
    const auto: Lang = String(nav).toLowerCase().startsWith('es') ? 'es' : 'en';
    setLang(auto);
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', auto);
    }
  }, []);

  const dict = useMemo(() => dictionaries[lang], [lang]);

  const t = (path: string) => {
    const parts = path.split('.');
    // @ts-ignore
    let cur: any = dict;
    for (const p of parts) {
      if (cur && p in cur) cur = cur[p];
      else return path;
    }
    return typeof cur === 'string' ? cur : JSON.stringify(cur);
  };

  const value = { lang, t, dict };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}