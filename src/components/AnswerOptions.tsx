import type { MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useDraggable } from '@dnd-kit/core';
import { Tooltip } from '@base-ui/react/tooltip';

interface DraggableOptionProps {
  option: string;
  keyHint: number | null;
  disabled: boolean;
  eliminated: boolean;
  onAnswer: (answer: string) => void;
}

const DraggableOption = ({
  option,
  keyHint,
  disabled,
  eliminated,
  onAnswer,
}: DraggableOptionProps) => {
  const isDisabled = disabled || eliminated;
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: option,
    data: { answer: option },
    disabled: isDisabled,
  });
  const handleClick = (e: MouseEvent) => {
    // Prevent click from triggering after drag
    if (e.defaultPrevented) return;
    if (!isDisabled) {
      onAnswer(option);
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      data-testid="answer-option"
      data-answer-option={option}
      inert={isDragging ? true : undefined}
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-800',
        'bg-white dark:bg-neutral-900/50 text-neutral-800 dark:text-neutral-200 font-medium text-base',
        'transition-[color,background-color,border-color,opacity] duration-150 select-none',
        eliminated && 'opacity-25 line-through cursor-not-allowed',
        !isDisabled
          ? 'hover:bg-neutral-100 hover:border-neutral-300 dark:hover:bg-neutral-800/80 dark:hover:border-neutral-700 active:scale-[0.98]'
          : !eliminated && 'opacity-40 cursor-not-allowed',
        isDragging && 'opacity-30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        'touch-manipulation',
        'overflow-hidden'
      )}
    >
      <span
        {...listeners}
        className={clsx(
          'relative shrink-0 cursor-move',
          "after:content-[''] after:absolute after:-inset-4 pointer-coarse:after:w-[min(300px,50vw)] pointer-fine:after:w-[400px]",
        )}
        style={!isDisabled ? { touchAction: 'none'  } : {pointerEvents: 'none'}}
      >
        <GripVertical className="text-neutral-400 dark:text-neutral-600" size={16} aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0 text-left wrap-break-word">{option}</span>
      {keyHint !== null && !isDisabled && (
        <Tooltip.Root>
          <Tooltip.Trigger
            render={
              <kbd aria-hidden="true" className="hidden pointer-fine:inline-flex shrink-0 items-center justify-center h-5 w-5 rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                {keyHint}
              </kbd>
            }
          />
          <Tooltip.Portal>
            <Tooltip.Positioner sideOffset={6}>
              <Tooltip.Popup className="rounded-md px-2.5 py-1.5 text-xs font-medium bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 shadow-lg animate-in fade-in zoom-in-95 duration-150">
                Press {keyHint} to pick this answer
                <Tooltip.Arrow className="fill-neutral-800 dark:fill-neutral-200" />
              </Tooltip.Popup>
            </Tooltip.Positioner>
          </Tooltip.Portal>
        </Tooltip.Root>
      )}
    </button>
  );
};

const EMPTY_ELIMINATED: string[] = [];

interface AnswerOptionsProps {
  options: string[];
  onAnswer: (answer: string) => void;
  disabled: boolean;
  eliminatedOptions?: string[];
}

export const AnswerOptions = ({
  options,
  onAnswer,
  disabled,
  eliminatedOptions = EMPTY_ELIMINATED,
}: AnswerOptionsProps) => {
  // Compute keyboard hint numbers: non-eliminated options get sequential 1, 2, 3…
  const keyHints: (number | null)[] = [];
  let keyCount = 0;
  for (const option of options) {
    if (eliminatedOptions.includes(option)) {
      keyHints.push(null);
    } else {
      keyHints.push(++keyCount);
    }
  }
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="answer-options">
    {options.map((option, i) => (
      <DraggableOption
        key={option}
        option={option}
        keyHint={keyHints[i] ?? null}
        disabled={disabled}
        eliminated={eliminatedOptions.includes(option)}
        onAnswer={onAnswer}
      />
    ))}
  </div>
);
};
