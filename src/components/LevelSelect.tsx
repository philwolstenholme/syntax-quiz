import { useRef } from 'react';
import { Code2, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import clsx from 'clsx';
import { levels } from '../data/questions';
import { PageLayout } from './PageLayout';
import { ROUTES } from '../routes';
import { formatNumber } from '../utils/format';
import { CRTBackground } from './CRTBackground';

export const LevelSelect = () => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <PageLayout>
      <CRTBackground excludeRef={contentRef} />
      <div ref={contentRef} className="relative py-12 sm:py-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900">
              <Code2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" aria-hidden="true" />
            </div>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 font-mono">syntax-quiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            Syntax Quiz
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm max-w-[50ch]">
            Test your TypeScript and JavaScript knowledge across {levels.length} difficulty levels.
          </p>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800">
          {levels.map((level, index) => (
            <Link
              key={level.id}
              to={ROUTES.questions(level.id)}
              className={clsx(
                'group flex items-center justify-between gap-4 py-4 px-1 rounded-md',
                'transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-900/50',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
                'touch-manipulation',
                index < levels.length - 1 && 'border-b border-neutral-200 dark:border-neutral-800',
              )}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900 text-sm font-mono text-neutral-600 dark:text-neutral-300 tabular-nums">
                  {level.id}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {level.name}
                    </h2>
                    <span className="shrink-0 text-xs font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 rounded-full px-2 py-0.5">
                      {level.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                    {level.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
                  {formatNumber(level.questions.length)}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-[color,transform] duration-150 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
