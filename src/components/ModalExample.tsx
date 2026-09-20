import React, { useEffect } from 'react';
import { ScratchBlock } from '../types';
import { CATEGORY_CONFIG } from '../data/scratchBlocks';
import { ScratchBlockVisual } from './ScratchBlockVisual';
import { X, CheckCircle2, Lightbulb, Code2, Play, Sparkles } from 'lucide-react';

interface Props {
  block: ScratchBlock;
  onClose: () => void;
}

export const ModalExample: React.FC<Props> = ({ block, onClose }) => {
  const cat = CATEGORY_CONFIG[block.category] || CATEGORY_CONFIG.movement;

  // Listen to Escape key to easily close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      id="example-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
    >
      <div
        id="example-modal-content"
        className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col animate-[scaleIn_0.25s_cubic-bezier(0.16,1,0.3,1)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top celebratory banner */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-4 text-white flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> ¡Unión Correcta!
              </span>
              <h3 className="font-bold text-lg text-white">Ejemplo de Uso en Scratch</h3>
            </div>
          </div>

          <button
            id="btn-close-modal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 space-y-5">
          {/* Visual block display */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex flex-col items-center justify-center text-center">
            <span className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">
              Bloque de {cat.name}
            </span>
            <div className="max-w-md w-full flex justify-center">
              <ScratchBlockVisual block={block} isMatched={false} />
            </div>
          </div>

          {/* Definition summary */}
          <div className="text-slate-700 text-sm leading-relaxed bg-indigo-50/60 border border-indigo-100 rounded-xl p-3.5">
            <strong className="text-indigo-950 font-semibold block mb-0.5">Definición:</strong>
            {block.definition}
          </div>

          {/* Practical project scenario */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Play className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ejemplo práctico: {block.exampleTitle}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {block.exampleExplanation}
            </p>
          </div>

          {/* Pseudo-code block representation */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wide">
              <Code2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Cómo se conecta en Scratch:</span>
            </div>
            <div className="bg-slate-900 text-emerald-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 shadow-inner overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {block.exampleProject}
            </div>
          </div>

          {/* Pro Tip */}
          {block.exampleTip && (
            <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-xs text-amber-900 leading-relaxed">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block text-amber-950 mb-0.5">Consejo Scratch:</strong>
                {block.exampleTip}
              </div>
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 rounded-b-3xl flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Presiona <kbd className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-mono text-[10px]">Esc</kbd> o el botón para seguir jugando
          </span>
          <button
            id="btn-modal-continue"
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <span>¡Entendido, continuar!</span>
            <span className="text-slate-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
