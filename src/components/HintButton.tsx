import { Lightbulb } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'motion/react';
import { MAX_HINTS } from '../constants';

interface HintButtonProps {
  hint: string;
  hintsUsed: number;
  onUseHint: () => void;
  disabled: boolean;
}

export const HintButton = ({ hint, hintsUsed, onUseHint, disabled }: HintButtonProps) => {
  const showEliminate = hintsUsed === 0;
  const showHintText = hintsUsed >= MAX_HINTS;
  const allUsed = hintsUsed >= MAX_HINTS;

  return (
    <div className="mb-6">
      <AnimatePresence mode="wait">
        {showHintText && (
          <motion.div
            key="hint-text"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 mb-3 flex items-start gap-3"
          >
            <Lightbulb className="text-amber-500 flex-shrink-0 mt-0.5" size={20} />
            <p className="text-amber-800 font-medium">{hint}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!allUsed && (
        <button
          onClick={onUseHint}
          disabled={disabled}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200',
            !disabled
              ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 hover:scale-105'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed',
          )}
        >
          <Lightbulb size={16} />
          {showEliminate ? 'Eliminate two answers (−50% pts)' : 'Show hint (−50% pts)'}
          <span className="ml-1 text-xs opacity-70">
            {hintsUsed}/{MAX_HINTS}
          </span>
        </button>
      )}
    </div>
  );
};
