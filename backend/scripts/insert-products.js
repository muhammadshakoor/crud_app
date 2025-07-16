const fs = require('fs').promises;
const path = require('path');
const db = require('../models');

async function insertProducts() {
    try {
        // Read JSON data
        const filePath = path.join(__dirname, '../data/data.json');
        const rawData = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(rawData);

        // Check if data array exists
        if (!jsonData.data || !Array.isArray(jsonData.data)) {
            throw new Error('Invalid JSON structure: "data" array not found');
        }

        // Map JSON data to match the products table schema
        const productsToInsert = jsonData.data.map(product => ({
            id: product.id,
            name: product.name,
            description: product.description,
            category: product.category.name,
            brand: product.brand.name,
            supplier: product.supplier.name,
            sku: product.sku,
            barcode: product.barcode,
            purchase_price: product.purchase_price ? parseFloat(product.purchase_price) : null,
            sale_price: product.sale_price ? parseFloat(product.sale_price) : null,
            wholesale_price: product.wholesale_price ? parseFloat(product.wholesale_price) : null,
            distributor_price: product.distributor_price ? parseFloat(product.distributor_price) : null,
            unit_of_measure: product.unit_of_measure,
            weight: product.weight,
            dimensions: product.dimensions,
            color: product.color,
            size: product.size,
            material: product.material,
            tax_rate: product.tax_rate ? parseFloat(product.tax_rate) : null,
            tax_category: product.tax_category,
            track_inventory: product.track_inventory,
            allow_backorder: product.allow_backorder,
            min_stock_level: product.min_stock_level,
            max_stock_level: product.max_stock_level,
            reorder_point: product.reorder_point,
            reorder_quantity: product.reorder_quantity,
            is_active: product.is_active,
            is_featured: product.is_featured,
            is_new: product.is_new,
            is_on_sale: product.is_on_sale,
            age_restricted: product.age_restricted,
            min_age_required: product.min_age_required,
            image_urls: product.image_urls,
            created_at: product.created_at,
            updated_at: product.updated_at,
            deleted_at: product.deleted_at,
            created_by: product.created_by,
            updated_by: product.updated_by
        }));

        // Sync database
        await db.sequelize.sync({ alter: true });

        // Perform bulk insert
        await db.products.bulkCreate(productsToInsert, {
            validate: true,
            individualHooks: true
        });

        console.log('Successfully inserted', productsToInsert.length, 'products into the database.');

        // Verify insertion
        const count = await db.products.count();
        console.log('Total products in database:', count);
    } catch (error) {
        console.error('Error inserting products:', error.message);
    } finally {
        // Close the database connection
        await db.sequelize.close();
    }
}

insertProducts();