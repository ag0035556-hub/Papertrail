import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateMatchCutVideo } from './src/server/videoGenerator.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Serve static public assets
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Video generation API endpoint
  app.post('/api/generate-video', async (req, res) => {
    try {
      const { word, aspectRatio, sound, format } = req.body;
      const result = await generateMatchCutVideo({
        word: typeof word === 'string' ? word : 'Heaven',
        aspectRatio: aspectRatio === '9:16' ? '9:16' : aspectRatio === '16:9' ? '16:9' : '1:1',
        sound: typeof sound === 'string' ? sound : 'Paper shuffle',
        format: format === 'webm' ? 'webm' : 'mp4',
      });
      res.json(result);
    } catch (error) {
      console.error('Error generating video:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        videoUrl: '/assets/aistudio/VID-20261109-WA0001_2aec6ebf.mp4',
      });
    }
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
