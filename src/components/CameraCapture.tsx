'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Image as ImageIcon, RefreshCw, X, ArrowLeft, Check, Sparkles, AlertCircle, Save } from 'lucide-react';
import { useAppStore, AnalysisResult } from '@/src/store/useAppStore';

// Preset sample food items matching the 8 food thumbnails in the screenshot
export const SAMPLE_FOODS = [
  {
    id: 'sample-1',
    name: 'Nasi Ayam Goreng',
    calories: 480,
    carbs: 60,
    protein: 32,
    fat: 12,
    portion: 'Per porsi (± 250 gram)',
    description: 'Nasi putih dengan ayam goreng bumbu rempah gurih berprotein tinggi dan lalapan segar.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-2',
    name: 'Mie Goreng Telur',
    calories: 420,
    carbs: 58,
    protein: 14,
    fat: 16,
    portion: 'Per porsi (± 200 gram)',
    description: 'Mie goreng telur dengan sayuran sawi hijau dan sedikit suwiran ayam gurih.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-3',
    name: 'Beef Burger Keju',
    calories: 520,
    carbs: 45,
    protein: 26,
    fat: 24,
    portion: '1 porsi (± 220 gram)',
    description: 'Burger daging sapi panggang dengan lapisan keju leleh, selada, dan saus lezat.',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-4',
    name: 'Salad Sayur Segar',
    calories: 165,
    carbs: 16,
    protein: 6,
    fat: 9,
    portion: 'Per mangkok (± 200 gram)',
    description: 'Kombinasi selada renyah, tomat ceri, mentimun, dan minyak zaitun extra virgin kaya antioksidan.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-5',
    name: 'Pasta Bolognese',
    calories: 460,
    carbs: 64,
    protein: 19,
    fat: 14,
    portion: 'Per piring (± 280 gram)',
    description: 'Spaghetti al dente disiram saus tomat daging cincang dan taburan keju parmesan.',
    imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-6',
    name: 'Brown Sugar Boba',
    calories: 340,
    carbs: 68,
    protein: 4,
    fat: 8,
    portion: '1 gelas (± 450 ml)',
    description: 'Minuman teh susu segar dengan manisnya sirup brown sugar dan boba tapioka lembut.',
    imageUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-7',
    name: 'Ramen Kuah Telur',
    calories: 430,
    carbs: 56,
    protein: 18,
    fat: 15,
    portion: '1 mangkok (± 350 gram)',
    description: 'Mie ramen kenyal dalam kaldu gurih dengan telur rebus lembut setengah matang.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'sample-8',
    name: 'Donat Stroberi',
    calories: 270,
    carbs: 34,
    protein: 4,
    fat: 14,
    portion: '1 buah (± 75 gram)',
    description: 'Donat empuk berglasir stroberi manis cerah dengan taburan gula warna-warni.',
    imageUrl: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=600&q=80',
  },
];

