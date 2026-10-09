'use client';

import React from 'react';
import { Utensils, Home, Clock, Camera, User, Download } from 'lucide-react';
import { useAppStore } from '@/src/store/useAppStore';

interface NavbarProps {
  currentPath?: string;
  onNavigate?: (tab: 'home' | 'riwayat' | 'kamera' | 'profile' | 'auth') => void;
}

export default function Navbar({ currentPath, onNavigate }: NavbarProps) {
  const { activeTab, setActiveTab, user, logout } = useAppStore();

  const handleNav = (tab: 'home' | 'riwayat' | 'kamera' | 'profile' | 'auth') => {
    setActiveTab(tab);
    if (onNavigate) {
      onNavigate(tab);
    }
  };

  const isCurrent = (tab: 'home' | 'riwayat' | 'kamera' | 'profile') => {
    if (currentPath) {
      if (tab === 'home' && (currentPath === '/' || currentPath === '/home')) return true;
      if (tab === 'riwayat' && currentPath.includes('/riwayat')) return true;
      if (tab === 'kamera' && (currentPath.includes('/kamera') || currentPath.includes('/camera'))) return true;
      if (tab === 'profile' && currentPath.includes('/profile')) return true;
    }
    return activeTab === tab;
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => handleNav('home')}
          className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Utensils className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight text-emerald-950 flex items-center gap-1">
              Kalori<span className="text-emerald-600">Ku</span>
              <span className="inline-block text-emerald-500 text-sm">🌿</span>
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => handleNav('home')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isCurrent('home')
                ? 'text-emerald-700 bg-emerald-50/80 font-bold border-b-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>

          <button
            onClick={() => handleNav('riwayat')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isCurrent('riwayat')
                ? 'text-emerald-700 bg-emerald-50/80 font-bold border-b-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Riwayat</span>
          </button>

          <button
            onClick={() => handleNav('kamera')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isCurrent('kamera')
                ? 'text-emerald-700 bg-emerald-50/80 font-bold border-b-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Camera</span>
          </button>

          <button
            onClick={() => handleNav('profile')}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              isCurrent('profile')
                ? 'text-emerald-700 bg-emerald-50/80 font-bold border-b-2 border-emerald-600 shadow-2xs'
                : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>

        {/* User indicator & quick action */}
        <div className="flex items-center gap-2">
          {/* Direct Download ZIP Button */}
          <a
            href="/api/download-zip"
            download="kaloriku-app.zip"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-bold transition border border-slate-200 cursor-pointer shadow-2xs"
            title="Download seluruh source code sebagai file ZIP ke laptop"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download ZIP</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <button
                onClick={() => handleNav('profile')}
                className="hidden md:flex flex-col text-right hover:opacity-80 transition cursor-pointer"
              >
                <span className="text-xs font-semibold text-slate-800 line-clamp-1">{user.name}</span>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {user.dailyCalorieTarget.toLocaleString('id-ID')} kkal
                </span>
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-9 h-9 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-sm hover:ring-2 hover:ring-emerald-400 transition cursor-pointer"
                title="Buka profil"
              >
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('auth')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-xs transition"
            >
              Masuk
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
