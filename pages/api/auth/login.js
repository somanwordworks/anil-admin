import pool from "../../../utils/db";
import { signToken } from "../../../utils/auth";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { email, password } = req.body;

    try {
        // Fetch admin user
        const result = await pool.query(
            "SELECT * FROM admin_users WHERE email = $1 LIMIT 1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const admin = result.rows[0];

        // Compare plain text password
        if (admin.password !== password) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Issue JWT token
        const token = signToken({
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
        });

        return res.status(200).json({
            ok: true,
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        });
    } catch (err) {
        console.error("LOGIN ERROR:", err);
        return res.status(500).json({ error: "Server Error" });
    }
}
