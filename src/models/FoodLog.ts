import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFoodLog extends Document {
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
  updatedAt: Date;
}

const FoodLogSchema = new Schema<IFoodLog>(
  {
    userId: {
      type: String,
      required: [true, 'User ID wajib ada'],
      index: true,
    },
    foodName: {
      type: String,
      required: [true, 'Nama makanan wajib diisi'],
      trim: true,
    },
    calories: {
      type: Number,
      required: [true, 'Jumlah kalori wajib diisi'],
      min: 0,
    },
    carbs: {
      type: Number,
      default: 0,
      min: 0,
    },
    protein: {
      type: Number,
      default: 0,
      min: 0,
    },
    fat: {
      type: Number,
      default: 0,
      min: 0,
    },
    portion: {
      type: String,
      default: 'Per porsi (± 250 gram)',
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const FoodLog: Model<IFoodLog> =
  mongoose.models.FoodLog || mongoose.model<IFoodLog>('FoodLog', FoodLogSchema);

export default FoodLog;
