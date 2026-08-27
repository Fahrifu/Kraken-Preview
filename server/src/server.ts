import 'dotenv/config';
import app from './app.ts';

if (!process.env.JWT_SECRET) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

const port = Number(process.env.PORT || 4000);

app.listen(port, () => {
  console.log(`Kraken API running on http://localhost:${port}`);
});