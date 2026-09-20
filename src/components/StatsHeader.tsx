import React from 'react';
import { RotateCcw, Volume2, VolumeX, CheckCircle2, XCircle, Target, Layers } from 'lucide-react';

interface Props {
  attempts: number;
  correctCount: number;
  incorrectCount: number;
  totalInPage: number;
  pageSize: 10 | 15;
  onPageSizeChange: (size: 10 | 15) => void;
  onQuickReset: () => void;
  onResetAll: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const StatsHeader: React.FC<Props> = ({
  attempts,
  correctCount,
  incorrectCount,
  totalInPage,
  pageSize,
  onPageSizeChange,
  onQuickReset,
  onResetAll,
  soundEnabled,
  onToggleSound,
}) => {
  const accuracy = attempts > 0 ? Math.round((correctCount / attempts) * 100) : 100;
  const progressPercent = totalInPage > 0 ? Math.round((correctCount / totalInPage) * 100) : 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 border-2 border-amber-500 shadow-sm flex items-center justify-center shrink-0">
              {/* Scratch Cat silhouette / Puzzle logo */}
              <svg className="w-6 h-6 text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Scratch Blocks Matcher</span>
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Práctica Interactiva
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Une cada bloque de la izquierda con su información en la derecha
              </p>
            </div>
          </div>

          {/* Stats & Quick Actions Toolbar */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
            {/* Stat Counters */}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200 text-xs">
              <div
                id="stat-attempts"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-2xs font-semibold text-slate-700"
                title="Total de intentos realizados"
              >
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                <span>Intentos: <strong className="text-slate-900">{attempts}</strong></span>
              </div>

              <div
                id="stat-correct"
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-2xs font-semibold text-emerald-700"
                title="Aciertos en esta página"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>{correctCount}/{totalInPage}</span>
              </div>

              {incorrectCount > 0 && (
                <div
                  id="stat-errors"
                  className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-2xs font-semibold text-rose-700"
                  title="Fallos en esta página"
                >
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span>{incorrectCount}</span>
                </div>
              )}

              <div
                id="stat-accuracy"
                className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-lg bg-white shadow-2xs font-semibold text-slate-700"
                title="Porcentaje de precisión"
              >
                <span className="text-slate-400">Precisión:</span>
                <span className={accuracy >= 80 ? 'text-emerald-600' : 'text-amber-600'}>
                  {accuracy}%
                </span>
              </div>
            </div>

            {/* Batch Size Selector (10 vs 15) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
              <span className="text-slate-400 text-[11px] px-1.5 hidden xl:inline flex items-center gap-1">
                <Layers className="w-3 h-3" /> Bloques:
              </span>
              <button
                id="btn-pagesize-10"
                type="button"
                onClick={() => onPageSizeChange(10)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  pageSize === 10
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Mostrar de 10 en 10"
              >
                10 por pág.
              </button>
              <button
                id="btn-pagesize-15"
                type="button"
                onClick={() => onPageSizeChange(15)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  pageSize === 15
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
                title="Mostrar de 15 en 15"
              >
                15 por pág.
              </button>
            </div>

            {/* Sound Mute Toggle */}
            <button
              id="btn-toggle-sound"
              type="button"
              onClick={onToggleSound}
              className={`p-2 rounded-xl border transition-colors ${
                soundEnabled
                  ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
              }`}
              title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Quick Reset Current Page */}
            <button
              id="btn-quick-reset"
              type="button"
              onClick={onQuickReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold text-xs shadow-xs transition-all"
              title="Reiniciar y reordenar aleatoriamente los bloques de esta página"
            >
              <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Reiniciar página</span>
            </button>

            {/* Reset All */}
            <button
              id="btn-reset-all"
              type="button"
              onClick={onResetAll}
              className="text-xs text-slate-500 hover:text-slate-700 underline px-1 hidden sm:inline"
              title="Reiniciar todo el ejercicio desde la página 1"
            >
              Reiniciar todo
            </button>
          </div>
        </div>

        {/* Mini progress bar on current page */}
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-emerald-400 to-emerald-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
