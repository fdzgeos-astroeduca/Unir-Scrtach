import React from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { CATEGORY_CONFIG } from '../data/scratchBlocks';
import { ScratchCategory } from '../types';

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageCompletionStatus: boolean[];
  selectedCategoryFilter: ScratchCategory | 'all';
  onSelectCategoryFilter: (cat: ScratchCategory | 'all') => void;
}

export const PageNavigation: React.FC<Props> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageCompletionStatus,
  selectedCategoryFilter,
  onSelectCategoryFilter,
}) => {
  const categories = Object.keys(CATEGORY_CONFIG) as ScratchCategory[];

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          <button
            id="btn-prev-page"
            type="button"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Página anterior"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCompleted = pageCompletionStatus[idx];
              const isCurrent = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  id={`btn-page-${pageNum}`}
                  type="button"
                  onClick={() => onPageChange(pageNum)}
                  className={`
                    min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1
                    ${
                      isCurrent
                        ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-400'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }
                  `}
                >
                  <span>Pág {pageNum}</span>
                  {isCompleted && (
                    <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            id="btn-next-page"
            type="button"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Página siguiente"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Scratch Category Badges / Legend */}
        <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1">
            Categorías:
          </span>

          <button
            type="button"
            onClick={() => onSelectCategoryFilter('all')}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              selectedCategoryFilter === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            Todas
          </button>

          {categories.map((catKey) => {
            const cat = CATEGORY_CONFIG[catKey];
            const isSelected = selectedCategoryFilter === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => onSelectCategoryFilter(isSelected ? 'all' : catKey)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-medium transition-all ${
                  isSelected
                    ? 'ring-2 ring-offset-1 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
                style={{
                  backgroundColor: isSelected ? cat.color : undefined,
                  borderColor: isSelected ? cat.borderColor : undefined,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
