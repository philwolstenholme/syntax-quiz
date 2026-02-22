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
      inert={isDragging ? true : undefined}
      type="button"
      disabled={isDisabled}
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 p-4 rounded-xl border-2 border-gray-300',
        'bg-white text-gray-800 font-semibold text-lg',
        'transition-colors transition-transform transition-shadow duration-200 select-none',
        eliminated && 'opacity-30 line-through cursor-not-allowed scale-95',
        !isDisabled
          ? 'hover:scale-105 hover:border-indigo-500 hover:shadow-lg'
          : !eliminated && 'opacity-50 cursor-not-allowed',
        isDragging && 'opacity-40',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-50',
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
        <GripVertical className="text-gray-400" size={20} aria-hidden="true" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
