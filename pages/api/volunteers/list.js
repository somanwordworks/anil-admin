// /pages/api/volunteers/list.js
import pool from "../../../utils/db";

export default async function handler(req, res) {
  try {
    const { from, to, page = "1", limit = "10" } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.max(1, parseInt(limit, 10) || 10);
    const offset = (pageNum - 1) * pageLimit;

    // Base WHERE (you may extend later to handle is_deleted if it exists)
    let whereClauses = [];
    let params = [];

    // If both from and to provided -> filter by date (created_at::date)
    if (from && to) {
      // Validate basic format length (YYYY-MM-DD) — simple guard
      if (from.length !== 10 || to.length !== 10) {
        return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
      }
      params.push(from, to);
      whereClauses.push(`created_at::date BETWEEN $${params.length - 1} AND $${params.length}`);
    }

    const whereSql = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // 1) get total count
    const countQuery = `SELECT COUNT(*) AS total FROM movement_signups ${whereSql}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].total, 10) || 0;
    const totalPages = Math.ceil(total / pageLimit);

    // 2) fetch paginated rows — select only the required columns (exclude id, uuid)
    const dataQuery = `
      SELECT member_id, name, area, mobile, created_at
      FROM movement_signups
      ${whereSql}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;
    params.push(pageLimit, offset);

    const dataResult = await pool.query(dataQuery, params);

    return res.status(200).json({
      volunteers: dataResult.rows,
      total,
      page: pageNum,
      totalPages,
      limit: pageLimit,
    });
  } catch (err) {
    console.error("VOLUNTEERS LIST ERROR", err);
    return res.status(500).json({ error: "Server error" });
  }
}
