import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
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
    <div className="mb-4 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {showHintText && (
          <m.div
            key="hint-text"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
            className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 mb-3 flex items-start gap-2.5 w-full"
          >
            <Lightbulb className="text-amber-500/80 shrink-0 mt-0.5" size={16} aria-hidden="true" />
            <p className="text-amber-200/90 text-sm">{hint}</p>
          </m.div>
        )}
      </AnimatePresence>

      {!allUsed && (
        <button
          type="button"
          onClick={onUseHint}
          disabled={disabled}
          className={clsx(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-md font-medium text-xs border transition-colors duration-150',
            !disabled
              ? 'border-neutral-700 bg-neutral-900/50 text-neutral-300 hover:border-neutral-600 hover:text-neutral-200 cursor-pointer'
              : 'border-neutral-800 bg-neutral-900/30 text-neutral-600 cursor-not-allowed',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]',
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
