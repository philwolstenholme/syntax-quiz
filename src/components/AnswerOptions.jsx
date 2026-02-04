import { useState, useRef, useCallback, useEffect } from 'react';
import { GripVertical } from 'lucide-react';

export const AnswerOptions = ({ options, onAnswer, disabled, onDragOverChange }) => {
  const [draggingOption, setDraggingOption] = useState(null);

  // Refs for touch drag state (avoids stale closures in document-level listeners)
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

  // --- Desktop HTML5 drag handlers (unchanged) ---

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

  // --- Touch drag handlers ---
  // Attached to document in handleTouchStart so they keep firing
  // even after the finger leaves the original button.
  // touchmove is added with { passive: false } so preventDefault()
  // actually stops the page from scrolling mid-drag.

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    if (!ghostRef.current) return;

    const touch = e.touches[0];

    // Determine whether the finger has moved enough to count as a drag
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      hasDraggedRef.current = true;
    }

    // Move ghost, preserving the original finger-to-element offset
    ghostRef.current.style.left = touch.clientX - touchOffsetRef.current.x + 'px';
    ghostRef.current.style.top = touch.clientY - touchOffsetRef.current.y + 'px';

    // Ghost has pointer-events: none, so elementFromPoint sees through it
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

    // Only treat as a drop if the finger actually moved
    if (hasDraggedRef.current) {
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target?.closest?.('[data-dropzone]') && draggingOptionRef.current) {
        onAnswerRef.current(draggingOptionRef.current);
      }
    }

    // Reset everything
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

    // Clone the button as a visual "ghost" that follows the finger.
    // pointer-events: none lets elementFromPoint see elements behind it.
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

  // Click handles the tap-to-answer path.  Suppress it if the finger
  // moved (the touch-drag path already called onAnswer if appropriate).
  const handleClick = (option) => {
    if (hasDraggedRef.current) return;
    if (!disabled) {
      onAnswer(option);
    }
  };

  // Clean up if the component unmounts mid-drag (e.g. quiz advances)
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
