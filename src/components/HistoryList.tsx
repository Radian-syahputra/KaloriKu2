'use client';

import React, { useState } from 'react';
import { Clock, Calendar, ChevronRight, Trash2, X, PlusCircle } from 'lucide-react';
import { useAppStore, FoodLogItem } from '@/src/store/useAppStore';

export default function HistoryList() {
  const { foodLogs, deleteFoodLog, setActiveTab } = useAppStore();
  const [selectedLog, setSelectedLog] = useState<FoodLogItem | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<string>('all');

  const formatLogDate = (dateStr: string | Date) => {
    try {
      const d = new Date(dateStr);
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const day = d.getDate();
      const month = months[d.getMonth()];
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year} • ${hours}:${minutes}`;
    } catch {
      return 'Baru saja';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto pb-12">
      {/* Title & Subtitle */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Riwayat Makanan
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Lihat daftar makanan yang sudah kamu analisis dan konsumsi.
        </p>
      </div>

      {/* Date selector dropdown / filter bar (Matching Screenshot #2) */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative inline-block">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 shadow-2xs">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 text-slate-800"
            >
              <option value="all">Semua Riwayat (Terbaru)</option>
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari Terakhir</option>
              <option value="month">Bulan Ini</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('kamera')}
          className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Makanan</span>
        </button>
      </div>

      {/* Food Logs List */}
      <div className="space-y-3">
        {foodLogs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-700">Belum Ada Riwayat</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Kamu belum memiliki catatan makanan. Ambil foto atau pilih dari galeri untuk mulai menganalisis!
            </p>
            <button
              onClick={() => setActiveTab('kamera')}
              className="mt-4 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700 transition cursor-pointer"
            >
              Mulai Analisis Foto
            </button>
          </div>
        ) : (
          foodLogs.map((item) => (
            <div
              key={item.id || item._id}
              onClick={() => setSelectedLog(item)}
              className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Thumbnail Image */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-100">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'
                    }
                    alt={item.foodName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Details */}
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors truncate">
                    {item.foodName}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    {formatLogDate(item.date)}
                  </p>
                </div>
              </div>

              {/* Calorie & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                  {item.calories} kkal
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="relative aspect-video bg-slate-100">
              <img
                src={
                  selectedLog.imageUrl ||
                  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
                }
                alt={selectedLog.foodName}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setSelectedLog(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {selectedLog.foodName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatLogDate(selectedLog.date)}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">
                    {selectedLog.calories}
                  </span>
                  <span className="text-xs font-bold text-slate-500 block">kkal</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 font-medium mt-1">
                Porsi: {selectedLog.portion || 'Per porsi'}
              </div>

              {selectedLog.description && (
                <p className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                  {selectedLog.description}
                </p>
              )}

              {/* Macro info */}
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <div className="bg-amber-50 p-2 rounded-xl border border-amber-100">
                  <span className="text-[10px] font-semibold text-amber-700 block">Karbohidrat</span>
                  <span className="text-sm font-black text-slate-800">{selectedLog.carbs || 0} g</span>
                </div>
                <div className="bg-blue-50 p-2 rounded-xl border border-blue-100">
                  <span className="text-[10px] font-semibold text-blue-700 block">Protein</span>
                  <span className="text-sm font-black text-slate-800">{selectedLog.protein || 0} g</span>
                </div>
                <div className="bg-purple-50 p-2 rounded-xl border border-purple-100">
                  <span className="text-[10px] font-semibold text-purple-700 block">Lemak</span>
                  <span className="text-sm font-black text-slate-800">{selectedLog.fat || 0} g</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  onClick={() => {
                    const id = selectedLog.id || selectedLog._id;
                    if (id) deleteFoodLog(id);
                    setSelectedLog(null);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Riwayat</span>
                </button>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
