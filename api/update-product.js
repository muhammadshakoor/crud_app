// api/update-product.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { id } = req.query;
        const data = req.body;

        const fields = Object.keys(data);
        const values = Object.values(data);

        const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');

        const result = await pool.query(
            `UPDATE products SET ${setQuery} WHERE id = $${fields.length + 1} RETURNING *;`,
            [...values, id]
        );

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
}
