import React, { useState } from 'react';
import { ScratchBlock } from '../types';
import { CATEGORY_CONFIG } from '../data/scratchBlocks';
import { Check, Sparkles, BookOpen, AlertCircle } from 'lucide-react';
import { ScratchBlockVisual } from './ScratchBlockVisual';

interface Props {
  block: ScratchBlock;
  isMatched: boolean;
  isSelected: boolean;
  isShaking: boolean;
  onDropBlock: (droppedBlockId: string) => void;
  onClickCard: () => void;
  onShowExample: () => void;
}

export const DefinitionCard: React.FC<Props> = ({
  block,
  isMatched,
  isSelected,
  isShaking,
  onDropBlock,
  onClickCard,
  onShowExample,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const cat = CATEGORY_CONFIG[block.category] || CATEGORY_CONFIG.movement;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMatched) {
      setIsDragOver(true);
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isMatched) return;

    const droppedBlockId = e.dataTransfer.getData('text/plain');
    if (droppedBlockId) {
      onDropBlock(droppedBlockId);
    }
  };

  return (
    <div
      id={`def-card-${block.id}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!isMatched ? onClickCard : undefined}
      className={`
        relative rounded-2xl border-2 p-4 transition-all duration-200 text-left select-none
        ${
          isMatched
            ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
            : isDragOver
            ? 'bg-amber-50 border-amber-500 ring-4 ring-amber-300/60 scale-[1.01] shadow-md'
            : isSelected
            ? 'bg-indigo-50/90 border-indigo-500 ring-4 ring-indigo-200 shadow-md'
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md cursor-pointer'
        }
        ${isShaking ? 'animate-[shake_0.4s_ease-in-out] !border-rose-500 ring-4 ring-rose-300' : ''}
      `}
    >
      {/* Header bar of definition */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: cat.color }}
            title={`Categoría: ${cat.name}`}
          />
          <span className="text-xs font-bold text-slate-500 tracking-wide uppercase">
            Definición #{block.id.split('-').slice(0, 2).join(' ')}
          </span>
        </div>

        {isMatched ? (
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ¡Enlazado!
            </span>
            <button
              id={`btn-example-${block.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShowExample();
              }}
              className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-colors"
              title="Ver ejemplo práctico"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver ejemplo</span>
            </button>
          </div>
        ) : (
          <span className="text-xs text-slate-400 flex items-center gap-1">
            {isDragOver ? (
              <span className="text-amber-600 font-semibold animate-pulse">¡Suelta aquí!</span>
            ) : isSelected ? (
              <span className="text-indigo-600 font-semibold">Seleccionado</span>
            ) : (
              <span>Arrastra o haz clic</span>
            )}
          </span>
        )}
      </div>

      {/* Main explanation text */}
      <p className="text-slate-800 text-sm leading-relaxed font-normal">
        {block.definition}
      </p>

      {/* If matched, show a nice compact preview of the matched block */}
      {isMatched && (
        <div className="mt-3 pt-3 border-t border-emerald-200/80">
          <div className="text-[11px] font-semibold text-emerald-800 mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Bloque correspondiente:</span>
          </div>
          <ScratchBlockVisual block={block} isMatched={true} compact={true} />
        </div>
      )}

      {/* Shake error notice if shaking */}
      {isShaking && (
        <div className="mt-2 text-xs font-bold text-rose-600 flex items-center gap-1 animate-fadeIn">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>No coincide con esta instrucción. ¡Prueba con otra!</span>
        </div>
      )}
    </div>
  );
};
