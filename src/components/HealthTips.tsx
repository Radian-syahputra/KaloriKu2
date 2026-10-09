'use client';

import React, { useState } from 'react';
import { Lightbulb, Sprout, ChevronRight } from 'lucide-react';

const TIPS_LIST = [
  'Perbanyak konsumsi sayur dan buah untuk nutrisi yang lebih seimbang!',
  'Minum air putih minimal 8 gelas sehari untuk menjaga metabolisme optimal.',
  'Kunyah makanan secara perlahan untuk membantu pencernaan dan rasa kenyang lebih lama.',
  'Prioritaskan sumber protein berkualitas seperti telur, ikan, tahu, tempe, dan daging tanpa lemak.',
  'Kurangi konsumsi gula tambahan dan minuman berpemanis buatan.',
];

export default function HealthTips() {
  const [tipIndex, setTipIndex] = useState(0);

  const nextTip = () => {
    setTipIndex((prev) => (prev + 1) % TIPS_LIST.length);
  };

  return (
    <div className="w-full mt-5">
      <div className="flex items-center gap-1.5 mb-2.5">
        <Lightbulb className="w-4 h-4 text-amber-500 fill-amber-400" />
        <h3 className="text-sm font-bold text-slate-800">Tips Sehat</h3>
      </div>

      <button
        onClick={nextTip}
        className="w-full bg-emerald-50/90 hover:bg-emerald-100/90 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-xs">
            <Sprout className="w-5 h-5" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-emerald-950 leading-relaxed">
            {TIPS_LIST[tipIndex]}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-emerald-700 shrink-0 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
}
