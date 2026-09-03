export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ ok: true, service: 'noon-investment-company', databaseConfigured: Boolean(process.env.DATABASE_URL || process.env.POSTGRES_URL) });
}
