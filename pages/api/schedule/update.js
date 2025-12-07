import pool from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    console.log("Invalid method:", req.method);
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { id, event_date, title, description, location, type } = req.body;

  console.log("Received update payload:", req.body);

  try {
    // Convert DD-MM-YYYY → YYYY-MM-DD
    let formattedDate = event_date;
    if (event_date.includes("-")) {
      const parts = event_date.split("-");
      if (parts[0].length === 2) {
        // DD-MM-YYYY format
        formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    console.log("Formatted date:", formattedDate);

    const result = await pool.query(
      `UPDATE schedule_events 
       SET event_date = $1, title = $2, description = $3, location = $4, type = $5, updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
      [formattedDate, title, description, location, type, id]
    );

    console.log("Update result:", result.rowCount);

    if (result.rowCount === 0) {
      return res.json({ ok: false, error: "Record not found" });
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("UPDATE EVENT ERROR", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
