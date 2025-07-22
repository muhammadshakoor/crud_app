// api/bulk-create-products.js
import pool from './db';

function generateBarcode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const products = req.body;

    if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'Invalid format' });
    }

    try {
        const values = [];
        for (let product of products) {
            values.push([
                product.name,
                product.description || '',
                product.category || '',
                product.brand || '',
                product.supplier || '',
                product.sku || '',
                product.barcode || generateBarcode(),
                product.sale_price,
                product.tax_rate || 0,
                product.track_inventory || false,
                product.min_stock_level || 0,
            ]);
        }

        const insertQueries = values.map((v) =>
            pool.query(
                `INSERT INTO products (name, description, category, brand, supplier, sku, barcode, sale_price, tax_rate, track_inventory, min_stock_level, createdAt, updatedAt)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,NOW(),NOW())`, v
            )
        );

        await Promise.all(insertQueries);
        res.status(201).json({ message: 'Products created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bulk creation failed' });
    }
}
