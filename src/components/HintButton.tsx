import { Lightbulb } from 'lucide-react';
import { m, AnimatePresence, useReducedMotion } from 'motion/react';
import { MAX_HINTS } from '../constants';
import { formatNumber } from '../utils/format';
import { SubtleButton } from './SubtleButton';

interface HintButtonProps {
  hint: string;
  hintsUsed: number;
  onUseHint: () => void;
  disabled: boolean;
}

export const HintButton = ({ hint, hintsUsed, onUseHint, disabled }: HintButtonProps) => {
  const prefersReducedMotion = useReducedMotion();
  const showEliminate = hintsUsed === 0;
  const allUsed = hintsUsed >= MAX_HINTS;

  return (
    <div className="mb-4 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {allUsed && (
          <m.div
            key="hint-text"
            initial={{ opacity: prefersReducedMotion ? 1 : 0, y: prefersReducedMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: prefersReducedMotion ? 1 : 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0, 0, 0.2, 1] }}
            className="rounded-lg border border-amber-300 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/5 p-3 mb-3 flex items-start gap-2.5 w-full"
          >
            <Lightbulb className="text-amber-500 dark:text-amber-500/80 shrink-0 mt-0.5" size={16} aria-hidden="true" />
            <p className="text-amber-700 dark:text-amber-200/90 text-sm">{hint}</p>
          </m.div>
        )}
      </AnimatePresence>

      {!allUsed && (
        <SubtleButton
          onClick={onUseHint}
          disabled={disabled}
          data-sound="pop"
        >
          <Lightbulb size={16} aria-hidden="true" />
          {showEliminate ? 'Eliminate 2 answers (−50% points)' : 'Show hint (−50% points)'}
          <span className="ml-1 text-xs text-neutral-500 dark:text-neutral-400">
            {formatNumber(hintsUsed)}/{formatNumber(MAX_HINTS)}
          </span>
        </SubtleButton>
      )}
    </div>
  );
};
