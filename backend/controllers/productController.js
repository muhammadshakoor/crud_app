const db = require('../models');
const Product = db.products;

// Create a new product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        console.error('Create Product Error:', error);
        res.status(500).json({ message: 'Failed to create product', error });
    }
};

// Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.status(200).json(products);
    } catch (error) {
        console.error('Fetch Products Error:', error);
        res.status(500).json({ message: 'Failed to get products', error });
    }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Get Product Error:', error);
        res.status(500).json({ message: 'Failed to get product', error });
    }
};

// Update product by ID
exports.updateProduct = async (req, res) => {
    try {
        const [updated] = await Product.update(req.body, {
            where: { id: req.params.id }
        });

        if (updated) {
            const updatedProduct = await Product.findByPk(req.params.id);
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Update Product Error:', error);
        res.status(500).json({ message: 'Failed to update product', error });
    }
};

// Delete product by ID
exports.deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.destroy({
            where: { id: req.params.id }
        });

        if (deleted) {
            res.status(200).json({ message: 'Product deleted' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error('Delete Product Error:', error);
        res.status(500).json({ message: 'Failed to delete product', error });
    }
};
