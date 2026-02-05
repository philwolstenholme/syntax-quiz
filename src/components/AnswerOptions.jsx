import { GripVertical } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';

const DraggableOption = ({ option, disabled, onAnswer }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: option,
    data: { answer: option },
    disabled,
  });

  const handleClick = (e) => {
    // Prevent click from triggering after drag
    if (e.defaultPrevented) return;
    if (!disabled) {
      onAnswer(option);
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      disabled={disabled}
      onClick={handleClick}
      style={!disabled ? { touchAction: 'none' } : undefined}
      className={`
        flex items-center gap-3 p-4 rounded-xl border-2 border-gray-300
        bg-white text-gray-800 font-semibold text-lg
        transition-all duration-200
        ${!disabled ? 'hover:scale-105 hover:border-indigo-500 hover:shadow-lg cursor-move' : 'opacity-50 cursor-not-allowed'}
        ${isDragging ? 'opacity-40' : ''}
      `}
    >
      <GripVertical className="text-gray-400 flex-shrink-0" size={20} />
      <span className="flex-1 text-left">{option}</span>
    </button>
  );
};

export const AnswerOptions = ({ options, onAnswer, disabled }) => {
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
