// api/auth.js
import pool from './db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { action, username, password, role } = req.body;

        if (!action || !username || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (action === 'signup') {
            if (!role || !['admin', 'user'].includes(role)) {
                return res.status(400).json({ error: 'Invalid or missing role' });
            }

            try {
                const existing = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                if (existing.rows.length > 0) {
                    return res.status(409).json({ error: 'Username already exists' });
                }

                const hashedPassword = await bcrypt.hash(password, 10);
                const result = await pool.query(
                    `INSERT INTO users (username, password, role, "createdAt", "updatedAt")
           VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, username, role`,
                    [username, hashedPassword, role]
                );

                return res.status(201).json(result.rows[0]);
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Signup failed' });
            }
        }

        if (action === 'login') {
            try {
                const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
                const user = result.rows[0];

                if (!user) return res.status(401).json({ error: 'Invalid credentials' });

                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );

                return res.status(200).json({ token, role: user.role });
            } catch (err) {
                console.error(err);
                return res.status(500).json({ error: 'Login failed' });
            }
        }

        if (action === 'logout') {
            // Just respond successfully — actual logout should be handled client-side by clearing the token
            return res.status(200).json({ message: 'Logged out' });
        }

        return res.status(400).json({ error: 'Invalid action' });
    }

    res.status(405).json({ error: 'Method not allowed' });
}
