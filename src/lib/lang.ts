export type Lang = 'en' | 'de';

export const LANGS: Lang[] = ['en', 'de'];
export const DEFAULT_LANG: Lang = 'en';

const STORAGE_KEY = 'univers.lang';

export function isLang(value: string | undefined | null): value is Lang {
  return value === 'en' || value === 'de';
}

export function getStoredLang(): Lang | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return isLang(value) ? value : null;
  } catch {
    return null;
  }
}

export function setStoredLang(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* storage unavailable — ignore */
  }
}

export function detectBrowserLang(): Lang {
  if (typeof navigator === 'undefined') return DEFAULT_LANG;
  const raw = (navigator.languages?.[0] || navigator.language || '').toLowerCase();
  if (raw.startsWith('de')) return 'de';
  return DEFAULT_LANG;
}

export function detectInitialLang(): Lang {
  return getStoredLang() ?? detectBrowserLang();
}

export function applyLang(lang: Lang): void {
  setStoredLang(lang);
  try {
    document.documentElement.lang = lang;
  } catch {
    /* document unavailable — ignore */
  }
}

/** Strips the configured deployment base path into a leading-slash prefix. */
export function getBasePrefix(): string {
  const raw = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '/';
  const trimmed = String(raw).replace(/\/+$/, '');
  return trimmed === '' || trimmed === '/' ? '' : trimmed;
}

export function localizedPath(lang: Lang): string {
  return `${getBasePrefix()}/${lang}`;
}