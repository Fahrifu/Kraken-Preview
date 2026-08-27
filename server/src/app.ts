import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.ts';
import publicRoutes from './routes/public.ts';
import adminRoutes from './routes/admin.ts';
import syncRoutes from './routes/sync.ts';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'Kraken API',
    environment: process.env.VERCEL === '1' ? 'vercel' : 'local'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/admin/sync', syncRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

export default app;