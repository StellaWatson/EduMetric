'use client';

import { create } from 'zustand';
import { DICTIONARIES, type Lang } from './dictionary';

interface I18nState {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const STORAGE_KEY = 'em_lang';

function readInitial(): Lang {
  if (typeof window === 'undefined') return 'en';
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === 'uz' || stored === 'en' ? stored : 'en';
}

export const useI18n = create<I18nState>((set, get) => ({
  lang: 'en', // hydrated on first client render
  setLang: (lang) => {
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lang);
    set({ lang });
  },
  t: (key: string) => {
    const lang = get().lang;
    return DICTIONARIES[lang][key] ?? DICTIONARIES.en[key] ?? key;
  },
}));

/**
 * Call this once on the client (e.g. from Providers) to hydrate the language
 * from localStorage. Server can't read localStorage so we always start as 'en'
 * and swap on first client render — flash is fine for a language toggle.
 */
export function bootstrapLang() {
  if (typeof window === 'undefined') return;
  const stored = readInitial();
  useI18n.setState({ lang: stored });
}

export function useT() {
  return useI18n((s) => s.t);
}
