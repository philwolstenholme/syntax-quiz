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
            transition={{ duration: prefersReducedMotion ? 0 : 0.2, ease: [0, 0, 0.2, 1] }}
            className="rounded-lg border border-warning-border bg-warning-bg p-3 mb-3 flex items-start gap-2.5 w-full"
          >
            <Lightbulb className="text-warning-icon shrink-0 mt-0.5" size={16} aria-hidden="true" />
            <p className="text-warning-hint text-sm">{hint}</p>
          </m.div>
        )}
      </AnimatePresence>

      {!allUsed && (
        <SubtleButton
          onClick={onUseHint}
          disabled={disabled}
        >
          <Lightbulb size={16} aria-hidden="true" />
          {showEliminate ? 'Eliminate 2 Answers (−50% Pts)' : 'Show Hint (−50% Pts)'}
          <span className="ml-1 text-xs opacity-70">
            {formatNumber(hintsUsed)}/{formatNumber(MAX_HINTS)}
          </span>
        </SubtleButton>
      )}
    </div>
  );
};
