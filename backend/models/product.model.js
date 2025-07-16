module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: true
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true
        },
        category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        brand: {
            type: Sequelize.STRING,
            allowNull: true
        },
        supplier: {
            type: Sequelize.STRING,
            allowNull: true
        },
        sku: {
            type: Sequelize.STRING,
            allowNull: true
        },
        barcode: {
            type: Sequelize.STRING,
            allowNull: true
        },
        purchase_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        sale_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        wholesale_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        distributor_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true
        },
        unit_of_measure: {
            type: Sequelize.STRING,
            allowNull: true
        },
        weight: {
            type: Sequelize.STRING,
            allowNull: true
        },
        dimensions: {
            type: Sequelize.STRING,
            allowNull: true
        },
        color: {
            type: Sequelize.STRING,
            allowNull: true
        },
        size: {
            type: Sequelize.STRING,
            allowNull: true
        },
        material: {
            type: Sequelize.STRING,
            allowNull: true
        },
        tax_rate: {
            type: Sequelize.DECIMAL(5, 2),
            allowNull: true
        },
        tax_category: {
            type: Sequelize.STRING,
            allowNull: true
        },
        track_inventory: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        allow_backorder: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        min_stock_level: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        max_stock_level: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        reorder_point: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        reorder_quantity: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_featured: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_new: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        is_on_sale: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        age_restricted: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        min_age_required: {
            type: Sequelize.INTEGER,
            allowNull: true
        },
        image_urls: {
            type: Sequelize.ARRAY(Sequelize.TEXT),
            allowNull: true
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'created_at' // Map to database column
        },
        updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
            field: 'updated_at' // Map to database column
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: true
        },
        updated_by: {
            type: Sequelize.UUID,
            allowNull: true
        }
    }, {
        timestamps: true, // Enable timestamps
        underscored: true // Use snake_case for automatically generated fields
    });
    return Product;
};