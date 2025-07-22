// api/get-all-products.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    try {
        const result = await pool.query('SELECT * FROM products ORDER BY "createdAt" DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch all products' });
    }
}
