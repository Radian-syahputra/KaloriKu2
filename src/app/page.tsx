'use client';

import React from 'react';
import { Camera, Sparkles, Utensils } from 'lucide-react';
import { useAppStore } from '@/src/store/useAppStore';
import DailySummaryCards from '@/src/components/DailySummaryCards';
import DonutChart from '@/src/components/DonutChart';
import HealthTips from '@/src/components/HealthTips';

export default function HomePage() {
  const { user, foodLogs, setActiveTab } = useAppStore();

  // Compute today's consumed calories
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  const todayLogs = foodLogs.filter((log) => {
    try {
      const logTime = new Date(log.date).getTime();
      return logTime >= todayStart;
    } catch {
      return false;
    }
  });

  const consumedCalories = todayLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0) || 0;
  const targetCalories = user?.dailyCalorieTarget || 2000;

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 pb-12">
      {/* HERO BANNER (Matching Screenshot #1) */}
      <section className="relative overflow-hidden bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-xs flex flex-col-reverse md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-4 text-center md:text-left z-10">
          <div>
            <h2 className="text-base sm:text-xl font-bold text-slate-800">
              Halo, Selamat Datang di
            </h2>
            <h1 className="text-3xl sm:text-5xl font-black text-emerald-950 tracking-tight flex items-center justify-center md:justify-start gap-1.5 mt-0.5">
              Kalori<span className="text-emerald-600">Ku</span>
              <span className="text-emerald-500">🌿</span>
            </h1>
          </div>

          <p className="text-xs sm:text-base text-slate-500 max-w-md font-medium leading-relaxed">
            Yuk, mulai hidup lebih sehat dengan mengetahui jumlah kalori dari makananmu!
          </p>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('kamera')}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:scale-102 transition-all cursor-pointer group"
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Analisis Makanan</span>
            </button>
          </div>
        </div>

        {/* Hero Circular Meal Image (Matching Screenshot #1) */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full p-2 bg-gradient-to-tr from-emerald-100 via-emerald-50 to-white shadow-xl shadow-emerald-500/10 border-2 border-emerald-200/60">
            <img
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80"
              alt="Healthy Meal"
              className="w-full h-full object-cover rounded-full shadow-inner hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="absolute -bottom-2 -left-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-emerald-100 shadow-md flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-slate-800">Gemini AI Ready</span>
          </div>
        </div>
      </section>

      {/* RINGKASAN HARI INI & DONUT CHART (Matching Screenshot #1) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Summary Cards */}
          <div className="lg:col-span-8">
            <DailySummaryCards
              consumed={consumedCalories}
              target={targetCalories}
              onViewDetail={() => setActiveTab('riwayat')}
            />
          </div>

          {/* Donut Chart Visual */}
          <div className="lg:col-span-4 flex items-center justify-center pt-4 lg:pt-0 lg:border-l lg:border-slate-100">
            <DonutChart
              consumed={consumedCalories}
              target={targetCalories}
              size={170}
              strokeWidth={15}
            />
          </div>
        </div>

        {/* Health Tips Component (Matching Screenshot #1) */}
        <HealthTips />
      </section>
    </div>
  );
}
