// api/delete-product.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { id } = req.query;
        await pool.query(`DELETE FROM products WHERE id = $1`, [id]);
        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
