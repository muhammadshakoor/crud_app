// api/add-products.js
import pool from './db';

function generateBarcode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const data = req.body;
        if (!data.barcode) data.barcode = generateBarcode();

        const fields = Object.keys(data);
        const values = Object.values(data);
        const placeholders = fields.map((_, i) => `$${i + 1}`);

        const query = `
      INSERT INTO products (${fields.join(',')})
      VALUES (${placeholders.join(',')})
      RETURNING *;
    `;

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product' });
    }
}
