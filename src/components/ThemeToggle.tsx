import { Monitor, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import type { ThemePreference } from '../context/themeContextValue';

const options: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: 'system', icon: Monitor, label: 'System theme' },
  { value: 'light', icon: Sun, label: 'Light theme' },
  { value: 'dark', icon: Moon, label: 'Dark theme' },
];

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="sticky bottom-3 ml-auto mr-3 w-fit z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:fixed sm:bottom-auto sm:top-3 sm:right-3 sm:ml-0 sm:mr-0 sm:w-auto"
      role="group"
      aria-label="Theme preference"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={
            theme === value
              ? 'flex h-7 w-7 items-center justify-center rounded-md bg-neutral-100 text-neutral-900 transition-colors dark:bg-neutral-800 dark:text-neutral-100'
              : 'flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 transition-colors hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300'
          }
        >
          <Icon size={14} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
};
