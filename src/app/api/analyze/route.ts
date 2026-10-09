import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  let foodHint = '';
  try {
    let base64Data = '';
    let mimeType = 'image/jpeg';

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('image') as File | null;
      foodHint = (formData.get('foodHint') as string) || '';

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'File gambar makanan tidak ditemukan' },
          { status: 400 }
        );
      }

      mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      base64Data = Buffer.from(arrayBuffer).toString('base64');
    } else {
      const body = await req.json();
      const imageStr: string = body.image || '';
      foodHint = body.foodHint || '';

      if (!imageStr) {
        return NextResponse.json(
          { success: false, error: 'Gambar makanan (base64) wajib disertakan' },
          { status: 400 }
        );
      }

      // Check if data URI format (e.g. data:image/jpeg;base64,...)
      const match = imageStr.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      } else {
        base64Data = imageStr;
      }
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Using intelligent fallback analyzer.');
      // Fallback analyzer based on hint or default estimation
      const fallbackResult = getFallbackAnalysis(foodHint);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        note: 'Dianalisis menggunakan sistem estimasi default (karena GEMINI_API_KEY belum dikonfigurasi).',
      });
    }

    // Call Google GenAI SDK with gemini-3.8-flash
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const promptText = `Kamu adalah ahli gizi dan nutrisi profesional di aplikasi KaloriKu.
Analisis foto makanan yang diberikan secara akurat dan perkirakan nilai nutrisinya:
1. Nama makanan dalam bahasa Indonesia yang lazim dan spesifik (misal: "Nasi Ayam Goreng", "Mie Goreng Spesial", "Gado-Gado", "Salad Buah").
2. Total estimasi kalori (kkal) untuk 1 porsi standar.
3. Estimasi makronutrisi dalam gram: Karbohidrat (g), Protein (g), Lemak (g).
4. Estimasi ukuran porsi (contoh: "Per porsi (± 250 gram)", "1 mangkok (± 300 gram)").
5. Keterangan singkat tentang komposisi gizi dan tips kesehatan (1-2 kalimat).
${foodHint ? `Catatan/Petunjuk makanan dari pengguna: "${foodHint}".` : ''}

Kembalikan respon strictly dalam format JSON sesuai skema yang ditentukan.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: mimeType,
              },
            },
            {
              text: promptText,
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            foodName: {
              type: Type.STRING,
              description: 'Nama makanan dalam bahasa Indonesia',
            },
            calories: {
              type: Type.NUMBER,
              description: 'Total kalori dalam kkal (bilangan bulat)',
            },
            carbs: {
              type: Type.NUMBER,
              description: 'Estimasi karbohidrat dalam gram',
            },
            protein: {
              type: Type.NUMBER,
              description: 'Estimasi protein dalam gram',
            },
            fat: {
              type: Type.NUMBER,
              description: 'Estimasi lemak dalam gram',
            },
            portion: {
              type: Type.STRING,
              description: 'Ukuran porsi, misal "Per porsi (± 250 gram)"',
            },
            description: {
              type: Type.STRING,
              description: 'Keterangan nutrisi dan komposisi dalam bahasa Indonesia',
            },
          },
          required: ['foodName', 'calories', 'carbs', 'protein', 'fat', 'portion', 'description'],
        },
      },
    });

    const responseText = response.text?.trim() || '';
    if (!responseText) {
      throw new Error('Tidak ada respon teks yang diterima dari Gemini API.');
    }

    const parsedData = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      data: {
        foodName: parsedData.foodName || 'Makanan Terdeteksi',
        calories: Math.round(Number(parsedData.calories) || 350),
        carbs: Math.round(Number(parsedData.carbs) || 45),
        protein: Math.round(Number(parsedData.protein) || 20),
        fat: Math.round(Number(parsedData.fat) || 10),
        portion: parsedData.portion || 'Per porsi (± 250 gram)',
        description: parsedData.description || 'Porsi makanan seimbang dengan kombinasi nutrisi.',
      },
    });
  } catch (error: unknown) {
    console.error('Analyze Food Error:', error);
    if (foodHint) {
      const fallbackResult = getFallbackAnalysis(foodHint);
      return NextResponse.json({
        success: true,
        data: fallbackResult,
        note: 'Hasil diestimasi dari petunjuk makanan.',
      });
    }
    const msg = error instanceof Error ? error.message : 'Gagal memproses gambar makanan';
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

function getFallbackAnalysis(hint: string) {
  const lower = hint.toLowerCase();
  if (lower.includes('ayam') || lower.includes('chicken')) {
    return {
      foodName: 'Nasi Ayam Goreng',
      calories: 480,
      carbs: 60,
      protein: 32,
      fat: 12,
      portion: 'Per porsi (± 250 gram)',
      description: 'Nasi putih dengan ayam goreng rempah gurih berprotein tinggi dan lalapan sayur.',
    };
  }
  if (lower.includes('mie') || lower.includes('noodle')) {
    return {
      foodName: 'Mie Goreng Spesial',
      calories: 420,
      carbs: 58,
      protein: 14,
      fat: 16,
      portion: 'Per porsi (± 200 gram)',
      description: 'Mie telur tumis dengan potongan sayur segar, telur orak-arik, dan bumbu kecap manis.',
    };
  }
  if (lower.includes('burger')) {
    return {
      foodName: 'Beef Burger Keju',
      calories: 520,
      carbs: 45,
      protein: 26,
      fat: 24,
      portion: '1 porsi (± 220 gram)',
      description: 'Burger daging sapi panggang dengan lapisan keju cheddar, selada, dan saus gurih.',
    };
  }
  if (lower.includes('salad') || lower.includes('sayur')) {
    return {
      foodName: 'Salad Sayur Mediterania',
      calories: 165,
      carbs: 16,
      protein: 6,
      fat: 9,
      portion: 'Per mangkuk (± 200 gram)',
      description: 'Campuran selada romaine, mentimun, tomat ceri, dan dressing minyak zaitun kaya antioksidan.',
    };
  }
  if (lower.includes('boba') || lower.includes('tea')) {
    return {
      foodName: 'Brown Sugar Boba Milk Tea',
      calories: 340,
      carbs: 68,
      protein: 4,
      fat: 8,
      portion: '1 gelas reguler (± 450 ml)',
      description: 'Minuman susu segar dengan sirup gula aren manis dan mutiara tapioka kenyal.',
    };
  }
  if (lower.includes('telur') || lower.includes('egg')) {
    return {
      foodName: 'Telur Rebus Matang',
      calories: 78,
      carbs: 0.6,
      protein: 6.3,
      fat: 5.3,
      portion: '1 butir (± 50 gram)',
      description: 'Telur ayam rebus dengan sumber protein berkualitas tinggi dan asam amino esensial lengkap.',
    };
  }
  if (lower.includes('donut') || lower.includes('donat')) {
    return {
      foodName: 'Donat Glaze Stroberi',
      calories: 270,
      carbs: 34,
      protein: 4,
      fat: 14,
      portion: '1 buah (± 70 gram)',
      description: 'Donat lembut berbalut glasir stroberi manis dan taburan gula warna-warni.',
    };
  }
  return {
    foodName: 'Nasi Ayam Goreng Sehat',
    calories: 480,
    carbs: 60,
    protein: 32,
    fat: 12,
    portion: 'Per porsi (± 250 gram)',
    description: 'Nasi putih pulen dengan ayam goreng renyah bumbu rempah dan lalapan segar.',
  };
}
