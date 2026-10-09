import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/src/lib/db';
import FoodLog from '@/src/models/FoodLog';
import { verifyJwtToken } from '@/src/lib/auth';
import { fallbackStore } from '@/src/lib/serverFallbackStore';

export async function GET(req: NextRequest) {
  try {
    const tokenCookie = req.cookies.get('token')?.value;
    const authHeader = req.headers.get('authorization');
    const token = tokenCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    const payload = token ? verifyJwtToken(token) : null;
    const userId = payload?.userId || 'user-default-1';

    const isConnected = await connectDB().catch(() => null);

    if (isConnected) {
      const logs = await FoodLog.find({ userId }).sort({ date: -1 }).limit(100);
      return NextResponse.json({
        success: true,
        data: logs.map((l) => ({
          id: l._id.toString(),
          _id: l._id.toString(),
          userId: l.userId,
          foodName: l.foodName,
          calories: l.calories,
          carbs: l.carbs,
          protein: l.protein,
          fat: l.fat,
          portion: l.portion,
          description: l.description,
          imageUrl: l.imageUrl,
          date: l.date,
        })),
      });
    }

    // Fallback store
    const userLogs = fallbackStore.foodLogs
      .filter((l) => l.userId === userId || !payload) // if not logged in, show demo items
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      data: userLogs.map((l) => ({
        id: l._id,
        _id: l._id,
        userId: l.userId,
        foodName: l.foodName,
        calories: l.calories,
        carbs: l.carbs,
        protein: l.protein,
        fat: l.fat,
        portion: l.portion,
        description: l.description,
        imageUrl: l.imageUrl,
        date: l.date,
      })),
    });
  } catch (error: unknown) {
    console.error('History GET Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal memuat riwayat makanan' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const tokenCookie = req.cookies.get('token')?.value;
    const authHeader = req.headers.get('authorization');
    const token = tokenCookie || (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    const payload = token ? verifyJwtToken(token) : null;
    const userId = payload?.userId || 'user-default-1';

    const { foodName, calories, carbs, protein, fat, portion, description, imageUrl, date } = body;

    if (!foodName || calories === undefined) {
      return NextResponse.json(
        { success: false, error: 'Nama makanan dan kalori wajib diisi' },
        { status: 400 }
      );
    }

    const isConnected = await connectDB().catch(() => null);

    if (isConnected) {
      const created = await FoodLog.create({
        userId,
        foodName,
        calories: Number(calories),
        carbs: Number(carbs) || 0,
        protein: Number(protein) || 0,
        fat: Number(fat) || 0,
        portion: portion || 'Per porsi (± 250 gram)',
        description: description || '',
        imageUrl: imageUrl || '',
        date: date ? new Date(date) : new Date(),
      });

      return NextResponse.json({
        success: true,
        message: 'Makanan berhasil disimpan ke riwayat',
        data: created,
      });
    }

    // Fallback store
    const newLog = {
      _id: 'log-' + Date.now(),
      userId,
      foodName,
      calories: Number(calories),
      carbs: Number(carbs) || 0,
      protein: Number(protein) || 0,
      fat: Number(fat) || 0,
      portion: portion || 'Per porsi (± 250 gram)',
      description: description || '',
      imageUrl: imageUrl || '',
      date: date ? new Date(date) : new Date(),
      createdAt: new Date(),
    };

    fallbackStore.foodLogs.unshift(newLog);

    return NextResponse.json({
      success: true,
      message: 'Makanan berhasil disimpan ke riwayat (lokal)',
      data: newLog,
    });
  } catch (error: unknown) {
    console.error('History POST Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menyimpan riwayat makanan' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID log wajib disertakan' }, { status: 400 });
    }

    const isConnected = await connectDB().catch(() => null);

    if (isConnected) {
      await FoodLog.findByIdAndDelete(id);
      return NextResponse.json({ success: true, message: 'Item riwayat berhasil dihapus' });
    }

    // Fallback
    fallbackStore.foodLogs = fallbackStore.foodLogs.filter((l) => l._id !== id);
    return NextResponse.json({ success: true, message: 'Item riwayat berhasil dihapus' });
  } catch (error: unknown) {
    console.error('History DELETE Error:', error);
    return NextResponse.json(
      { success: false, error: 'Gagal menghapus riwayat' },
      { status: 500 }
    );
  }
}
