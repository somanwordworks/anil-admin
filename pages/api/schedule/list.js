import pool from "../../../utils/db";

export default async function handler(req, res) {
    try {
        const { from, to } = req.query;

        // ⭐ Base query (your existing code)
        let query = `
      SELECT * 
      FROM schedule_events 
      WHERE is_deleted = FALSE
    `;

        let params = [];

        // ⭐ If date range is provided, apply filter
        if (from && to) {
            query += ` AND event_date BETWEEN $1 AND $2`;
            params.push(from, to);
        }

        // ⭐ Keep existing sorting
        query += " ORDER BY event_date ASC";

        const result = await pool.query(query, params);

        return res.status(200).json({ events: result.rows });

    } catch (err) {
        console.error("LIST ERROR", err);
        return res.status(500).json({ error: "Database error" });
    }
}
