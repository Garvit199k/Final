const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory user storage (replace with a proper database in production)
let users = [];

// JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const path = req.url.split('/')[1]; // Get the path after /api/auth/

    if (path === 'register' && req.method === 'POST') {
        try {
            const { username, password, gender } = req.body;

            // Check if user already exists
            if (users.find(u => u.username === username)) {
                return res.status(400).json({ error: 'Username already exists' });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new user
            const user = {
                username,
                password: hashedPassword,
                gender
            };

            users.push(user);

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (path === 'login' && req.method === 'POST') {
        try {
            const { username, password } = req.body;

            // Find user
            const user = users.find(u => u.username === username);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Check password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Generate JWT token
            const token = jwt.sign(
                { username: user.username },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(200).json({
                token,
                gender: user.gender,
                username: user.username
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(404).json({ error: 'Not found' });
    }
}; 