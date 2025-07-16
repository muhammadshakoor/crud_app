const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    process.exit(1);
}

// ✅ Signup Route (with username + role)
router.post('/signup', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ error: 'Missing fields' });
        }

        if (!['admin', 'user'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        const existingUser = await db.user.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.user.create({ username, password: hashedPassword, role });

        res.status(201).json({ id: newUser.id, username: newUser.username, role: newUser.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.user.findOne({ where: { username } });

        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ error: 'Invalid credentials' });



        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;

// // ✅ Register Route (Optional - alias for signup)
// router.post('/register', async (req, res) => {
//     const { username, password, role } = req.body;
//     if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await db.user.create({ username, password: hashed, role });
//     res.json(user);
// });


// const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const router = express.Router();
// const db = require('../models'); // assumes User model

// const JWT_SECRET = process.env.JWT_SECRET;

// // Signup: Admin or User manually specify role
// router.post('/signup', async (req, res) => {
//     try {
//         const { email, password, role } = req.body; // role: 'admin' or 'user'
//         if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
//         const hash = await bcrypt.hash(password, 10);
//         const user = await db.user.create({ email, password: hash, role });
//         res.status(201).json({ id: user.id, email: user.email });
//     } catch (err) {
//         res.status(500).json({ error: 'Signup failed' });
//     }
// });

// // Login
// router.post('/login', async (req, res) => {
//     const { username, password } = req.body;
//     const user = await db.user.findOne({ where: { username } });

//     if (!user) return res.status(401).json({ message: 'Invalid credentials' });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

//     const token = jwt.sign(
//         { id: user.id, username: user.username, role: user.role },
//         JWT_SECRET,
//         { expiresIn: '1h' });
//     res.json({ token, role: user.role });
// });

// // Register Route (optional, for testing)
// router.post('/register', async (req, res) => {
//     const { username, password, role } = req.body;
//     if (!['admin', 'user'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

//     const hashed = await bcrypt.hash(password, 10);

//     const user = await db.user.create({ username, password: hashed, role });
//     res.json(user);
// })

// module.exports = router;