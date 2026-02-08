import type { MouseEvent } from 'react';
import { GripVertical } from 'lucide-react';
import clsx from 'clsx';
import { useDraggable } from '@dnd-kit/core';

const DraggableOption = ({
  option,
  disabled,
  onAnswer,
}: {
  option: string;
  disabled: boolean;
  onAnswer: (answer: string) => void;
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: option,
    data: { answer: option },
    disabled,
  });

  const handleClick = (e: MouseEvent) => {
    // Prevent click from triggering after drag
    if (e.defaultPrevented) return;
    if (!disabled) {
      onAnswer(option);
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...attributes}
      disabled={disabled}
      onClick={handleClick}
      className={clsx(
        'flex items-center gap-3 p-4 rounded-xl border-2 border-gray-300',
        'bg-white text-gray-800 font-semibold text-lg',
        'transition-all duration-200',
        !disabled
          ? 'hover:scale-105 hover:border-indigo-500 hover:shadow-lg'
          : 'opacity-50 cursor-not-allowed',
        isDragging && 'opacity-40',
      )}
    >
      <span
        {...listeners}
        className={clsx(
          'relative flex-shrink-0 cursor-move',
          "after:content-[''] after:absolute after:-inset-4",
        )}
        style={!disabled ? { touchAction: 'none' } : undefined}
      >
        <GripVertical className="text-gray-400" size={20} />
      </span>
      <span className="flex-1 text-left">{option}</span>
    </button>
  );
};

export const AnswerOptions = ({
  options,
  onAnswer,
  disabled,
}: {
  options: string[];
  onAnswer: (answer: string) => void;
  disabled: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <DraggableOption
          key={index}
          option={option}
          disabled={disabled}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
};
