// api/get-products.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    try {
        const { page = 1, limit = 10, name, category, min_price, min_stock, brand, supplier } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);
        let filters = [];
        let values = [];
        let i = 1;

        if (name) {
            filters.push(`LOWER(name) LIKE LOWER($${i++})`);
            values.push(`%${name}%`);
        }
        if (category) {
            filters.push(`category = $${i++}`);
            values.push(category);
        }
        if (brand) {
            filters.push(`LOWER(brand) LIKE LOWER($${i++})`);
            values.push(`%${brand}%`);
        }
        if (supplier) {
            filters.push(`supplier = $${i++}`);
            values.push(supplier);
        }
        if (min_price) {
            filters.push(`sale_price >= $${i++}`);
            values.push(min_price);
        }
        if (min_stock) {
            filters.push(`min_stock_level >= $${i++}`);
            values.push(min_stock);
        }

        const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const productsQuery = `SELECT * FROM products ${where} ORDER BY created_at DESC LIMIT $${i++} OFFSET $${i}`;
        values.push(limit, offset);

        const countQuery = `SELECT COUNT(*) FROM products ${where}`;

        const productsResult = await pool.query(productsQuery, values);
        const countResult = await pool.query(countQuery, values.slice(0, values.length - 2));

        const totalPages = Math.ceil(Number(countResult.rows[0].count) / limit);
        const categories = [...new Set(productsResult.rows.map(p => p.category).filter(Boolean))];
        const brands = [...new Set(productsResult.rows.map(p => p.brand).filter(Boolean))];
        const suppliers = [...new Set(productsResult.rows.map(p => p.supplier).filter(Boolean))];

        res.status(200).json({
            products: productsResult.rows,
            totalPages,
            categories,
            brands,
            suppliers,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}
