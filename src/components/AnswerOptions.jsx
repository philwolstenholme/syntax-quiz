import { GripVertical } from 'lucide-react';
import { useDragAnswer } from '../hooks/useDragAnswer';

export const AnswerOptions = ({ options, onAnswer, disabled, onDragOverChange }) => {
  const { draggingOption, handleDragStart, handleDragEnd, handleTouchStart, handleClick } =
    useDragAnswer({ onAnswer, onDragOverChange, disabled });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          draggable={!disabled}
          onDragStart={(e) => handleDragStart(e, option)}
          onDragEnd={handleDragEnd}
          onTouchStart={(e) => handleTouchStart(e, option)}
          onClick={() => handleClick(option)}
          disabled={disabled}
          style={!disabled ? { touchAction: 'none', WebkitUserDrag: 'none' } : undefined}
          className={`
            flex items-center gap-3 p-4 rounded-xl border-2 border-gray-300
            bg-white text-gray-800 font-semibold text-lg
            transition-all duration-200
            ${!disabled ? 'hover:scale-105 hover:border-indigo-500 hover:shadow-lg cursor-move' : 'opacity-50 cursor-not-allowed'}
            ${draggingOption === option ? 'opacity-40' : ''}
          `}
        >
          <GripVertical className="text-gray-400 flex-shrink-0" size={20} />
          <span className="flex-1 text-left">{option}</span>
        </button>
      ))}
    </div>
  );
};
