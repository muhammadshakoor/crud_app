// api/get-products.js
import pool from './db';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });

    const {
        page = 1,
        limit = 10,
        name,
        category,
        brand,
        supplier,
        min_price,
        min_stock
    } = req.query;

    const offset = (page - 1) * limit;
    const where = [];

    if (name) where.push(`name ILIKE '%${name}%'`);
    if (category) where.push(`category='${category}'`);
    if (brand) where.push(`brand ILIKE '%${brand}%'`);
    if (supplier) where.push(`supplier='${supplier}'`);
    if (min_price) where.push(`sale_price >= ${min_price}`);
    if (min_stock) where.push(`min_stock_level >= ${min_stock}`);

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    try {
        const result = await pool.query(
            `SELECT * FROM products ${whereClause} ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`,
            [limit, offset]
        );
        const count = await pool.query(`SELECT COUNT(*) FROM products ${whereClause}`);

        const totalPages = Math.ceil(Number(count.rows[0].count) / limit);

        const categories = [...new Set(result.rows.map(p => p.category).filter(Boolean))];
        const brands = [...new Set(result.rows.map(p => p.brand).filter(Boolean))];
        const suppliers = [...new Set(result.rows.map(p => p.supplier).filter(Boolean))];

        res.status(200).json({
            products: result.rows,
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
