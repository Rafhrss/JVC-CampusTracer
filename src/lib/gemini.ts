import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
    const result = await model.embedContent(text);
    // Gemini-embedding-001 supports Matryoshka Representation Learning (MRL).
    // We slice it to 768 dimensions to be fully compatible with standard vector databases.
    return result.embedding.values.slice(0, 768);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

export async function analyzeMatch(query: string, items: any[]): Promise<any[]> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `
      Anda adalah asisten AI untuk CampusTracer (Lost & Found).
      Pengguna mencari barang yang hilang/ditemukan dengan deskripsi: "${query}"
      
      Berikut adalah 3 barang teratas yang paling mirip dari database:
      ${JSON.stringify(items, null, 2)}
      
      Tugas Anda:
      1. Evaluasi seberapa cocok setiap barang dengan deskripsi pengguna (berikan match_percentage dari 0 hingga 100).
      2. Berikan "justification" singkat (maksimal 2 kalimat dalam bahasa Indonesia) mengapa barang ini cocok atau tidak cocok.
      
      Kembalikan hasilnya DALAM FORMAT JSON array persis seperti ini:
      [
        {
          "id": <id_barang>,
          "match_percentage": <persentase_0_sampai_100>,
          "justification": "<alasan_singkat>"
        }
      ]
      Pastikan tidak ada teks lain selain JSON array.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean markdown code blocks if any
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error('Error analyzing match with Gemini Flash:', error);
    return items.map(item => ({
      id: item.id,
      match_percentage: Math.round(item.similarity * 100),
      justification: "AI tidak dapat menganalisis justifikasi saat ini."
    }));
  }
}
