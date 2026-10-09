import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import HomePage from './app/page';
import KameraPage from './app/kamera/page';
import RiwayatPage from './app/riwayat/page';
import ProfilePage from './app/profile/page';
import AuthPage from './app/auth/page';
import { useAppStore } from './store/useAppStore';

export default function App() {
  const { activeTab, setActiveTab, checkAuth, fetchHistory } = useAppStore();

  useEffect(() => {
    // Check initial session and history
    checkAuth();
    fetchHistory();

    // Sync from URL if present
    const path = window.location.pathname;
    if (path.includes('/riwayat')) {
      setActiveTab('riwayat');
    } else if (path.includes('/kamera') || path.includes('/camera')) {
      setActiveTab('kamera');
    } else if (path.includes('/profile')) {
      setActiveTab('profile');
    } else if (path.includes('/auth')) {
      setActiveTab('auth');
    } else {
      setActiveTab('home');
    }
  }, [checkAuth, fetchHistory, setActiveTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar onNavigate={(tab) => {
        const routePath = tab === 'home' ? '/' : `/${tab}`;
        window.history.pushState({}, '', routePath);
      }} />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'riwayat' && <RiwayatPage />}
        {activeTab === 'kamera' && <KameraPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'auth' && <AuthPage />}
      </main>

      <footer className="border-t border-slate-200/80 bg-white py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">KaloriKu 🌿</span>
            <span>• Solusi Pelacak Kalori Cerdas dengan Gemini AI</span>
          </div>
          <div>
            <span>Ditenagai oleh Google Gemini & Mongoose</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
