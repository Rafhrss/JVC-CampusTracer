import fs from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

const env = fs.readFileSync('.env', 'utf8');
const keyMatch = env.match(/VITE_GEMINI_API_KEY=(.+)/);
if (keyMatch) {
  const key = keyMatch[1].trim();
  const ai = new GoogleGenerativeAI(key);
  const models = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.0-pro', 'gemini-2.5-flash'];
  
  (async () => {
    for (const m of models) {
      try {
        const model = ai.getGenerativeModel({ model: m, generationConfig: { responseMimeType: 'application/json' } });
        const res = await model.generateContent('Return empty json array []');
        console.log(m + ' SUCCESS: ' + res.response.text());
      } catch(e) {
        console.log(m + ' FAILED: ' + e.message);
      }
    }
  })();
}
