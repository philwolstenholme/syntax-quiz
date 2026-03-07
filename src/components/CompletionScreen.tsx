import { Trophy, Target, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';
import { m, useReducedMotion } from 'motion/react';
import { PageLayout } from './PageLayout';
import { StatCard } from './StatCard';
import type { Level } from '../data/questions';
import { ROUTES } from '../routes';
import { formatNumber, formatPercent } from '../utils/format';

interface CompletionScreenProps {
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  level: Level;
}

export const CompletionScreen = ({ score, correctAnswers, totalQuestions, level }: CompletionScreenProps) => {
  const accuracy = formatPercent(correctAnswers / totalQuestions);
  const prefersReducedMotion = useReducedMotion();

  const stagger = (i: number) =>
    prefersReducedMotion
      ? { initial: { opacity: 1 }, animate: { opacity: 1 } }
      : {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] as const },
        };

  return (
    <PageLayout centered>
      <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-8 sm:p-10 max-w-md w-full text-center">
        <m.div className="mb-6" {...stagger(0)}>
          <Trophy className="w-12 h-12 text-amber-500 dark:text-amber-400 mx-auto" aria-hidden="true" />
        </m.div>

        <m.h1 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mb-2" {...stagger(1)}>
          Quiz complete!
        </m.h1>

        <m.div className="mb-6" {...stagger(2)}>
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border border-neutral-300 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono">
            {level.name} — {level.subtitle}
          </span>
        </m.div>

        <m.div className="border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 rounded-lg p-6 mb-6" {...stagger(3)}>
          <div className="text-3xl font-medium mb-1 tabular-nums font-mono">{formatNumber(score)}</div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Total score</div>
        </m.div>

        <m.div className="grid grid-cols-2 gap-3 mb-6" {...stagger(4)}>
          <StatCard icon={Target} iconColor="text-blue-500 dark:text-blue-400" value={accuracy} label="Accuracy" />
          <StatCard icon={CheckCircle} iconColor="text-emerald-500 dark:text-emerald-400" value={formatNumber(correctAnswers)} label="Correct" />
        </m.div>

        <m.div className="space-y-3" {...stagger(5)}>
          <Link
            to={ROUTES.questions(level.id)}
            className="w-full bg-neutral-900 text-neutral-100 dark:bg-neutral-100 dark:text-neutral-900 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-neutral-700 dark:hover:bg-white transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] touch-manipulation"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Try again
          </Link>

          <Link
            to={ROUTES.home}
            className="w-full bg-transparent border border-neutral-300 text-neutral-700 dark:border-neutral-800 dark:text-neutral-300 font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-neutral-100 hover:border-neutral-400 dark:hover:bg-neutral-900 dark:hover:border-neutral-700 transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Choose another level
          </Link>
        </m.div>
      </div>
    </PageLayout>
  );
};
