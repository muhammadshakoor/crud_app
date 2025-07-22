// api/products.js
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
    try {
        if (req.method === 'GET') {
            const { rows } = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
            return res.status(200).json({
                products: rows,
                totalPages: 1, // hardcoded for now
                categories: [...new Set(rows.map(p => p.category))],
                brands: [...new Set(rows.map(p => p.brand))],
                suppliers: [...new Set(rows.map(p => p.supplier))],
            });
        } else {
            return res.status(405).json({ message: 'Method not allowed' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
