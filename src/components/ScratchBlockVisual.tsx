import React from 'react';
import { ScratchBlock } from '../types';
import { CATEGORY_CONFIG } from '../data/scratchBlocks';

interface Props {
  block: ScratchBlock;
  isSelected?: boolean;
  isMatched?: boolean;
  isShaking?: boolean;
  isDragging?: boolean;
  onClick?: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  className?: string;
  showCategoryBadge?: boolean;
  compact?: boolean;
}

export const ScratchBlockVisual: React.FC<Props> = ({
  block,
  isSelected = false,
  isMatched = false,
  isShaking = false,
  isDragging = false,
  onClick,
  onDragStart,
  onDragEnd,
  className = '',
  showCategoryBadge = false,
  compact = false,
}) => {
  const cat = CATEGORY_CONFIG[block.category] || CATEGORY_CONFIG.movement;

  // Helper to parse block text into tokens (text, inputs, dropdowns, icons)
  const renderFormattedBlockText = (text: string) => {
    // Regex matches:
    // (number) -> oval white pill
    // [text ▾] -> dropdown pill
    // [text] -> white rectangle input
    // <...> -> boolean input
    // ⚑ -> green flag
    // ↻ -> rotate right icon
    // ↺ -> rotate left icon
    const parts: React.ReactNode[] = [];
    const regex = /(\([^)]+\)|\[[^\]]+\]|<[^>]+>|⚑|↻|↺)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    let keyCounter = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(
          <span key={`txt-${keyCounter++}`} className="px-0.5 tracking-tight">
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }

      const val = match[0];
      if (val === '⚑') {
        parts.push(
          <span
            key={`flag-${keyCounter++}`}
            className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 bg-emerald-700/70 border border-emerald-400/80 rounded text-emerald-300 text-xs shadow-inner"
            title="Bandera Verde"
          >
            <svg
              className="w-3.5 h-3.5 fill-current text-emerald-400 drop-shadow-sm"
              viewBox="0 0 24 24"
            >
              <path d="M4 2v20M4 4h14l-2 5 2 5H4" stroke="currentColor" strokeWidth="2.5" fill="#4ade80" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        );
      } else if (val === '↻') {
        parts.push(
          <span key={`rot-r-${keyCounter++}`} className="inline-block mx-0.5 font-bold text-sm">
            ↻
          </span>
        );
      } else if (val === '↺') {
        parts.push(
          <span key={`rot-l-${keyCounter++}`} className="inline-block mx-0.5 font-bold text-sm">
            ↺
          </span>
        );
      } else if (val.startsWith('(') && val.endsWith(')')) {
        // Number / Reporter input
        const inner = val.slice(1, -1).trim();
        parts.push(
          <span
            key={`num-${keyCounter++}`}
            className="inline-flex items-center justify-center min-w-[22px] px-2 py-0.5 mx-1 bg-white text-slate-900 rounded-full font-bold text-[13px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] leading-tight select-none"
          >
            {inner || ' '}
          </span>
        );
      } else if (val.startsWith('[') && val.endsWith(']')) {
        const inner = val.slice(1, -1);
        if (inner.includes('▾')) {
          // Dropdown
          const clean = inner.replace('▾', '').trim();
          parts.push(
            <span
              key={`drop-${keyCounter++}`}
              className="inline-flex items-center gap-1 px-2 py-0.5 mx-1 bg-black/20 text-white rounded-md font-semibold text-[13px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)] border border-black/10 select-none"
            >
              <span>{clean}</span>
              <span className="text-[10px] opacity-80">▼</span>
            </span>
          );
        } else {
          // Text input
          parts.push(
            <span
              key={`input-${keyCounter++}`}
              className="inline-flex items-center justify-center min-w-[24px] px-2 py-0.5 mx-1 bg-white text-slate-900 rounded font-semibold text-[13px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] select-none"
            >
              {inner}
            </span>
          );
        }
      } else if (val.startsWith('<') && val.endsWith('>')) {
        // Boolean slot
        const inner = val.slice(1, -1).trim();
        parts.push(
          <span
            key={`bool-${keyCounter++}`}
            className="inline-flex items-center justify-center px-2 py-0.5 mx-1 bg-black/25 text-white/90 rounded-sm font-mono text-[12px] border border-black/20 italic select-none"
          >
            &lt; {inner || '...'} &gt;
          </span>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(
        <span key={`txt-${keyCounter++}`} className="px-0.5 tracking-tight">
          {text.substring(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  // Puzzle notch visuals for Scratch fidelity
  const renderNotches = () => {
    if (block.shape === 'hat') {
      return (
        // Top hat curved shape
        <div
          className="absolute -top-3 left-3 w-16 h-3.5 rounded-t-full border-t-2 border-x-2 pointer-events-none"
          style={{
            backgroundColor: cat.color,
            borderColor: cat.borderColor,
          }}
        />
      );
    }
    if (block.shape === 'stack' || block.shape === 'c-block') {
      return (
        <>
          {/* Top female notch (depression) */}
          <div
            className="absolute -top-[1px] left-4 w-4 h-1.5 rounded-b-sm shadow-inner pointer-events-none"
            style={{
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderLeft: `1px solid ${cat.borderColor}`,
              borderRight: `1px solid ${cat.borderColor}`,
              borderBottom: `1px solid ${cat.borderColor}`,
            }}
          />
          {/* Bottom male notch (protrusion) */}
          <div
            className="absolute -bottom-1.5 left-4 w-4 h-1.5 rounded-b-sm pointer-events-none shadow-sm"
            style={{
              backgroundColor: cat.color,
              borderLeft: `1px solid ${cat.borderColor}`,
              borderRight: `1px solid ${cat.borderColor}`,
              borderBottom: `2px solid ${cat.borderColor}`,
            }}
          />
        </>
      );
    }
    return null;
  };

  return (
    <div
      id={`block-${block.id}`}
      draggable={!isMatched}
      onClick={!isMatched ? onClick : undefined}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        backgroundColor: cat.color,
        borderColor: cat.borderColor,
      }}
      className={`
        relative group transition-all duration-200 select-none
        border-2 rounded-xl text-white font-medium
        shadow-[0_4px_10px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.4)]
        ${compact ? 'py-2 px-3 text-xs' : 'py-3 px-4 text-sm'}
        ${
          isMatched
            ? 'opacity-65 grayscale-[30%] cursor-default ring-2 ring-emerald-500/80'
            : 'cursor-grab active:cursor-grabbing hover:-translate-y-0.5 hover:shadow-lg'
        }
        ${isSelected ? 'ring-4 ring-amber-400 ring-offset-2 scale-[1.02] shadow-xl z-20' : ''}
        ${isShaking ? 'animate-[shake_0.4s_ease-in-out] ring-4 ring-rose-500' : ''}
        ${isDragging ? 'opacity-40 scale-95' : ''}
        ${className}
      `}
    >
      {renderNotches()}

      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-y-1 font-semibold text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
          {renderFormattedBlockText(block.text)}
        </div>

        {showCategoryBadge && (
          <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 bg-black/25 text-white/90 rounded-full">
            {cat.name}
          </span>
        )}

        {isMatched && (
          <span className="shrink-0 flex items-center justify-center w-5 h-5 bg-emerald-500 text-white rounded-full shadow-sm text-xs font-bold">
            ✓
          </span>
        )}
      </div>

      {block.shape === 'c-block' && (
        <div className="mt-2 pt-1 border-t border-white/20 flex items-center justify-between text-[11px] text-white/75 italic">
          <span>[código interior]</span>
          <span>fin</span>
        </div>
      )}
    </div>
  );
};
