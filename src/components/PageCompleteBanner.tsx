import React from 'react';
import { Trophy, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface Props {
  currentPage: number;
  totalPages: number;
  totalMatched: number;
  attempts: number;
  onNextPage: () => void;
  onReplayPage: () => void;
}

export const PageCompleteBanner: React.FC<Props> = ({
  currentPage,
  totalPages,
  totalMatched,
  attempts,
  onNextPage,
  onReplayPage,
}) => {
  const hasNextPage = currentPage < totalPages;

  return (
    <div
      id="page-complete-banner"
      className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-[fadeIn_0.3s_ease-out]"
    >
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-inner">
          <Trophy className="w-8 h-8 text-amber-300 fill-amber-300" />
        </div>
        <div>
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-emerald-100 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> ¡Página {currentPage} completada con éxito!
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            ¡Has emparejado las {totalMatched} instrucciones!
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
            Completado en {attempts} intentos. ¡Excelente dominio de los bloques de Scratch!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          id="btn-replay-page"
          type="button"
          onClick={onReplayPage}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-sm transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Repetir página</span>
        </button>

        {hasNextPage ? (
          <button
            id="btn-next-page-banner"
            type="button"
            onClick={onNextPage}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-sm shadow-md transition-all active:scale-95"
          >
            <span>Ir a Página {currentPage + 1}</span>
            <ArrowRight className="w-4 h-4 text-emerald-700" />
          </button>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-white/20 text-white text-xs font-bold">
            🎉 ¡Todas las páginas superadas!
          </div>
        )}
      </div>
    </div>
  );
};
