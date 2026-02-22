import { Flame, Star } from 'lucide-react';
import type { Level } from '../data/questions';
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
    <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-3 sm:p-4 mb-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center h-7 text-xs px-2.5 text-neutral-300 font-mono">
            {level.name}
          </span>
          <div data-testid="streak-value" className="flex items-center gap-1 h-7 text-xs px-2 text-orange-400 font-mono tabular-nums">
            <Flame size={12} aria-hidden="true" />
            <span>{formatNumber(streak)}</span>
          </div>
          <div data-testid="score-value" className="flex items-center gap-1 h-7 text-xs px-2 text-blue-400 font-mono tabular-nums">
            <Star size={12} aria-hidden="true" />
            <span>{formatNumber(score)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="text-xs text-neutral-400 font-mono tabular-nums">
            {formatNumber(currentQuestionIndex + 1)}/{formatNumber(totalQuestions)}
          </div>
          <SaveModal onSave={onSave} disabled={isAnswering} />
        </div>
      </div>
      <div
        className="w-full bg-neutral-800 rounded-full h-1 overflow-hidden"
        role="progressbar"
        aria-valuenow={currentQuestionIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
      >
        <div
          className="h-full bg-neutral-100 rounded-full transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
