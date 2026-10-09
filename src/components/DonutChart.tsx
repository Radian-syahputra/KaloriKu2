'use client';

import React from 'react';

interface DonutChartProps {
  consumed: number;
  target: number;
  size?: number;
  strokeWidth?: number;
}

export default function DonutChart({
  consumed,
  target,
  size = 180,
  strokeWidth = 16,
}: DonutChartProps) {
  const safeTarget = target > 0 ? target : 2000;
  const percentage = Math.min(Math.round((consumed / safeTarget) * 100), 100);
  const remaining = Math.max(safeTarget - consumed, 0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const isOver = consumed > safeTarget;

  return (
    <div className="flex flex-col items-center justify-center p-2 relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="transform -rotate-90 drop-shadow-xs"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeLinecap="round"
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isOver ? '#ef4444' : '#10b981'}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Tercapai
          </span>
          <span className="text-2xl font-black text-slate-800 tracking-tight">
            {percentage}%
          </span>
          <span className="text-[11px] font-medium text-emerald-600 mt-0.5">
            {consumed.toLocaleString('id-ID')} / {safeTarget.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <span className="text-slate-600 font-medium">Masuk: <b>{consumed.toLocaleString('id-ID')} kkal</b></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300 inline-block"></span>
          <span className="text-slate-600 font-medium">Sisa: <b>{remaining.toLocaleString('id-ID')} kkal</b></span>
        </div>
      </div>
    </div>
  );
}
