import pool from "../../../utils/db";

export default async function handler(req, res) {
  try {
    const today = new Date().toISOString().split("T")[0];

    const totalVolunteers = await pool.query(
      `SELECT COUNT(*) AS count FROM movement_signups`
    );

    const upcomingEvents = await pool.query(
      `SELECT COUNT(*) AS count
       FROM schedule_events
       WHERE is_deleted = FALSE AND event_date >= $1`,
      [today]
    );

    const pastEvents = await pool.query(
      `SELECT COUNT(*) AS count
       FROM schedule_events
       WHERE is_deleted = FALSE AND event_date < $1`,
      [today]
    );

    return res.status(200).json({
      totalVolunteers: parseInt(totalVolunteers.rows[0].count || 0),
      upcomingEvents: parseInt(upcomingEvents.rows[0].count || 0),
      pastEvents: parseInt(pastEvents.rows[0].count || 0),
    });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
