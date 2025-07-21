const express = require('express');
const router = express.Router();
const db = require('../models');
const { Op } = require('sequelize');
const { authenticate, authorize } = require('../middleware/authMiddleware');

router.get('/get/products', authenticate, authorize(['admin', 'user']), async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            name,
            category,
            min_price,
            min_stock,
            brand,
            supplier,
        } = req.query;

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 10;
        const offset = (pageNum - 1) * limitNum;

        const where = {};
        if (name) where.name = { [Op.iLike]: `%${name}%` };
        if (category) where.category = category;
        if (brand) where.brand = { [Op.iLike]: `%${brand}%` };
        if (supplier) where.supplier = supplier;
        if (min_price) where.sale_price = { [Op.gte]: parseFloat(min_price) };
        if (min_stock) where.min_stock_level = { [Op.gte]: parseInt(min_stock, 10) };

        const { count, rows: products } = await db.products.findAndCountAll({
            where,
            offset,
            limit: limitNum,
            order: [['createdAt', 'DESC']], // optional: newest first
        });

        const totalPages = Math.ceil(count / limitNum);

        res.json({
            products,
            totalPages,
            categories: [...new Set(products.map(p => p.category).filter(Boolean))],
            brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
            suppliers: [...new Set(products.map(p => p.supplier).filter(Boolean))],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET all products without pagination (for exporting)
router.get('/get/all-products', authenticate, authorize(['admin', 'user']), async (req, res) => {
    try {
        const products = await db.products.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch all products' });
    }
});


// Generate barcode function
const generateBarcode = () => {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

// POST /api/products
router.post('/add/products', authenticate, authorize(['admin']), async (req, res) => {
    try {
        // Auto barcode generate
        const data = req.body;

        if (!data.barcode) {
            data.barcode = generateBarcode(); // generate a random barcode if not provided
        }
        // ... (rest of the code remains the same)
        const product = await db.products.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// PUT /api/products/:id
router.put('/update/products/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const product = await db.products.findByPk(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        await product.update(req.body);
        res.json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update product' });
    }
});


// Delete a product
router.delete('/delete/products/:id', authenticate, authorize(['admin']), async (req, res) => {
    try {
        const product = await db.products.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        await product.destroy();
        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// Bulk create
router.post('/bulk-create/products', authenticate, async (req, res) => {
    try {
        const products = req.body;

        if (!Array.isArray(products)) {
            return res.status(400).json({ error: 'Invalid format' });
        }

        // Auto barcode generate
        const withBarcodes = products.map(product => ({
            ...product,
            barcode: product.barcode || generateBarcode(),
        }));

        // await db.products.bulkCreate(products);
        await db.products.bulkCreate(withBarcodes);
        res.status(201).json({ message: 'Products created successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Bulk creation failed' });
    }
});


module.exports = router;

// router.get('/get/products', authenticate, authorize(['admin', 'user']), async (req, res) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             name,
//             category,
//             min_price,
//             min_stock,
//             brand,
//             supplier,
//         } = req.query;

//         const pageNum = parseInt(page) || 1;
//         const limitNum = parseInt(limit) || 10;
//         const offset = (pageNum - 1) * limitNum;

//         const where = {};

//         if (name) where.name = { [Op.iLike]: `%${name}%` };
//         if (category) where.category = category;
//         // if (brand) where.brand = brand;
//         if (brand) where.brand = { [Op.iLike]: `%${brand}%` };
//         if (supplier) where.supplier = supplier;
//         if (min_price) where.sale_price = { [Op.gte]: parseFloat(min_price) };
//         if (min_stock) where.min_stock_level = { [Op.gte]: parseInt(min_stock, 10) };

//         // 1. Get all filtered products (no limit)
//         console.log('Filters Applied', where)
//         // const allFiltered = await db.products.findAll({ where });
//         const { count, rows: products } = await db.products.findAndCountAll({
//             where,
//             offset,
//             limit: limitNum,
//             order: [['createdAt', 'DESC']], // optional: newest first
//         });

//         const totalPages = Math.ceil(count / limitNum);
//         // 2. Extract unique values for filters
//         // const categories = [...new Set(allFiltered.map(p => p.category).filter(Boolean))];
//         // const brands = [...new Set(allFiltered.map(p => p.brand).filter(Boolean))];
//         // const suppliers = [...new Set(allFiltered.map(p => p.supplier).filter(Boolean))];

//         // 3. Paginate manually
//         const total = allFiltered.length;
//         // const totalPages = Math.ceil(total / parseInt(limit));
//         // const offset = (parseInt(page) - 1) * parseInt(limit);
//         // const paginated = allFiltered.slice(offset, offset + parseInt(limit));
//         // const totalPages = Math.ceil(total / limitNum);
//         // const offset = (pageNum - 1) * limitNum;
//         const paginated = allFiltered.slice(offset, offset + limitNum);

//         // 4. Return paginated result + full filter data
//         //         res.json({
//         //             products: paginated,
//         //             totalPages,
//         //             categories,
//         //             brands,
//         //             suppliers
//         //         });

//         //     } catch (error) {
//         //         console.error(error);
//         //         res.status(500).json({ error: 'Failed to fetch products' });
//         //     }
//         // });
//         res.json({
//             products,
//             totalPages,
//             categories: [...new Set(products.map(p => p.category).filter(Boolean))],
//             brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
//             suppliers: [...new Set(products.map(p => p.supplier).filter(Boolean))],
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// });

// Get all products
// router.get('/', async (req, res) => {
//     try {
//         const products = await db.products.findAll();
//         res.json(products);
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// });
// router.get('/', async (req, res) => {
//     try {
//         const { name, category, min_price, min_stock, brand, supplier } = req.query;

//         const where = {};

//         if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
//         if (category) where.category = category;
//         if (min_price) where.sale_price = { [db.Sequelize.Op.gte]: parseFloat(min_price) };
//         if (min_stock) where.min_stock_level = { [db.Sequelize.Op.gte]: parseInt(min_stock, 10) };
//         if (brand) where.brand = brand;
//         if (supplier) where.supplier = supplier;

//         const products = await db.products.findAll({ where });
//         res.json(products);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// });

// const { Op } = require('sequelize');
// router.get('/products', authenticate, authorize(['admin', 'user']), getProducts);

// router.get('/', async (req, res) => {
// router.get('/get/products', authenticate, authorize(['admin', 'user']), async (req, res) => {
//     try {
//         const {
//             page = 1,
//             limit = 10,
//             name,
//             category,
//             min_price,
//             min_stock,
//             brand,
//             supplier,
//         } = req.query;

//         const where = {};

//         if (name) {
//             where.name = { [Op.iLike]: `%${name}%` }; // case-insensitive
//         }
//         if (category) {
//             where.category = category;
//         }
//         if (brand) {
//             where.brand = brand;
//         }
//         if (supplier) {
//             where.supplier = supplier;
//         }
//         if (min_price) {
//             where.sale_price = { [Op.gte]: parseFloat(min_price) };
//         }
//         if (min_stock) {
//             where.min_stock_level = { [Op.gte]: parseInt(min_stock, 10) };
//         }

//         const offset = (parseInt(page) - 1) * parseInt(limit);

//         // const products = await db.products.findAll({ where });
//         // res.json(products);
//         const { count, rows: products } = await db.products.findAndCountAll({
//             where,
//             offset,
//             limit: parseInt(limit),
//             // order: [['created_at', 'DESC']],
//         })

//         const totalPages = Math.ceil(count / parseInt(limit));

//         // res.json({ products, totalPages }); // Send pagination data
//         res.json({
//             products,
//             totalPages,
//             categories: [...new Set(products.map(p => p.category).filter(Boolean))],
//             brands: [...new Set(products.map(p => p.brand).filter(Boolean))],
//             suppliers: [...new Set(products.map(p => p.supplier).filter(Boolean))],
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Failed to fetch products' });
//     }
// });

