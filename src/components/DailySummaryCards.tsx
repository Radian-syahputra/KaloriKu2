'use client';

import React from 'react';
import { Flame, Target, PieChart, ChevronRight } from 'lucide-react';

interface DailySummaryCardsProps {
  consumed: number;
  target: number;
  onViewDetail?: () => void;
}

export default function DailySummaryCards({
  consumed,
  target,
  onViewDetail,
}: DailySummaryCardsProps) {
  const remaining = Math.max(target - consumed, 0);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
          Ringkasan Hari Ini
        </h2>
        {onViewDetail && (
          <button
            onClick={onViewDetail}
            className="text-xs sm:text-sm font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer hover:underline"
          >
            Lihat Detail <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: Kalori Masuk */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2">
          <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
            <Flame className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Kalori Masuk
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {consumed.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-slate-500">kkal</span>
            </div>
          </div>
        </div>

        {/* Card 2: Target Harian */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2">
          <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Target className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Target Harian
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-blue-900 tracking-tight">
                {target.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-slate-500">kkal</span>
            </div>
          </div>
        </div>

        {/* Card 3: Sisa */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-center sm:flex-col sm:items-start gap-4 sm:gap-2">
          <div className="w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <PieChart className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-xs font-medium text-slate-500 block">
              Sisa
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-800 tracking-tight">
                {remaining.toLocaleString('id-ID')}
              </span>
              <span className="text-xs font-semibold text-slate-500">kkal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
