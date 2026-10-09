'use client';

import React, { useState } from 'react';
import {
  User as UserIcon,
  Settings,
  Bell,
  HelpCircle,
  LogOut,
  Edit2,
  Sprout,
  Check,
  X,
  Target,
  Download,
} from 'lucide-react';
import { useAppStore } from '@/src/store/useAppStore';

export default function ProfileView() {
  const { user, logout, updateProfileTarget, setActiveTab } = useAppStore();
  const [activeMenu, setActiveMenu] = useState<'profile' | 'settings' | 'notifications' | 'help'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [targetInput, setTargetInput] = useState(user?.dailyCalorieTarget || 2000);
  const [nameInput, setNameInput] = useState(user?.name || 'Andi Pratama');
  const [weightInput, setWeightInput] = useState(user?.weight || 65);
  const [heightInput, setHeightInput] = useState(user?.height || 175);
  const [notificationSaved, setNotificationSaved] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfileTarget(Number(targetInput) || 2000);
    setIsEditing(false);
    setNotificationSaved(true);
    setTimeout(() => setNotificationSaved(false), 3000);
  };

  const handleLogout = async () => {
    await logout();
    setActiveTab('auth');
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-2xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Edit Profil & Target Kalori</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  Target Kalori Harian (kkal)
                </label>
                <input
                  type="number"
                  min="500"
                  max="10000"
                  step="50"
                  value={targetInput}
                  onChange={(e) => setTargetInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-emerald-700"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Rekomendasi standar: 2.000 kkal per hari.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Berat Badan (kg)</label>
                  <input
                    type="number"
                    value={weightInput}
                    onChange={(e) => setWeightInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Tinggi Badan (cm)</label>
                  <input
                    type="number"
                    value={heightInput}
                    onChange={(e) => setHeightInput(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Sidebar Menu (Matching Screenshot #5) */}
        <div className="md:col-span-4 lg:col-span-3">
          <div className="bg-white rounded-3xl p-3 border border-slate-200 shadow-2xs space-y-1">
            <button
              onClick={() => setActiveMenu('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeMenu === 'profile'
                  ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Informasi Profil</span>
            </button>

            <button
              onClick={() => setActiveMenu('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeMenu === 'settings'
                  ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan</span>
            </button>

            <button
              onClick={() => setActiveMenu('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeMenu === 'notifications'
                  ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifikasi</span>
            </button>

            <button
              onClick={() => setActiveMenu('help')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeMenu === 'help'
                  ? 'bg-emerald-50 text-emerald-800 border-l-4 border-emerald-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>Bantuan</span>
            </button>

            <div className="pt-2 border-t border-slate-100">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Content (Matching Screenshot #5) */}
        <div className="md:col-span-8 lg:col-span-9">
          {notificationSaved && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Profil dan target kalori berhasil diperbarui!</span>
            </div>
          )}

          {activeMenu === 'profile' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-6">
                Profil Saya
              </h2>

              {/* Profile Card Header with Avatar & Edit Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  {/* User Avatar Illustration */}
                  <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-emerald-800 text-2xl font-black shrink-0 shadow-xs">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      {user?.name || 'Andi Pratama'}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {user?.email || 'andi.pratama@example.com'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 font-bold text-xs transition cursor-pointer self-start sm:self-center"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
              </div>

              {/* Informasi Akun Section (Matching Screenshot #5) */}
              <div className="mt-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                  Informasi Akun
                </h3>

                <div className="space-y-3.5 text-xs sm:text-sm">
                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Tanggal Lahir</span>
                    <span className="font-bold text-slate-800">{user?.birthDate || '12 Januari 2000'}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Tinggi Badan</span>
                    <span className="font-bold text-slate-800">{user?.height || 175} cm</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Berat Badan</span>
                    <span className="font-bold text-slate-800">{user?.weight || 65} kg</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Jenis Kelamin</span>
                    <span className="font-bold text-slate-800">{user?.gender || 'Laki-laki'}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-slate-500 font-medium">Target Kalori Harian</span>
                    <span className="font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {(user?.dailyCalorieTarget || 2000).toLocaleString('id-ID')} kkal
                    </span>
                  </div>
                </div>
              </div>

              {/* Motivational Banner (Matching Screenshot #5) */}
              <div className="mt-8 bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <p className="text-xs sm:text-sm font-bold text-emerald-900">
                  Jaga pola makan, jaga kesehatan!
                </p>
              </div>
            </div>
          )}

          {activeMenu === 'settings' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Pengaturan Aplikasi</h2>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200">
                  <div>
                    <h4 className="font-bold text-emerald-950">Unduh Source Code Proyek</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Download seluruh kode aplikasi (Next.js, Tailwind, Models, API) sebagai arsip ZIP.</p>
                  </div>
                  <a
                    href="/api/download-zip"
                    download="kaloriku-app.zip"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs shrink-0 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download ZIP</span>
                  </a>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800">Model AI Gemini</h4>
                    <p className="text-xs text-slate-400">gemini-3.8-flash (Cepat dan presisi)</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">Aktif</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800">Database</h4>
                    <p className="text-xs text-slate-400">MongoDB Mongoose / Local Memory Fallback</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-700 text-xs font-bold">Tersinkron</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'notifications' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Pengaturan Notifikasi</h2>
              <p className="text-xs text-slate-500">
                Pengingat minum air dan jadwal makan sehat diaktifkan secara otomatis.
              </p>
            </div>
          )}

          {activeMenu === 'help' && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs">
              <h2 className="text-lg font-black text-slate-900 tracking-tight mb-4">Pusat Bantuan KaloriKu</h2>
              <div className="space-y-3 text-xs sm:text-sm text-slate-600">
                <p><b>Bagaimana cara kerja analisis kalori?</b></p>
                <p className="text-slate-500">
                  Ambil foto makanan dengan kamera atau unggah dari galeri. Foto dikirim ke Gemini AI untuk mengenali hidangan dan mengestimasikan kalori serta makronutrisi.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
