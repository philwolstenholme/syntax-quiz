import { Trophy, Target, CheckCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'wouter';
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

  return (
    <PageLayout centered>
      <div className="rounded-lg border border-line bg-surface-card p-8 sm:p-10 max-w-md w-full text-center">
        <div className="mb-6">
          <Trophy className="w-12 h-12 text-accent-amber mx-auto" aria-hidden="true" />
        </div>

        <h1 className="text-xl font-medium tracking-tight text-heading mb-2">
          Quiz Complete!
        </h1>

        <div className="mb-6">
          <span className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full border border-line-hover bg-surface-muted text-secondary font-mono">
            {level.name} - {level.subtitle}
          </span>
        </div>

        <div className="border border-line bg-surface-inset text-heading rounded-lg p-6 mb-6">
          <div className="text-3xl font-medium mb-1 tabular-nums font-mono">{formatNumber(score)}</div>
          <div className="text-sm text-muted">Total Score</div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatCard icon={Target} iconColor="text-accent-blue" value={accuracy} label="Accuracy" />
          <StatCard icon={CheckCircle} iconColor="text-accent-emerald" value={formatNumber(correctAnswers)} label="Correct" />
        </div>

        <div className="space-y-3">
          <Link
            to={ROUTES.questions(level.id)}
            className="w-full bg-btn-primary text-inverse font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-btn-primary-hover transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface touch-manipulation"
          >
            <RotateCcw className="w-5 h-5" aria-hidden="true" />
            Try Again
          </Link>

          <Link
            to={ROUTES.home}
            className="w-full bg-transparent border border-line text-secondary font-medium text-sm px-4 py-2.5 rounded-lg hover:bg-surface-raised hover:border-line-hover transition-colors duration-150 flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface touch-manipulation"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            Choose Another Level
          </Link>
        </div>
      </div>
    </PageLayout>
  );
};
