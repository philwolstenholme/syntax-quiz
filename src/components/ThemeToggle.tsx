import { Monitor, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import { useTheme } from "../context/useTheme";
import { useMute } from "../hooks/useMute";
import type { ThemePreference } from "../context/themeContextValue";

const themeOptions: { value: ThemePreference; icon: typeof Sun; label: string }[] = [
  { value: "system", icon: Monitor, label: "System theme" },
  { value: "light", icon: Sun, label: "Light theme" },
  { value: "dark", icon: Moon, label: "Dark theme" },
];

const btnBase =
  "flex h-7 w-7 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]";
const btnActive = `${btnBase} bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100`;
const btnInactive = `${btnBase} text-neutral-400 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300`;

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { muted, toggleMute } = useMute();

  return (
    <div
      className="fixed bottom-3 right-3 z-50 flex items-center gap-0.5 rounded-lg border border-neutral-200 bg-white p-1 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:bottom-auto sm:top-3"
      role="group"
      aria-label="Display and sound controls"
    >
      {themeOptions.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={label}
          aria-pressed={theme === value}
          className={theme === value ? btnActive : btnInactive}
        >
          <Icon size={14} aria-hidden="true" />
        </button>
      ))}

      <div className="mx-1 h-4 w-px bg-neutral-200 dark:bg-neutral-700" aria-hidden="true" />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? "Unmute sounds" : "Mute sounds"}
        aria-pressed={muted}
        className={muted ? btnActive : btnInactive}
      >
        {muted ? (
          <VolumeX size={14} aria-hidden="true" />
        ) : (
          <Volume2 size={14} aria-hidden="true" />
        )}
      </button>
    </div>
  );
};
