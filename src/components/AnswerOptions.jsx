import { useState } from 'react';
import { GripVertical } from 'lucide-react';

export const AnswerOptions = ({ options, onAnswer, disabled }) => {
  const [draggingOption, setDraggingOption] = useState(null);

  const handleDragStart = (e, option) => {
    if (disabled) return;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', option);
    setDraggingOption(option);
    document.body.classList.add('dragging');
  };

  const handleDragEnd = () => {
    setDraggingOption(null);
    document.body.classList.remove('dragging');
  };

  const handleClick = (option) => {
    if (!disabled) {
      onAnswer(option);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option, index) => (
        <button
          key={index}
          draggable={!disabled}
          onDragStart={(e) => handleDragStart(e, option)}
          onDragEnd={handleDragEnd}
          onClick={() => handleClick(option)}
          disabled={disabled}
          className={`
            flex items-center gap-3 p-4 rounded-xl border-2 border-gray-300
            bg-white text-gray-800 font-semibold text-lg
            transition-all duration-200
            ${!disabled ? 'hover:scale-105 hover:border-indigo-500 hover:shadow-lg cursor-pointer' : 'opacity-50 cursor-not-allowed'}
            ${draggingOption === option ? 'opacity-40' : ''}
            ${!disabled ? 'cursor-move' : ''}
          `}
        >
          <GripVertical className="text-gray-400 flex-shrink-0" size={20} />
          <span className="flex-1 text-left">{option}</span>
        </button>
      ))}
    </div>
  );
};
