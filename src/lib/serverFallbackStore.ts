/**
 * Server in-memory fallback store when MONGODB_URI is not yet provided by the user.
 * This guarantees the application runs immediately without runtime crashes.
 */

export interface FallbackUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  birthDate?: string;
  height?: number;
  weight?: number;
  gender?: string;
  dailyCalorieTarget: number;
  createdAt: Date;
}

export interface FallbackFoodLog {
  _id: string;
  userId: string;
  foodName: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  portion: string;
  description: string;
  imageUrl?: string;
  date: Date;
  createdAt: Date;
}

const fallbackUsers: FallbackUser[] = [
  {
    _id: 'user-default-1',
    name: 'Andi Pratama',
    email: 'andi.pratama@example.com',
    birthDate: '12 Januari 2000',
    height: 175,
    weight: 65,
    gender: 'Laki-laki',
    dailyCalorieTarget: 2000,
    createdAt: new Date(),
  },
];

const fallbackFoodLogs: FallbackFoodLog[] = [
  {
    _id: 'log-1',
    userId: 'user-default-1',
    foodName: 'Nasi Ayam Goreng',
    calories: 480,
    carbs: 60,
    protein: 32,
    fat: 12,
    portion: 'Per porsi (± 250 gram)',
    description: 'Nasi putih dengan ayam goreng bumbu rempah dan lalapan segar.',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    date: new Date(Date.now() - 1000 * 60 * 120),
    createdAt: new Date(),
  },
  {
    _id: 'log-2',
    userId: 'user-default-1',
    foodName: 'Salad Sayur',
    calories: 170,
    carbs: 15,
    protein: 5,
    fat: 8,
    portion: 'Per mangkok (± 180 gram)',
    description: 'Salad sayur segar dengan selada, tomat ceri, dan dressing olive oil.',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    date: new Date(Date.now() - 1000 * 60 * 300),
    createdAt: new Date(),
  },
  {
    _id: 'log-3',
    userId: 'user-default-1',
    foodName: 'Mie Goreng',
    calories: 420,
    carbs: 58,
    protein: 14,
    fat: 16,
    portion: 'Per porsi (± 200 gram)',
    description: 'Mie goreng telur dengan sayuran sawi dan sedikit suwiran ayam.',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=400&q=80',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24),
    createdAt: new Date(),
  },
  {
    _id: 'log-4',
    userId: 'user-default-1',
    foodName: 'Pisang',
    calories: 105,
    carbs: 27,
    protein: 1,
    fat: 0.3,
    portion: '1 buah sedang (± 118 gram)',
    description: 'Pisang matang segar kaya kalium dan serat alami.',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=400&q=80',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48),
    createdAt: new Date(),
  },
  {
    _id: 'log-5',
    userId: 'user-default-1',
    foodName: 'Telur Rebus',
    calories: 78,
    carbs: 0.6,
    protein: 6.3,
    fat: 5.3,
    portion: '1 butir (± 50 gram)',
    description: 'Telur ayam rebus matang sempurna tinggi protein.',
    imageUrl: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=400&q=80',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72),
    createdAt: new Date(),
  },
];

export const fallbackStore = {
  users: fallbackUsers,
  foodLogs: fallbackFoodLogs,
};
