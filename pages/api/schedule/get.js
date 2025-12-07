import pool from "../../../utils/db";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    const result = await pool.query(
      "SELECT * FROM schedule_events WHERE id = $1 LIMIT 1",
      [id]
    );

    if (result.rows.length === 0)
      return res.json({ ok: false, error: "Not found" });

    return res.json({ ok: true, event: result.rows[0] });
  } catch (err) {
    console.error("GET EVENT ERROR", err);
    return res.status(500).json({ ok: false });
  }
}
