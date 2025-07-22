// api/update-product.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'PUT') return res.status(405).json({ error: 'Method Not Allowed' });

    const { id } = req.query;
    const data = req.body;

    try {
        const query = `
      UPDATE products
      SET name=$1, description=$2, category=$3, brand=$4, supplier=$5,
          sku=$6, barcode=$7, sale_price=$8, tax_rate=$9, track_inventory=$10, min_stock_level=$11, updatedAt=NOW()
      WHERE id=$12 RETURNING *
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
            id,
        ];

        const result = await pool.query(query, values);
        if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
}
