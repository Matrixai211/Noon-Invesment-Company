import { getSql } from '../lib/db.js';
import { allow, adminAuthorized } from '../lib/http.js';
import { leadSchema } from '../lib/validation.js';

export default async function handler(req, res) {
  if (!allow(req, res)) return;
  try {
    const sql = getSql();
    if (req.method === 'POST') {
      const parsed = leadSchema.safeParse(req.body);
      if (!parsed.success) return res.status(400).json({ ok:false, error:'Invalid submission' });
      const d = parsed.data;
      const rows = await sql`INSERT INTO crm_leads (lead_type,name,email,phone,company,country,interest,message,metadata) VALUES (${d.lead_type},${d.name},${d.email},${d.phone ?? null},${d.company ?? null},${d.country ?? null},${d.interest ?? null},${d.message ?? null},${JSON.stringify(d.metadata)}::jsonb) RETURNING id,lead_type,status,created_at`;
      return res.status(201).json({ ok:true, lead:rows[0] });
    }
    if (req.method === 'GET') {
      if (!adminAuthorized(req)) return res.status(401).json({ ok:false, error:'Unauthorized' });
      const rows = await sql`SELECT id,lead_type,name,email,phone,company,country,interest,message,status,source,metadata,created_at,updated_at FROM crm_leads ORDER BY created_at DESC LIMIT 200`;
      return res.status(200).json({ ok:true, leads:rows });
    }
    res.setHeader('Allow','GET, POST, OPTIONS');
    return res.status(405).json({ ok:false, error:'Method not allowed' });
  } catch (error) {
    console.error('leads api error', error);
    return res.status(500).json({ ok:false, error:'Server error' });
  }
}
