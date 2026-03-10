import { useState, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check } from 'lucide-react';
import clsx from 'clsx';
import type { BuildQuestionWithIndex } from '../hooks/useBuildQuiz';

interface ConstructionCardProps {
  question: BuildQuestionWithIndex;
  onSubmit: (arrangedTokens: string[]) => void;
  disabled: boolean;
}

// Unique ID prefix to distinguish bank from zone items
const BANK_PREFIX = 'bank-';
const ZONE_PREFIX = 'zone-';

interface SortableTokenProps {
  id: string;
  token: string;
  disabled: boolean;
  isInZone: boolean;
}

const SortableToken = ({ id, token, disabled, isInZone }: SortableTokenProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={clsx(
        'flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 font-mono text-sm select-none',
        'transition-[color,background-color,border-color,opacity] duration-150',
        isInZone
          ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600/40 dark:bg-blue-500/10 dark:text-blue-200'
          : 'border-neutral-200 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200',
        !disabled && 'hover:border-neutral-400 dark:hover:border-neutral-500 active:scale-[0.97]',
        disabled && 'opacity-40 cursor-not-allowed',
        isDragging && 'opacity-30',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
        'touch-manipulation',
      )}
    >
      <span
        {...listeners}
        className={clsx(
          'shrink-0 cursor-grab active:cursor-grabbing',
          "relative after:content-[''] after:absolute after:-inset-3",
        )}
        style={!disabled ? { touchAction: 'none' } : { pointerEvents: 'none' }}
      >
        <GripVertical className="text-neutral-400 dark:text-neutral-600" size={14} aria-hidden="true" />
      </span>
      <span className="whitespace-nowrap">{token}</span>
    </div>
  );
};

