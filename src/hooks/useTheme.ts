import { useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getStoredTheme(): ThemePreference {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {}
  return 'system';
}

function applyTheme(preference: ThemePreference) {
  const isDark =
    preference === 'dark' ||
    (preference === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', isDark);
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(getStoredTheme);

  const setTheme = useCallback((t: ThemePreference) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
    setThemeState(t);
    applyTheme(t);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('system');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  return { theme, setTheme } as const;
}
