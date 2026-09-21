import { useSyncExternalStore } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'univers.theme';
const listeners = new Set<() => void>();

let mode: ThemeMode = 'system';

function systemPrefersDark(): boolean {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  } catch {
    return false;
  }
}

export function isDarkMode(value: ThemeMode): boolean {
  return value === 'dark' || (value === 'system' && systemPrefersDark());
}

function applyTheme(value: ThemeMode): void {
  const dark = isDarkMode(value);
  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.style.colorScheme = dark ? 'dark' : 'light';
}

function readStored(): ThemeMode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    /* storage unavailable */
  }
  return 'system';
}

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function setTheme(next: ThemeMode): void {
  mode = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* storage unavailable */
  }
  applyTheme(next);
  notify();
}

/** Runs once before first render so there is no flash of the wrong theme. */
export function initTheme(): void {
  mode = readStored();
  applyTheme(mode);
  try {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      if (mode === 'system') {
        applyTheme('system');
        notify();
      }
    });
  } catch {
    /* matchMedia unavailable */
  }
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): ThemeMode {
  return mode;
}

export function useTheme(): { mode: ThemeMode; isDark: boolean; setMode: (next: ThemeMode) => void } {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => 'system' as ThemeMode);
  return { mode: current, isDark: isDarkMode(current), setMode: setTheme };
}