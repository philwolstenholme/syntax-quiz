import { Monitor, Sun, Moon } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../hooks/useTheme';
import type { ThemePreference } from '../hooks/useTheme';

const options: { value: ThemePreference; icon: typeof Monitor; label: string }[] = [
  { value: 'system', icon: Monitor, label: 'System theme' },
  { value: 'light', icon: Sun, label: 'Light theme' },
  { value: 'dark', icon: Moon, label: 'Dark theme' },
];

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-0.5 rounded-lg border border-line bg-surface-card p-0.5"
      role="radiogroup"
      aria-label="Theme"
    >
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          onClick={() => setTheme(value)}
          className={clsx(
            'flex items-center justify-center w-7 h-7 rounded-md transition-colors',
            theme === value
              ? 'bg-surface-muted text-heading'
              : 'text-faint hover:text-muted',
          )}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
};
