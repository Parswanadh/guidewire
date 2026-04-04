import jwt from 'jsonwebtoken';

const DEFAULT_JWT_SECRET = 'change-me-before-production';

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

  if ((process.env.NODE_ENV || '').toLowerCase() === 'production' && secret === DEFAULT_JWT_SECRET) {
    throw new Error('JWT_SECRET must be set in production');
  }

  return secret;
}

export function signAppToken(payload, options = { expiresIn: '7d' }) {
  return jwt.sign(payload, getJwtSecret(), options);
}

export function verifyAppToken(token) {
  return jwt.verify(token, getJwtSecret());
}
