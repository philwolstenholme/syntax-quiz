import { ChevronRight, Flame, Home, Star } from 'lucide-react';
import { Link } from 'wouter';
import type { Level } from '../data/questions';
import { ROUTES } from '../routes';
import { formatNumber } from '../utils/format';
import { SaveModal } from './SaveModal';

interface QuizHeaderProps {
  score: number;
  streak: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  level: Level;
  onSave: () => string;
  isAnswering: boolean;
}

export const QuizHeader = ({ score, streak, currentQuestionIndex, totalQuestions, level, onSave, isAnswering }: QuizHeaderProps) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="rounded-lg border border-line bg-surface-card p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <Link
              to={ROUTES.home}
              className="flex items-center justify-center h-7 w-7 text-heading hover:text-heading transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <Home size={14} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
            <ChevronRight size={12} className="text-faint" aria-hidden="true" />
            <span className="flex items-center h-7 text-xs px-1 text-secondary font-mono">
              {level.name}
            </span>
          </div>
          <div data-testid="streak-value" className="flex items-center gap-1 h-7 text-xs px-2 text-accent-orange font-mono tabular-nums">
            <Flame size={12} aria-hidden="true" />
            <span>{formatNumber(streak)}</span>
          </div>
          <div data-testid="score-value" className="flex items-center gap-1 h-7 text-xs px-2 text-accent-blue font-mono tabular-nums">
            <Star size={12} aria-hidden="true" />
            <span>{formatNumber(score)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs text-tertiary font-mono tabular-nums">
            {formatNumber(currentQuestionIndex + 1)}/{formatNumber(totalQuestions)}
          </div>
          <SaveModal onSave={onSave} disabled={isAnswering} />
        </div>
      </div>
      <div
        className="w-full bg-surface-muted rounded-full h-1 overflow-hidden"
        role="progressbar"
        aria-valuenow={currentQuestionIndex + 1}
        aria-valuemin={0}
        aria-valuemax={totalQuestions}
      >
        <div
          className="h-full bg-btn-primary rounded-full transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
