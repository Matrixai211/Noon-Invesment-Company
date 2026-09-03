import { getSql } from '../lib/db.js';
import { allow, adminAuthorized } from '../lib/http.js';
import { statusSchema } from '../lib/validation.js';

export default async function handler(req, res) {
  if (!allow(req, res)) return;
  if (req.method !== 'PATCH') return res.status(405).json({ ok:false, error:'Method not allowed' });
  if (!adminAuthorized(req)) return res.status(401).json({ ok:false, error:'Unauthorized' });
  const parsed = statusSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ ok:false, error:'Invalid request' });
  try {
    const sql = getSql();
    const { id, status } = parsed.data;
    const rows = await sql`UPDATE crm_leads SET status=${status} WHERE id=${id} RETURNING id,status,updated_at`;
    if (!rows[0]) return res.status(404).json({ ok:false, error:'Lead not found' });
    await sql`INSERT INTO audit_events (entity_type,entity_id,action,actor,metadata) VALUES ('crm_lead',${id},'status_changed','api',${JSON.stringify({status})}::jsonb)`;
    return res.status(200).json({ ok:true, lead:rows[0] });
  } catch (error) {
    console.error('lead status api error', error);
    return res.status(500).json({ ok:false, error:'Server error' });
  }
}
