// api/delete-product.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query;

    try {
        const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json({ message: 'Product deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
