import type { MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useDraggable } from '@dnd-kit/core';

interface DraggableOptionProps {
  option: string;
  disabled: boolean;
  eliminated: boolean;
  onAnswer: (answer: string) => void;
}

const DraggableOption = ({
  option,
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
        'flex items-center gap-3 p-3 rounded-lg border border-neutral-800',
        'bg-neutral-900/50 text-neutral-200 font-medium text-base',
        'transition-colors duration-150 select-none',
        eliminated && 'opacity-25 line-through cursor-not-allowed',
        !isDisabled
          ? 'hover:bg-neutral-800/80 hover:border-neutral-700'
          : !eliminated && 'opacity-40 cursor-not-allowed',
        isDragging && 'opacity-30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]',
        'touch-manipulation',
      )}
    >
      <span
        {...listeners}
        className={clsx(
          'relative shrink-0 cursor-move',
          "after:content-[''] after:absolute after:-inset-4",
        )}
        style={!isDisabled ? { touchAction: 'none' } : undefined}
      >
        <GripVertical className="text-neutral-600" size={16} aria-hidden="true" />
      </span>
      <span className="flex-1 min-w-0 text-left wrap-break-word">{option}</span>
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="answer-options">
      {options.map((option) => (
        <DraggableOption
          key={option}
          option={option}
          disabled={disabled}
          eliminated={eliminatedOptions.includes(option)}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
};