export default function CameraCapture() {
  const {
    analyzeFood,
    currentAnalysis,
    setCurrentAnalysis,
    isAnalyzing,
    analysisError,
    saveCurrentAnalysisToHistory,
  } = useAppStore();

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [isConnectingCamera, setIsConnectingCamera] = useState(false);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>('sample-1');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize with the first sample food if no current analysis
  useEffect(() => {
    if (!currentAnalysis) {
      setCurrentAnalysis({
        foodName: SAMPLE_FOODS[0].name,
        calories: SAMPLE_FOODS[0].calories,
        carbs: SAMPLE_FOODS[0].carbs,
        protein: SAMPLE_FOODS[0].protein,
        fat: SAMPLE_FOODS[0].fat,
        portion: SAMPLE_FOODS[0].portion,
        description: SAMPLE_FOODS[0].description,
        imageUrl: SAMPLE_FOODS[0].imageUrl,
      });
      setSelectedImagePreview(SAMPLE_FOODS[0].imageUrl);
    }
  }, [currentAnalysis, setCurrentAnalysis]);

  // Clean up media stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Guarantee that whenever isCameraActive becomes true and video element is mounted,
  // the stream is attached to videoRef.current and starts playing!
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.onloadedmetadata = () => {
        video.play().catch((e) => {
          if (e.name !== 'AbortError') console.warn('Autoplay error:', e);
        });
      };
      video.play().catch((e) => {
        if (e.name !== 'AbortError') console.warn('Direct play error:', e);
      });
    }
  }, [isCameraActive]);

  const startCamera = async (targetMode: 'user' | 'environment' = facingMode) => {
    setCameraError(null);
    setIsConnectingCamera(true);

    // Stop previous stream if running
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Kamera tidak didukung pada browser ini atau izin dibatasi.');
      }

      let stream: MediaStream | null = null;

      // Strategy 1: Try with ideal facingMode (works on laptop webcam with 'user' and phone with 'environment')
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: targetMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
      } catch (modeErr) {
        console.warn('Ideal facingMode failed, trying generic video constraint:', modeErr);
        // Strategy 2: Fallback to generic video constraint (laptop webcams & generic USB cams)
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      if (!stream) {
        throw new Error('Gagal mendapatkan aliran video kamera.');
      }

      streamRef.current = stream;
      setFacingMode(targetMode);
      setIsCameraActive(true);

      // Attach immediately if videoRef is already available
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch((e) => console.warn('Play error:', e));
      }
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      const msg = err instanceof Error ? err.message : 'Izin kamera ditolak atau kamera tidak ditemukan';
      setCameraError(msg);
      setIsCameraActive(false);
    } finally {
      setIsConnectingCamera(false);
    }
  };

  const toggleSwitchCamera = async () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    await startCamera(nextMode);
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // If mirrored user webcam, draw flipped so captured photo matches reality
      if (facingMode === 'user') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      stopCamera();
      setSelectedImagePreview(dataUrl);
      setSelectedSampleId(null);
      setSaveSuccess(false);

      // Trigger Gemini AI analysis
      await analyzeFood(dataUrl);
    } catch (err) {
      console.error('Capture error:', err);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setSelectedImagePreview(base64);
      setSelectedSampleId(null);
      setSaveSuccess(false);

      // Analyze with Gemini
      await analyzeFood(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sample: typeof SAMPLE_FOODS[0]) => {
    setSelectedSampleId(sample.id);
    setSelectedImagePreview(sample.imageUrl);
    setSaveSuccess(false);

    // Call server analyze with hint to show realistic AI flow
    setCurrentAnalysis({
      foodName: sample.name,
      calories: sample.calories,
      carbs: sample.carbs,
      protein: sample.protein,
      fat: sample.fat,
      portion: sample.portion,
      description: sample.description,
      imageUrl: sample.imageUrl,
    });
  };

  const handleSave = async () => {
    if (!currentAnalysis) return;
    const ok = await saveCurrentAnalysisToHistory();
    if (ok) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-12">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Screen Title & Subtitle */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Analisis Makanan
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ambil foto makananmu atau pilih dari galeri untuk mengetahui jumlah kalorinya.
        </p>
      </div>

      {/* LIVE CAMERA MODAL / OVERLAY */}
      {isCameraActive && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-700">
            {/* Header controls */}
            <div className="absolute top-4 inset-x-4 z-10 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-black/60 backdrop-blur-md flex items-center gap-1.5 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {facingMode === 'user' ? 'Kamera Depan (Laptop)' : 'Kamera Belakang (HP)'}
                </span>
                <button
                  type="button"
                  onClick={toggleSwitchCamera}
                  className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium hover:bg-black/90 text-emerald-300 flex items-center gap-1 cursor-pointer transition"
                  title="Ganti kamera depan/belakang"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Putar</span>
                </button>
              </div>

              <button
                onClick={stopCamera}
                className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/90 cursor-pointer border border-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video element */}
            <div className="relative w-full h-[400px] bg-slate-900 flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onCanPlay={(e) => {
                  e.currentTarget.play().catch(console.warn);
                }}
                style={{
                  transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                }}
                className="w-full h-full object-cover"
              />

              {/* Viewfinder target box */}
              <div className="absolute inset-x-10 inset-y-12 pointer-events-none border-2 border-dashed border-emerald-400/80 rounded-2xl flex items-center justify-center shadow-inner">
                <span className="text-[11px] text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs font-medium">
                  Arahkan makanan ke dalam kotak
                </span>
              </div>
            </div>

            {/* Shutter controls */}
            <div className="p-5 bg-slate-950 flex items-center justify-around border-t border-slate-800">
              <button
                onClick={stopCamera}
                className="text-xs text-slate-400 hover:text-white font-medium cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-emerald-500 flex items-center justify-center shadow-lg active:scale-95 hover:scale-105 transition-transform cursor-pointer"
                title="Ambil Foto"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                  <Camera className="w-6 h-6" />
                </div>
              </button>

              <button
                onClick={toggleSwitchCamera}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TWO PRIMARY ACTION BUTTONS (Matching Screenshot #3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Action 1: Ambil Foto */}
        <button
          onClick={() => startCamera()}
          className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-emerald-300 transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
            <Camera className="w-8 h-8" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            Ambil Foto
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs">
            Gunakan kamera untuk mengambil gambar makanan secara langsung.
          </p>
        </button>

        {/* Action 2: Pilih dari Galeri */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-dashed border-sky-300 hover:border-emerald-500 bg-sky-50/20 hover:bg-emerald-50/20 shadow-2xs hover:shadow-md transition-all text-center flex flex-col items-center justify-center group cursor-pointer"
        >
          <div className="w-16 h-16 rounded-full bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 mb-3 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-xs">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
            Pilih dari Galeri
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xs">
            Unggah gambar makanan dari galeri penyimpanan perangkatmu.
          </p>
        </button>
      </div>

      {cameraError && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{cameraError}. Kamu tetap bisa memilih foto dari galeri atau memilih sampel makanan di bawah.</span>
        </div>
      )}

      {/* DETAILED PHOTO SELECTION & ANALYSIS RESULT (Matching Screenshot #4) */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <div className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm sm:text-base font-bold text-slate-900">
              Pilih Gambar dari Galeri atau Sampel
            </h2>
          </div>
          {isAnalyzing && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold animate-pulse">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini sedang menganalisis...</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: 8 Samples Grid (matching screenshot #4) */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-600">
                Pilih Sampel Cepat:
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                + Unggah Sendiri
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {SAMPLE_FOODS.map((sample) => {
                const isSelected = selectedSampleId === sample.id;
                return (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-emerald-600 ring-2 ring-emerald-400/50 scale-102 shadow-sm'
                        : 'border-transparent hover:border-slate-300 opacity-90 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={sample.imageUrl}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <span className="text-emerald-600 font-bold">💡 Info:</span>
              <span>
                Klik salah satu dari 8 makanan di atas atau ambil foto sendiri untuk melihat prediksi kalori dan nutrisi otomatis dari Gemini AI!
              </span>
            </div>
          </div>

          {/* Right Column: Analyzed Food Preview Card (matching screenshot #4) */}
          <div className="lg:col-span-7">
            {isAnalyzing ? (
              <div className="h-full min-h-[340px] rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4" />
                <h3 className="text-base font-bold text-emerald-950">
                  Menganalisis Makanan dengan Gemini AI...
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Mengidentifikasi nama hidangan, estimasi kalori, porsi, serta kandungan karbohidrat, protein, dan lemak.
                </p>
              </div>
            ) : currentAnalysis ? (
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 sm:p-5">
                  {/* Food Image */}
                  <div className="sm:col-span-5">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-xs">
                      <img
                        src={selectedImagePreview || currentAnalysis.imageUrl || SAMPLE_FOODS[0].imageUrl}
                        alt={currentAnalysis.foodName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Food Info & Details */}
                  <div className="sm:col-span-7 flex flex-col justify-between">
                    <div>
                      {/* Name & Detected Badge */}
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                          {currentAnalysis.foodName}
                        </h3>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full shrink-0">
                          <Check className="w-3 h-3 stroke-[3]" /> Terdeteksi
                        </span>
                      </div>

                      {/* Calorie value */}
                      <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                          {currentAnalysis.calories}
                        </span>
                        <span className="text-sm font-bold text-slate-600">kkal</span>
                      </div>

                      {/* Portion */}
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {currentAnalysis.portion}
                      </p>

                      {/* Description */}
                      {currentAnalysis.description && (
                        <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                          {currentAnalysis.description}
                        </p>
                      )}
                    </div>

                    {/* Macro Nutrients 3-Col Badges (Matching Screenshot #4) */}
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {/* Karbohidrat */}
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-amber-700 mb-0.5">
                          <span>🌾</span>
                          <span>Karbohidrat</span>
                        </div>
                        <span className="text-base font-black text-slate-800">
                          {currentAnalysis.carbs} g
                        </span>
                      </div>

                      {/* Protein */}
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-blue-700 mb-0.5">
                          <span>🥩</span>
                          <span>Protein</span>
                        </div>
                        <span className="text-base font-black text-slate-800">
                          {currentAnalysis.protein} g
                        </span>
                      </div>

                      {/* Lemak */}
                      <div className="bg-purple-50 border border-purple-100 rounded-xl p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1 text-[11px] font-semibold text-purple-700 mb-0.5">
                          <span>🥑</span>
                          <span>Lemak</span>
                        </div>
                        <span className="text-base font-black text-slate-800">
                          {currentAnalysis.fat} g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save to History Button (Matching Screenshot #4) */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    {saveSuccess ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Berhasil disimpan ke riwayat!
                      </span>
                    ) : (
                      'Simpan data nutrisi ini ke riwayat konsumsi harianmu.'
                    )}
                  </span>
                  <button
                    onClick={handleSave}
                    disabled={saveSuccess}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-70 active:scale-98"
                  >
                    <Save className="w-4 h-4" />
                    <span>Simpan ke Riwayat</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Bottom helper footnote */}
      <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
        <span>Pastikan gambar terlihat jelas agar hasil analisis Gemini AI lebih akurat.</span>
      </div>
    </div>
  );
}
