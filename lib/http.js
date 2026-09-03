export function allow(req, res) {
  const origin = process.env.ALLOWED_ORIGIN;
  if (origin) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'OPTIONS') { res.status(204).end(); return false; }
  return true;
}

export function adminAuthorized(req) {
  const key = process.env.ADMIN_API_KEY;
  return Boolean(key && req.headers.authorization === `Bearer ${key}`);
}
