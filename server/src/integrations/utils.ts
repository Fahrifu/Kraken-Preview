import crypto from 'node:crypto';

export function hashPayload(value: unknown) {
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
