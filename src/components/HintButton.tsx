import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { MAX_HINTS } from '../constants';

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
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {showHintText && (
          <motion.div
            key="hint-text"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-3 flex items-start gap-3"
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
            'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-colors transition-transform duration-200',
            !disabled
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:scale-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-amber-50',
            'touch-manipulation',
          )}
        >
          <Lightbulb size={16} aria-hidden="true" />
          {showEliminate ? 'Eliminate 2 Answers (−50% Pts)' : 'Show Hint (−50% Pts)'}
          <span className="ml-1 text-xs opacity-70">
            {hintsUsed}/{MAX_HINTS}
          </span>
        </button>
      )}
    </div>
  );
};