export const ConstructionCard = ({ question, onSubmit, disabled }: ConstructionCardProps) => {
  // Zone contains token strings placed by user, bank contains remaining tokens
  const [zoneTokens, setZoneTokens] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const bankTokens = question.shuffledTokens.filter(t => !zoneTokens.includes(t));

  const bankIds = bankTokens.map(t => `${BANK_PREFIX}${t}`);
  const zoneIds = zoneTokens.map(t => `${ZONE_PREFIX}${t}`);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 100, tolerance: 5 },
  });
  const sensors = useSensors(pointerSensor, touchSensor);

  const getTokenFromId = (id: string): string => {
    if (id.startsWith(BANK_PREFIX)) return id.slice(BANK_PREFIX.length);
    if (id.startsWith(ZONE_PREFIX)) return id.slice(ZONE_PREFIX.length);
    return id;
  };

  const isFromBank = (id: string) => id.startsWith(BANK_PREFIX);
  const isFromZone = (id: string) => id.startsWith(ZONE_PREFIX);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    document.body.style.userSelect = 'none';
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Moving from bank to zone
    if (isFromBank(activeIdStr) && (isFromZone(overIdStr) || overIdStr === 'construction-zone')) {
      const token = getTokenFromId(activeIdStr);
      if (!zoneTokens.includes(token)) {
        setZoneTokens(prev => [...prev, token]);
      }
    }

    // Moving from zone back to bank area
    if (isFromZone(activeIdStr) && (isFromBank(overIdStr) || overIdStr === 'token-bank')) {
      const token = getTokenFromId(activeIdStr);
      setZoneTokens(prev => prev.filter(t => t !== token));
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    document.body.style.userSelect = '';

    const { active, over } = event;
    if (!over) {
      // If dropped nowhere, move back to bank if it was in zone
      const activeIdStr = active.id as string;
      if (isFromZone(activeIdStr)) {
        const token = getTokenFromId(activeIdStr);
        setZoneTokens(prev => prev.filter(t => t !== token));
      }
      return;
    }

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    // Reorder within zone
    if (isFromZone(activeIdStr) && isFromZone(overIdStr)) {
      const oldIndex = zoneTokens.indexOf(getTokenFromId(activeIdStr));
      const newIndex = zoneTokens.indexOf(getTokenFromId(overIdStr));
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        setZoneTokens(prev => arrayMove(prev, oldIndex, newIndex));
      }
    }
  };

  const handleDragCancel = () => {
    setActiveId(null);
    document.body.style.userSelect = '';
  };

  const handleTokenClick = useCallback((token: string, isInZone: boolean) => {
    if (disabled) return;
    if (isInZone) {
      setZoneTokens(prev => prev.filter(t => t !== token));
    } else {
      setZoneTokens(prev => [...prev, token]);
    }
  }, [disabled]);

  const handleCheckAnswer = () => {
    if (disabled || zoneTokens.length === 0) return;
    onSubmit(zoneTokens);
  };

  const activeToken = activeId ? getTokenFromId(activeId) : null;

  return (
    <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900/50 p-5 sm:p-6 mb-4">
      <h2 className="text-xl font-medium tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
        Build the syntax
      </h2>
      <p className="text-neutral-600 dark:text-neutral-300 mb-5 text-base leading-relaxed">
        {question.instruction}
      </p>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        {/* Construction zone */}
        <div className="mb-4">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            Your code
          </div>
          <SortableContext items={zoneIds} strategy={horizontalListSortingStrategy}>
            <div
              id="construction-zone"
              className={clsx(
                'min-h-[56px] rounded-md border-2 border-dashed p-3 flex flex-wrap gap-2 items-start transition-colors duration-150',
                zoneTokens.length === 0
                  ? 'border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950'
                  : 'border-blue-300 dark:border-blue-600/40 bg-blue-50/50 dark:bg-blue-500/5',
              )}
            >
              {zoneTokens.length === 0 && (
                <span className="text-sm text-neutral-400 dark:text-neutral-500 select-none">
                  Tap tokens below or drag them here to build your code
                </span>
              )}
              {zoneTokens.map(token => (
                <div
                  key={`${ZONE_PREFIX}${token}`}
                  onClick={() => handleTokenClick(token, true)}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTokenClick(token, true); } }}
                  aria-label={`Remove ${token} from code`}
                >
                  <SortableToken
                    id={`${ZONE_PREFIX}${token}`}
                    token={token}
                    disabled={disabled}
                    isInZone
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </div>

        {/* Token bank */}
        <div className="mb-5">
          <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-2 uppercase tracking-wider">
            Available tokens
          </div>
          <SortableContext items={bankIds} strategy={horizontalListSortingStrategy}>
            <div
              id="token-bank"
              className="min-h-[44px] flex flex-wrap gap-2 items-start"
            >
              {bankTokens.length === 0 && zoneTokens.length > 0 && (
                <span className="text-sm text-neutral-400 dark:text-neutral-500 select-none">
                  All tokens placed — check your answer!
                </span>
              )}
              {bankTokens.map(token => (
                <div
                  key={`${BANK_PREFIX}${token}`}
                  onClick={() => handleTokenClick(token, false)}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleTokenClick(token, false); } }}
                  aria-label={`Add ${token} to code`}
                >
                  <SortableToken
                    id={`${BANK_PREFIX}${token}`}
                    token={token}
                    disabled={disabled}
                    isInZone={false}
                  />
                </div>
              ))}
            </div>
          </SortableContext>
        </div>

        <DragOverlay>
          {activeToken ? (
            <div className="flex items-center gap-1.5 rounded-md border border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/50 px-2.5 py-1.5 font-mono text-sm text-blue-800 dark:text-blue-200 shadow-xl cursor-grabbing">
              <GripVertical className="text-blue-400 dark:text-blue-500 shrink-0" size={14} aria-hidden="true" />
              <span className="whitespace-nowrap">{activeToken}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Submit button */}
      <button
        type="button"
        onClick={handleCheckAnswer}
        disabled={disabled || zoneTokens.length === 0}
        className={clsx(
          'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]',
          'touch-manipulation',
          disabled || zoneTokens.length === 0
            ? 'bg-neutral-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500 cursor-not-allowed'
            : 'bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-neutral-950 active:scale-[0.98]',
        )}
      >
        <Check size={18} aria-hidden="true" />
        Check answer
      </button>
    </div>
  );
};
