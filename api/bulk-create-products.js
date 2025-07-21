// api/bulk-create-products.js
import pool from './db';

function generateBarcode() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const products = req.body;

        const values = products.map(product => {
            if (!product.barcode) product.barcode = generateBarcode();
            return `('${product.name}', '${product.description}', '${product.category}', '${product.barcode}')`; // Add required fields only
        }).join(',');

        const query = `INSERT INTO products (name, description, category, barcode) VALUES ${values};`;
        await pool.query(query);

        res.status(201).json({ message: 'Bulk products created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bulk creation failed' });
    }
}
