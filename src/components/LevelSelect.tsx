import { Code2, ChevronRight } from 'lucide-react';
import { Link } from 'wouter';
import { levels } from '../data/questions';
import { PageLayout } from './PageLayout';
import { ROUTES } from '../routes';
import { formatNumber } from '../utils/format';

export const LevelSelect = () => {
  return (
    <PageLayout>
      <div className="py-12 sm:py-20">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface-raised">
              <Code2 className="w-4 h-4 text-tertiary" aria-hidden="true" />
            </div>
            <span className="text-sm text-muted font-mono">syntax-quiz</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-heading mb-2">
            Syntax Quiz
          </h1>
          <p className="text-tertiary text-sm max-w-[50ch]">
            Test your TypeScript and JavaScript knowledge across {levels.length} difficulty levels.
          </p>
        </div>

        <div className="border-t border-line">
          {levels.map((level, index) => (
            <Link
              key={level.id}
              to={ROUTES.questions(level.id)}
              className={`group flex items-center justify-between gap-4 py-4 px-1 transition-colors hover:bg-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-md touch-manipulation ${index < levels.length - 1 ? 'border-b border-line' : ''}`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-line bg-surface-raised text-sm font-mono text-secondary tabular-nums">
                  {level.id}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-sm font-medium text-body truncate">
                      {level.name}
                    </h2>
                    <span className="shrink-0 text-xs font-medium text-muted border border-line rounded-full px-2 py-0.5">
                      {level.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5 truncate">
                    {level.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted font-mono tabular-nums">
                  {formatNumber(level.questions.length)}
                </span>
                <ChevronRight className="w-4 h-4 text-faint group-hover:text-tertiary transition-colors" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
