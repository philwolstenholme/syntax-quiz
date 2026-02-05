import { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export const AnswerOptions = ({ options, onAnswer, disabled, onDragOverChange }) => {
  const [draggingOption, setDraggingOption] = useState(null);

  const ghostRef = useRef(null);
  const draggingOptionRef = useRef(null);
  const onAnswerRef = useRef(onAnswer);
  const onDragOverChangeRef = useRef(onDragOverChange);
  const touchOffsetRef = useRef({ x: 0, y: 0 });
  const touchStartRef = useRef({ x: 0, y: 0 });
  const hasDraggedRef = useRef(false);
  const wasOverDropzoneRef = useRef(false);

  onAnswerRef.current = onAnswer;
  onDragOverChangeRef.current = onDragOverChange;

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

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!ghostRef.current) return;

    const touch = e.touches[0];

    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDraggedRef.current = true;
    }

    ghostRef.current.style.left = touch.clientX - touchOffsetRef.current.x + 'px';
    ghostRef.current.style.top = touch.clientY - touchOffsetRef.current.y + 'px';

    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const isOverDropzone = !!target?.closest?.('[data-dropzone]');
    if (isOverDropzone !== wasOverDropzoneRef.current) {
      wasOverDropzoneRef.current = isOverDropzone;
      onDragOverChangeRef.current?.(isOverDropzone);
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    const touch = e.changedTouches[0];

    if (ghostRef.current) {
      ghostRef.current.remove();
      ghostRef.current = null;
    }

    if (hasDraggedRef.current) {
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target?.closest?.('[data-dropzone]') && draggingOptionRef.current) {
        onAnswerRef.current(draggingOptionRef.current);
      }
    }

    wasOverDropzoneRef.current = false;
    onDragOverChangeRef.current?.(false);
    draggingOptionRef.current = null;
    setDraggingOption(null);
    document.body.classList.remove('dragging');

    document.removeEventListener('touchmove', handleTouchMove);
    document.removeEventListener('touchend', handleTouchEnd);
  }, [handleTouchMove]);

  const handleTouchStart = (e, option) => {
    if (disabled) return;

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();

    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    touchOffsetRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    hasDraggedRef.current = false;

    const ghost = e.currentTarget.cloneNode(true);
    ghost.style.position = 'fixed';
    ghost.style.zIndex = '9999';
    ghost.style.pointerEvents = 'none';
    ghost.style.margin = '0';
    ghost.style.left = rect.left + 'px';
    ghost.style.top = rect.top + 'px';
    ghost.style.width = rect.width + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.boxShadow = '0 8px 24px rgba(0,0,0,0.25)';
    ghost.style.transition = 'none';
    document.body.appendChild(ghost);

    ghostRef.current = ghost;
    draggingOptionRef.current = option;
    setDraggingOption(option);
    document.body.classList.add('dragging');

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  const handleClick = (option) => {
    if (hasDraggedRef.current) return;
    if (!disabled) {
      onAnswer(option);
    }
  };

  useEffect(() => {
    return () => {
      if (ghostRef.current) {
        ghostRef.current.remove();
        ghostRef.current = null;
      }
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

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
