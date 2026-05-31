import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Serve static files from the React app, but don't serve index.html directly yet
app.use(express.static(path.join(__dirname, 'dist'), { index: false }));

// Handle all requests by injecting Runtime Environment Variables into index.html
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  fs.readFile(indexPath, 'utf8', (err, htmlData) => {
    if (err) {
      console.error('Error reading index.html:', err);
      return res.status(500).send('Error loading application');
    }
    
    // Inject runtime variables so React can read them from window.ENV
    const envScript = `<script>
      window.ENV = {
        VITE_SUPABASE_URL: "${process.env.VITE_SUPABASE_URL || ''}",
        VITE_SUPABASE_ANON_KEY: "${process.env.VITE_SUPABASE_ANON_KEY || ''}",
        VITE_GEMINI_API_KEY: "${process.env.VITE_GEMINI_API_KEY || ''}"
      };
    </script>`;
    
    const injectedHtml = htmlData.replace('</head>', `${envScript}</head>`);
    res.send(injectedHtml);
  });
});

app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
