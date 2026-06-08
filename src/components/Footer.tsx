export const Footer = () => (
  <footer className="text-center text-xs text-neutral-500 dark:text-neutral-400 py-4">
    Made by{" "}
    <a
      href="https://wolstenhol.me"
      target="_blank"
      rel="noopener noreferrer"
      className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--bg)] focus-visible:ring-blue-500 rounded px-0.5"
    >
      Phil Wolstenholme
    </a>{" "}
    as an experiment in working on a purely LLM-generated project
  </footer>
);
