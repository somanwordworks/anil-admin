import pool from "../../../utils/db";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { id } = req.body;

    try {
        const result = await pool.query(
            "UPDATE schedule_events SET is_deleted = TRUE WHERE id = $1",
            [id]
        );

        if (result.rowCount === 0) {
            return res.status(400).json({ success: false, error: "Event not found" });
        }

        return res.status(200).json({ success: true, message: "Event deleted (soft delete)" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        return res.status(500).json({ success: false, error: "Server error" });
    }
}
