
import pool from '../../../utils/db';

export default async function handler(req,res){
  if (req.method !== 'POST') return res.status(405).json({ error:'Method not allowed' });
  const { title, event_date, description, location } = req.body;
  try {
    const q = 'INSERT INTO schedule_events (title, event_date, description, location) VALUES ($1,$2,$3,$4) RETURNING *';
    const r = await pool.query(q, [title, event_date, description, location]);
    res.json({ ok:true, event: r.rows[0] });
  } catch(e){
    console.error(e);
    res.status(500).json({ error:'DB error' });
  }
}
