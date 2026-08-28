import crypto from 'node:crypto';

function safeEqual(left, right) {
  const a = Buffer.from(left ?? '');
  const b = Buffer.from(right ?? '');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function authenticateRequest(expectedToken) {
  return (req, res, next) => {
    const authorization = req.get('authorization') ?? '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7).trim() : '';
    if (!safeEqual(token, expectedToken)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    return next();
  };
}
