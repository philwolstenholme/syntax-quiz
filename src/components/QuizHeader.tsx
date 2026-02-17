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
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <span className={`flex items-center h-9 text-sm px-3 sm:px-4 rounded-xl bg-gradient-to-r ${level.color} text-white font-bold`}>
            {level.name}
          </span>
          <div className="flex items-center gap-2 h-9 bg-orange-500 text-white px-3 sm:px-4 rounded-xl font-bold tabular-nums">
            <Flame size={20} aria-hidden="true" />
            <span>{formatNumber(streak)}</span>
          </div>
          <div className="flex items-center gap-2 h-9 bg-yellow-500 text-white px-3 sm:px-4 rounded-xl font-bold tabular-nums">
            <Star size={20} aria-hidden="true" />
            <span>{formatNumber(score)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-gray-600 font-semibold tabular-nums">
            {formatNumber(currentQuestionIndex + 1)} / {formatNumber(totalQuestions)}
          </div>
          <SaveModal onSave={onSave} disabled={isAnswering} />
        </div>
      </div>
      <div
        className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
        role="progressbar"
        aria-valuenow={currentQuestionIndex + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
      >
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
