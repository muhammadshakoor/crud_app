const express = require('express');
const cors = require('cors');
const db = require('./models');
require('dotenv').config(); // Load .env (needed for JWT_SECRET)

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const productRoutes = require('./routes/products.js');
const authRoutes = require('./routes/auth.js');
const { authenticate, authorize } = require('./middleware/authMiddleware.js');

// Register routes
app.use('/api', productRoutes);
app.use('/api/auth', authRoutes); // Add this line

const PORT = process.env.PORT || 8080;



db.sequelize.sync({ alter: true }) // Allow schema updates during development
    .then(() => {
        console.log('Database connected and synced');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.error('Database sync error:', err));

// db.sequelize.sync().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });
