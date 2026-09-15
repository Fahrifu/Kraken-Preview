export const MAX_EMAIL_LENGTH = 254;
export const MAX_PASSWORD_LENGTH = 256;

export function normalizeLoginInput(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { error: 'Email and password are required' } as const;
  }

  const { email, password } = body as Record<string, unknown>;

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Email and password are required' } as const;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return { error: 'Email and password are required' } as const;
  }

  if (normalizedEmail.length > MAX_EMAIL_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return { error: 'Invalid credentials' } as const;
  }

  return { email: normalizedEmail, password } as const;
}
