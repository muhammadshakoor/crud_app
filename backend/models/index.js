const Sequelize = require('sequelize');
const sequelize = require('../config/db');

// const db = { Sequelize, sequelize };
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('./user.model')(sequelize, Sequelize.DataTypes);
db.products = require('./product.model')(sequelize, Sequelize.DataTypes);

module.exports = db;



// const dbConfig = require('../config/db.js');
// const Sequelize = require("sequelize");

// const userModel = require('./user.model.js')(sequelize, Sequelize.DataTypes);
// db.user = userModel;

// const sequelize = new Sequelize(dbConfig.DATABASE_URL, {
//     dialect: dbConfig.dialect,
//     dialectOptions: dbConfig.dialectOptions,
//     pool: {
//         max: dbConfig.pool.max,
//         min: dbConfig.pool.min,
//         acquire: dbConfig.pool.acquire,
//         idle: dbConfig.pool.idle
//     }
// });

// const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;
// db.products = require("./product.model.js")(sequelize, Sequelize);
// db.user = require('./user.model.js')(sequelize, Sequelize);

// module.exports = db;