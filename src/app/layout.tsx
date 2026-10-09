import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/src/components/Navbar';

export const metadata: Metadata = {
  title: 'KaloriKu - Prediksi Kalori Makanan Cerdas & Nutrisi',
  description: 'Aplikasi prediksi kalori makanan cerdas dengan Gemini AI, pelacak nutrisi harian, dan riwayat makanan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}
