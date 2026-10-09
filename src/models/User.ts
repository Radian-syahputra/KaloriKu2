import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  birthDate?: string;
  height?: number;
  weight?: number;
  gender?: string;
  dailyCalorieTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: 6,
    },
    birthDate: {
      type: String,
      default: '12 Januari 2000',
    },
    height: {
      type: Number,
      default: 175,
    },
    weight: {
      type: Number,
      default: 65,
    },
    gender: {
      type: String,
      default: 'Laki-laki',
    },
    dailyCalorieTarget: {
      type: Number,
      default: 2000,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite in development HMR
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
