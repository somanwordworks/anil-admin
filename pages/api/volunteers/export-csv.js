// /pages/api/volunteers/export-csv.js
import pool from "../../../utils/db";

export default async function handler(req, res) {
  try {
    const { from, to } = req.query;

    let whereClauses = [];
    let params = [];

    if (from && to) {
      params.push(from, to);
      whereClauses.push(`created_at::date BETWEEN $1 AND $2`);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      SELECT member_id, name, area, mobile, created_at
      FROM movement_signups
      ${whereSql}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, params);

    // Create CSV content
    let csv = "Member ID,Name,Mobile,Area,Created At\n";

    result.rows.forEach((v) => {
      csv += `${v.member_id},${v.name},${v.mobile},${v.area},${new Date(
        v.created_at
      ).toLocaleDateString()}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="volunteers_${from || ""}_${to || ""}.csv"`
    );

    return res.status(200).send(csv);
  } catch (err) {
    console.error("CSV EXPORT ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}
