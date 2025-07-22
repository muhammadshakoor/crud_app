// api/add-products.js
import pool from './db';

function generateBarcode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const data = req.body;

    if (!data.name || !data.sale_price) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!data.barcode) {
        data.barcode = generateBarcode();
    }

    try {
        const query = `
      INSERT INTO products (name, description, category, brand, supplier, sku, barcode, sale_price, tax_rate, track_inventory, min_stock_level, createdAt, updatedAt)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())
      RETURNING *
    `;
        const values = [
            data.name,
            data.description || '',
            data.category || '',
            data.brand || '',
            data.supplier || '',
            data.sku || '',
            data.barcode,
            data.sale_price,
            data.tax_rate || 0,
            data.track_inventory || false,
            data.min_stock_level || 0,
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add product' });
    }
}
