import { create } from 'zustand';
import axios from 'axios';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  birthDate?: string;
  height?: number;
  weight?: number;
  gender?: string;
  dailyCalorieTarget: number;
}

export interface FoodLogItem {
  _id?: string;
  id?: string;
  userId?: string;
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  portion: string;
  description: string;
  imageUrl?: string;
  date: string | Date;
}

export interface AnalysisResult {
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  portion: string;
  description: string;
  imageUrl?: string;
}

interface AppState {
  user: UserProfile | null;
  token: string | null;
  isLoadingUser: boolean;
  activeTab: 'home' | 'riwayat' | 'kamera' | 'profile' | 'auth';
  foodLogs: FoodLogItem[];
  isLoadingHistory: boolean;
  currentAnalysis: AnalysisResult | null;
  isAnalyzing: boolean;
  analysisError: string | null;

  // Actions
  setActiveTab: (tab: 'home' | 'riwayat' | 'kamera' | 'profile' | 'auth') => void;
  setUser: (user: UserProfile | null) => void;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  analyzeFood: (imageBase64OrFormData: string | FormData, sampleFoodName?: string) => Promise<AnalysisResult | null>;
  saveCurrentAnalysisToHistory: () => Promise<boolean>;
  deleteFoodLog: (id: string) => Promise<boolean>;
  updateProfileTarget: (target: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: {
    id: 'user-demo-1',
    name: 'Andi Pratama',
    email: 'andi.pratama@example.com',
    birthDate: '12 Januari 2000',
    height: 175,
    weight: 65,
    gender: 'Laki-laki',
    dailyCalorieTarget: 2000,
  },
  token: null,
  isLoadingUser: false,
  activeTab: 'home',
  foodLogs: [
    {
      id: '1',
      foodName: 'Nasi Ayam Goreng',
      calories: 480,
      carbs: 60,
      protein: 32,
      fat: 12,
      portion: 'Per porsi (± 250 gram)',
      description: 'Nasi putih dengan ayam goreng bumbu rempah dan lalapan segar.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago today
    },
    {
      id: '2',
      foodName: 'Salad Sayur',
      calories: 170,
      carbs: 15,
      protein: 5,
      fat: 8,
      portion: 'Per mangkok (± 180 gram)',
      description: 'Salad sayur segar dengan selada, tomat ceri, dan dressing olive oil.',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
      date: new Date(Date.now() - 1000 * 60 * 300).toISOString(), // earlier today
    },
    {
      id: '3',
      foodName: 'Mie Goreng',
      calories: 420,
      carbs: 58,
      protein: 14,
      fat: 16,
      portion: 'Per porsi (± 200 gram)',
      description: 'Mie goreng telur dengan sayuran sawi dan sedikit suwiran ayam.',
      imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
      date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // yesterday
    },
    {
      id: '4',
      foodName: 'Pisang',
      calories: 105,
      carbs: 27,
      protein: 1,
      fat: 0.3,
      portion: '1 buah sedang (± 118 gram)',
      description: 'Pisang matang segar kaya kalium dan serat alami.',
      imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
      date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    },
    {
      id: '5',
      foodName: 'Telur Rebus',
      calories: 78,
      carbs: 0.6,
      protein: 6.3,
      fat: 5.3,
      portion: '1 butir (± 50 gram)',
      description: 'Telur ayam rebus matang sempurna tinggi protein.',
      imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
      date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    },
  ],
  isLoadingHistory: false,
  currentAnalysis: null,
  isAnalyzing: false,
  analysisError: null,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setUser: (user) => set({ user }),

  setCurrentAnalysis: (analysis) => set({ currentAnalysis: analysis }),

  checkAuth: async () => {
    try {
      set({ isLoadingUser: true });
      const res = await axios.get('/api/auth/me', { withCredentials: true });
      if (res.data?.user) {
        set({ user: res.data.user });
      }
    } catch {
      // Keep default demo user for seamless preview if server auth is offline
    } finally {
      set({ isLoadingUser: false });
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // Ignore
    }
    set({ user: null, activeTab: 'auth' });
  },

  fetchHistory: async () => {
    try {
      set({ isLoadingHistory: true });
      const res = await axios.get('/api/history', { withCredentials: true });
      if (Array.isArray(res.data?.data)) {
        set({ foodLogs: res.data.data });
      }
    } catch {
      // History fallback already populated
    } finally {
      set({ isLoadingHistory: false });
    }
  },

  analyzeFood: async (imageBase64OrFormData, sampleFoodName) => {
    set({ isAnalyzing: true, analysisError: null });
    try {
      let payload: Record<string, unknown> = {};
      let isForm = false;

      if (typeof imageBase64OrFormData === 'string') {
        payload = {
          image: imageBase64OrFormData,
          foodHint: sampleFoodName,
        };
      } else {
        isForm = true;
      }

      const res = await axios.post(
        '/api/analyze',
        isForm ? imageBase64OrFormData : payload,
        {
          headers: isForm ? { 'Content-Type': 'multipart/form-data' } : { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );

      if (res.data?.success && res.data?.data) {
        const result: AnalysisResult = {
          ...res.data.data,
          imageUrl: res.data.data.imageUrl || (typeof imageBase64OrFormData === 'string' ? imageBase64OrFormData : ''),
        };
        set({ currentAnalysis: result, isAnalyzing: false });
        return result;
      } else {
        throw new Error(res.data?.error || 'Gagal menganalisis foto makanan');
      }
    } catch (err: unknown) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.error || err.message
        : err instanceof Error ? err.message : 'Terjadi kesalahan saat analisis';
      set({ analysisError: msg, isAnalyzing: false });
      return null;
    }
  },

  saveCurrentAnalysisToHistory: async () => {
    const { currentAnalysis, foodLogs } = get();
    if (!currentAnalysis) return false;

    try {
      // Send to server history
      await axios.post('/api/history', currentAnalysis, { withCredentials: true });
    } catch {
      // In offline/preview mode, still append to local state
    }

    const newLog: FoodLogItem = {
      id: 'log-' + Date.now(),
      foodName: currentAnalysis.foodName,
      calories: currentAnalysis.calories,
      carbs: currentAnalysis.carbs,
      protein: currentAnalysis.protein,
      fat: currentAnalysis.fat,
      portion: currentAnalysis.portion,
      description: currentAnalysis.description,
      imageUrl: currentAnalysis.imageUrl,
      date: new Date().toISOString(),
    };

    set({
      foodLogs: [newLog, ...foodLogs],
      activeTab: 'riwayat',
    });

    return true;
  },

  deleteFoodLog: async (id: string) => {
    const { foodLogs } = get();
    try {
      await axios.delete(`/api/history?id=${id}`, { withCredentials: true });
    } catch {
      // fallback
    }
    set({
      foodLogs: foodLogs.filter((item) => (item.id !== id && item._id !== id)),
    });
    return true;
  },

  updateProfileTarget: async (target: number) => {
    const { user } = get();
    if (!user) return;
    const updated = { ...user, dailyCalorieTarget: target };
    set({ user: updated });
    try {
      await axios.patch('/api/auth/me', { dailyCalorieTarget: target }, { withCredentials: true });
    } catch {
      // fallback
    }
  },
}));
