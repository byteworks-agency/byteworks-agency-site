'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import en from '@/data/en.json';
import es from '@/data/es.json';

type Dict = typeof en;
type Lang = 'en' | 'es';

type I18nContextType = {
  lang: Lang;
  dict: Dict;
  t: (path: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  dict: en,
  t: () => '',
});

function getBrowserLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const nav = window.navigator?.language?.toLowerCase() || '';
  if (nav.startsWith('es')) return 'es';
  return 'en';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    setLang(getBrowserLang());
  }, []);

  const dict = useMemo(() => (lang === 'es' ? es : en), [lang]);

  const t = useMemo(() => {
    return (path: string) => {
      const parts = path.split('.');
      let cur: any = dict;
      for (const p of parts) {
        if (cur && typeof cur === 'object' && p in cur) cur = cur[p];
        else return path;
      }
      return typeof cur === 'string' ? cur : path;
    };
  }, [dict]);

  return <I18nContext.Provider value={{ lang, dict, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}