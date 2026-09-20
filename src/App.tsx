/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ALL_SCRATCH_BLOCKS, CATEGORY_CONFIG } from './data/scratchBlocks';
import { ScratchBlock, ScratchCategory } from './types';
import { ScratchBlockVisual } from './components/ScratchBlockVisual';
import { DefinitionCard } from './components/DefinitionCard';
import { ModalExample } from './components/ModalExample';
import { StatsHeader } from './components/StatsHeader';
import { PageNavigation } from './components/PageNavigation';
import { PageCompleteBanner } from './components/PageCompleteBanner';
import { soundFx } from './utils/sound';
import { MousePointerClick, MoveRight, HelpCircle, CheckCircle2, AlertTriangle, ArrowUpDown } from 'lucide-react';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  // Page Configuration
  const [pageSize, setPageSize] = useState<10 | 15>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<ScratchCategory | 'all'>('all');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Filtered blocks pool based on category selection
  const poolBlocks = useMemo(() => {
    if (selectedCategoryFilter === 'all') {
      return ALL_SCRATCH_BLOCKS;
    }
    return ALL_SCRATCH_BLOCKS.filter((b) => b.category === selectedCategoryFilter);
  }, [selectedCategoryFilter]);

  // Total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(poolBlocks.length / pageSize));
  }, [poolBlocks.length, pageSize]);

  // Ensure current page is valid when totalPages changes
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Current slice of blocks for the current page
  const pageSourceBlocks = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return poolBlocks.slice(start, start + pageSize);
  }, [poolBlocks, currentPage, pageSize]);

  // Randomized Left Column (Blocks) and Right Column (Definitions)
  const [shuffledBlocks, setShuffledBlocks] = useState<ScratchBlock[]>([]);
  const [shuffledDefinitions, setShuffledDefinitions] = useState<ScratchBlock[]>([]);

  // Matching & Attempts State
  const [pageMatchedMap, setPageMatchedMap] = useState<Record<number, string[]>>({});
  const [attempts, setAttempts] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [incorrectCount, setIncorrectCount] = useState<number>(0);

  // Interaction State (Click-to-connect & Feedback)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [selectedDefId, setSelectedDefId] = useState<string | null>(null);
  const [shakeBlockId, setShakeBlockId] = useState<string | null>(null);
  const [shakeDefId, setShakeDefId] = useState<string | null>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);

  // Modal State
  const [activeExampleBlock, setActiveExampleBlock] = useState<ScratchBlock | null>(null);

  // Feedback Notification banner on error
  const [lastErrorMessage, setLastErrorMessage] = useState<string | null>(null);

  // Current matched IDs for active page
  const currentMatchedIds = useMemo(() => {
    return pageMatchedMap[currentPage] || [];
  }, [pageMatchedMap, currentPage]);

  // Shuffle both columns whenever page source blocks change or quick reset is triggered
  const randomizePage = useCallback(() => {
    if (pageSourceBlocks.length === 0) {
      setShuffledBlocks([]);
      setShuffledDefinitions([]);
      return;
    }

    // Shuffle left column blocks
    const left = shuffleArray(pageSourceBlocks);

    // Shuffle right column definitions independently
    let right = shuffleArray(pageSourceBlocks);

    // If size > 1 and by sheer luck the first item matches at index 0, shift it slightly to ensure genuine challenge
    if (right.length > 2 && right[0].id === left[0].id) {
      right = [...right.slice(1), right[0]];
    }

    setShuffledBlocks(left);
    setShuffledDefinitions(right);
    setSelectedBlockId(null);
    setSelectedDefId(null);
    setShakeBlockId(null);
    setShakeDefId(null);
    setLastErrorMessage(null);
  }, [pageSourceBlocks]);

  // Initialize or re-shuffle when page or page size changes
  useEffect(() => {
    randomizePage();
  }, [randomizePage]);

  // Sound sync
  useEffect(() => {
    soundFx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Check if current page is completely solved
  const isPageCompleted = useMemo(() => {
    return (
      pageSourceBlocks.length > 0 &&
      currentMatchedIds.length === pageSourceBlocks.length
    );
  }, [pageSourceBlocks.length, currentMatchedIds.length]);

  // Array of boolean completion flags for all pages
  const pageCompletionStatus = useMemo(() => {
    return Array.from({ length: totalPages }).map((_, idx) => {
      const pNum = idx + 1;
      const matched = pageMatchedMap[pNum] || [];
      const start = idx * pageSize;
      const countInPage = Math.min(pageSize, Math.max(0, poolBlocks.length - start));
      return countInPage > 0 && matched.length === countInPage;
    });
  }, [totalPages, pageMatchedMap, pageSize, poolBlocks.length]);

  // Quick reset for current page
  const handleQuickReset = () => {
    setPageMatchedMap((prev) => ({
      ...prev,
      [currentPage]: [],
    }));
    setAttempts(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    randomizePage();
    soundFx.playSelect();
  };

  // Reset entire application
  const handleResetAll = () => {
    setPageMatchedMap({});
    setAttempts(0);
    setCorrectCount(0);
    setIncorrectCount(0);
    setCurrentPage(1);
    randomizePage();
    soundFx.playSelect();
  };

  // Evaluation logic when a block and definition are paired
  const evaluatePair = (blockId: string, defId: string) => {
    setAttempts((prev) => prev + 1);

    if (blockId === defId) {
      // SUCCESS!
      soundFx.playSuccess();
      setCorrectCount((prev) => prev + 1);
      setLastErrorMessage(null);

      // Save match to page state
      setPageMatchedMap((prev) => {
        const existing = prev[currentPage] || [];
        if (!existing.includes(blockId)) {
          const nextMatched = [...existing, blockId];

          // If this completes the whole page!
          if (nextMatched.length === pageSourceBlocks.length) {
            setTimeout(() => {
              soundFx.playComplete();
              confetti({
                particleCount: 100,
                spread: 80,
                origin: { y: 0.6 },
              });
            }, 500);
          }

          return {
            ...prev,
            [currentPage]: nextMatched,
          };
        }
        return prev;
      });

      // Show the example popup!
      const matchedBlockObj = pageSourceBlocks.find((b) => b.id === blockId);
      if (matchedBlockObj) {
        setActiveExampleBlock(matchedBlockObj);
      }

      // Reset selection
      setSelectedBlockId(null);
      setSelectedDefId(null);
    } else {
      // INCORRECT!
      soundFx.playError();
      setIncorrectCount((prev) => prev + 1);

      // Visual shake feedback on both items
      setShakeBlockId(blockId);
      setShakeDefId(defId);

      // Explicit error message
      const wrongBlock = pageSourceBlocks.find((b) => b.id === blockId);
      const wrongName = wrongBlock ? `"${wrongBlock.text}"` : 'El bloque';
      setLastErrorMessage(
        `${wrongName} no coincide con esa información. Vuelve a su posición original en la izquierda.`
      );

      // Clear shake after animation completes
      setTimeout(() => {
        setShakeBlockId(null);
        setShakeDefId(null);
      }, 700);

      // Deselect immediately so the block stays in / returns to its left column slot
      setSelectedBlockId(null);
      setSelectedDefId(null);
    }
  };

  // Handle Drag & Drop
  const handleDragStartBlock = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.setData('text/plain', blockId);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggingBlockId(blockId);
    soundFx.playSelect();
  };

  const handleDragEndBlock = () => {
    setDraggingBlockId(null);
  };

  const handleDropOnDefinition = (defId: string, droppedBlockId: string) => {
    if (currentMatchedIds.includes(droppedBlockId) || currentMatchedIds.includes(defId)) {
      return;
    }
    evaluatePair(droppedBlockId, defId);
  };

  // Handle Click-To-Connect
  const handleClickBlock = (blockId: string) => {
    if (currentMatchedIds.includes(blockId)) return;
    soundFx.playSelect();

    if (selectedDefId) {
      // If a definition was already selected, evaluate pair
      evaluatePair(blockId, selectedDefId);
    } else {
      // Toggle or select this block
      setSelectedBlockId((prev) => (prev === blockId ? null : blockId));
    }
  };

  const handleClickDefinition = (defId: string) => {
    if (currentMatchedIds.includes(defId)) return;
    soundFx.playSelect();

    if (selectedBlockId) {
      // If a block was already selected, evaluate pair
      evaluatePair(selectedBlockId, defId);
    } else {
      // Toggle or select this definition
      setSelectedDefId((prev) => (prev === defId ? null : defId));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col selection:bg-amber-300 selection:text-slate-900">
      {/* Sticky Header with Stats & Actions */}
      <StatsHeader
        attempts={attempts}
        correctCount={currentMatchedIds.length}
        incorrectCount={incorrectCount}
        totalInPage={pageSourceBlocks.length}
        pageSize={pageSize}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
          setAttempts(0);
          setCorrectCount(0);
          setIncorrectCount(0);
        }}
        onQuickReset={handleQuickReset}
        onResetAll={handleResetAll}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* Page Navigation & Category Filter */}
      <PageNavigation
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => {
          setCurrentPage(page);
          soundFx.playSelect();
        }}
        pageCompletionStatus={pageCompletionStatus}
        selectedCategoryFilter={selectedCategoryFilter}
        onSelectCategoryFilter={(cat) => {
          setSelectedCategoryFilter(cat);
          setCurrentPage(1);
        }}
      />

      {/* Instructions & Help Banner */}
      <div className="bg-white/80 border-b border-slate-200/80 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              <MousePointerClick className="w-3.5 h-3.5" /> ¿Cómo jugar?
            </span>
            <span>
              <strong>Arrastra</strong> un bloque hasta su tarjeta o <strong>haz clic en ambos</strong> para unirlos.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Verde: Acertado y desbloquea ejemplo
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Rojo: Error (el bloque vuelve a su sitio)
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        {/* Error notification banner if any */}
        {lastErrorMessage && (
          <div className="mb-5 p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-center justify-between text-rose-800 text-xs sm:text-sm animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{lastErrorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setLastErrorMessage(null)}
              className="text-rose-500 hover:text-rose-800 font-bold px-2 text-base"
            >
              ✕
            </button>
          </div>
        )}

        {/* Selected block indicator banner if user clicked a block */}
        {selectedBlockId && !selectedDefId && (
          <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-400 rounded-2xl flex items-center justify-between text-amber-950 text-xs sm:text-sm animate-[fadeIn_0.15s_ease-out] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping inline-block" />
              <span>
                Bloque seleccionado. <strong>Ahora haz clic en la definición correcta</strong> de la columna derecha para unirlos.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedBlockId(null)}
              className="px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 rounded-lg hover:bg-amber-100"
            >
              Cancelar selección
            </button>
          </div>
        )}

        {/* Celebratory Completion Banner if current page is solved */}
        {isPageCompleted && (
          <PageCompleteBanner
            currentPage={currentPage}
            totalPages={totalPages}
            totalMatched={currentMatchedIds.length}
            attempts={attempts}
            onNextPage={() => {
              if (currentPage < totalPages) {
                setCurrentPage((p) => p + 1);
              }
            }}
            onReplayPage={handleQuickReset}
          />
        )}

        {/* Two Columns Grid: Left Blocks, Right Definitions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Scratch Blocks */}
          <section className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-400 font-black text-slate-950 text-xs shadow-2xs">
                  1
                </span>
                <h2 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                  Bloques de Instrucción
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {shuffledBlocks.length} instrucciones
              </span>
            </div>

            <div className="space-y-3">
              {shuffledBlocks.map((block) => {
                const isMatched = currentMatchedIds.includes(block.id);
                const isSelected = selectedBlockId === block.id;
                const isShaking = shakeBlockId === block.id;
                const isDragging = draggingBlockId === block.id;

                return (
                  <div key={`left-block-${block.id}`} className="transition-transform duration-200">
                    <ScratchBlockVisual
                      block={block}
                      isMatched={isMatched}
                      isSelected={isSelected}
                      isShaking={isShaking}
                      isDragging={isDragging}
                      onClick={() => handleClickBlock(block.id)}
                      onDragStart={(e) => handleDragStartBlock(e, block.id)}
                      onDragEnd={handleDragEndBlock}
                      showCategoryBadge={true}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Central Visual Connector (Desktop) */}
          <div className="hidden lg:flex lg:col-span-1 flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
            <div className="my-2 p-2 rounded-full bg-white border border-slate-200 shadow-xs">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 writing-mode-vertical">
              Unir
            </span>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent" />
          </div>

          {/* Right Column: Information / Definitions */}
          <section className="lg:col-span-6 space-y-3">
            <div className="flex items-center justify-between px-1 pb-1 border-b border-slate-300">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-indigo-600 font-black text-white text-xs shadow-2xs">
                  2
                </span>
                <h2 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
                  Información y Definiciones
                </h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {currentMatchedIds.length}/{shuffledDefinitions.length} completados
              </span>
            </div>

            <div className="space-y-3">
              {shuffledDefinitions.map((block) => {
                const isMatched = currentMatchedIds.includes(block.id);
                const isSelected = selectedDefId === block.id;
                const isShaking = shakeDefId === block.id;

                return (
                  <DefinitionCard
                    key={`right-def-${block.id}`}
                    block={block}
                    isMatched={isMatched}
                    isSelected={isSelected}
                    isShaking={isShaking}
                    onDropBlock={(droppedId) => handleDropOnDefinition(block.id, droppedId)}
                    onClickCard={() => handleClickDefinition(block.id)}
                    onShowExample={() => setActiveExampleBlock(block)}
                  />
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Floating Example Popup Modal on Correct Match */}
      {activeExampleBlock && (
        <ModalExample
          block={activeExampleBlock}
          onClose={() => setActiveExampleBlock(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Diseñado para aprender y dominar la programación por bloques en Scratch.
          </span>
          <div className="flex items-center gap-4">
            <span>Página {currentPage} de {totalPages}</span>
            <span>•</span>
            <span>{poolBlocks.length} bloques totales en el catálogo</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
