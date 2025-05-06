require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:8080',
            'http://localhost:3000',
            'http://127.0.0.1:8080',
            'http://127.0.0.1:3000',
            'https://final-sage-three.vercel.app'
        ];
        
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers,
        body: req.body,
        query: req.query
    });
    next();
});

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory storage (for development purposes)
const users = new Map();
const scores = {
    typing: [],
    dogRescue: []
};

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, gender } = req.body;
        console.log('Register attempt:', { username, gender });

        if (!username || !password || !gender) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (users.has(username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.set(username, {
            username,
            password: hashedPassword,
            gender,
            highScores: {
                typing: [],
                dogRescue: []
            }
        });

        console.log('Registration successful:', username);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username);

        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
        console.log('Login successful:', username);
        res.json({ token, gender: user.gender });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// Protected routes
app.post('/api/scores', authenticateToken, (req, res) => {
    try {
        const { type, score } = req.body;
        const username = req.user.username;
        
        if (!type || !score) {
            return res.status(400).json({ error: 'Invalid score data' });
        }

        const user = users.get(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Add score to user's history
        user.highScores[type].push({
            ...score,
            timestamp: new Date()
        });

        // Add to global leaderboard
        scores[type].push({
            username,
            ...score,
            timestamp: new Date()
        });

        // Sort and limit leaderboard
        scores[type].sort((a, b) => {
            if (type === 'typing') {
                return b.wpm - a.wpm;
            }
            return b.score - a.score;
        });
        scores[type] = scores[type].slice(0, 10);

        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Error saving score:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/leaderboard/:type', (req, res) => {
    try {
        const { type } = req.params;
        if (!scores[type]) {
            return res.status(400).json({ error: 'Invalid leaderboard type' });
        }
        res.json(scores[type]);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: error.message });
    }
});

// Serve static files for any route not matching API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 3000;
let currentPort = PORT;

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}`);
            startServer(port + 1);
        } else {
            console.error('Server error:', err);
        }
    });

    // Handle graceful shutdown
    process.on('SIGTERM', () => {
        server.close(() => {
            console.log('Server terminated');
            process.exit(0);
        });
    });

    process.on('SIGINT', () => {
        server.close(() => {
            console.log('Server terminated');
            process.exit(0);
        });
    });
}

startServer(currentPort); 