import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.ts';
import publicRoutes from './routes/public.ts';
import adminRoutes from './routes/admin.ts';
import syncRoutes from './routes/sync.ts';

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT || 4000);

const localOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

const configuredOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([...localOrigins, ...configuredOrigins]);

app.use(cors({
  origin(origin, callback) {
    // Allow requests without an Origin header,
    // such as PowerShell, curl, Postman, etc.
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    console.error('Blocked CORS origin:', origin);
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'Kraken API' }));
app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/sync', syncRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Kraken API running on http://localhost:${port}`);
  console.log(`Allowed client origins: ${[...allowedOrigins].join(', ')}`);
});
