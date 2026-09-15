import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prisma.ts';
import { normalizeLoginInput } from '../utils/authInput.ts';

const router = Router();

router.post('/login', async (req, res) => {
  const credentials = normalizeLoginInput(req.body);
  if ('error' in credentials) {
    const status = credentials.error === 'Email and password are required' ? 400 : 401;
    return res.status(status).json({ error: credentials.error });
  }

  const admin = await prisma.adminUser.findFirst({
    where: { email: { equals: credentials.email, mode: 'insensitive' } }
  });
  if (!admin || !(await bcrypt.compare(credentials.password, admin.passwordHash))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { sub: admin.id, email: admin.email },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, admin: { id: admin.id, email: admin.email } });
});

export default router;
