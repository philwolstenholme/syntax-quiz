import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MAX_HINTS } from '../constants';
import { formatNumber } from '../utils/format';

interface HintButtonProps {
  hint: string;
  hintsUsed: number;
  onUseHint: () => void;
  disabled: boolean;
}

export const HintButton = ({ hint, hintsUsed, onUseHint, disabled }: HintButtonProps) => {
  const prefersReducedMotion = useReducedMotion();
  const showEliminate = hintsUsed === 0;
  const showHintText = hintsUsed >= MAX_HINTS;
  const allUsed = hintsUsed >= MAX_HINTS;

  return (
    <div className="mb-6 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {showHintText && (
          <motion.div
            key="hint-text"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-3 flex items-start gap-3 w-full"
          >
            <Lightbulb className="text-amber-500 flex-shrink-0 mt-0.5" size={20} aria-hidden="true" />
            <p className="text-amber-800 font-medium">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!allUsed && (
        <button
          type="button"
          onClick={onUseHint}
          disabled={disabled}
          className={clsx(
            'inline-flex items-center gap-2 px-4 py-2 h-9 rounded-xl font-bold text-sm border-2 transition-colors duration-200',
            !disabled
              ? 'border-amber-300 bg-white text-amber-700 hover:border-amber-400 hover:bg-amber-50 cursor-pointer'
              : 'border-gray-200 bg-white text-gray-400 cursor-not-allowed opacity-50',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2',
            'touch-manipulation',
          )}
        >
          <Lightbulb size={16} aria-hidden="true" />
          {showEliminate ? 'Eliminate 2 Answers (−50% Pts)' : 'Show Hint (−50% Pts)'}
          <span className="ml-1 text-xs opacity-70">
            {formatNumber(hintsUsed)}/{formatNumber(MAX_HINTS)}
          </span>
        </button>
      )}
    </div>
  );
};
