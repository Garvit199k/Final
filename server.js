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
        console.log('Register attempt:', { username, gender }); // Debug log

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

        console.log('Registration successful:', username); // Debug log
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error); // Debug log
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', username); // Debug log

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = users.get(username);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET || 'secret');
        console.log('Login successful:', username); // Debug log
        res.json({ token, gender: user.gender });
    } catch (error) {
        console.error('Login error:', error); // Debug log
        res.status(500).json({ error: error.message });
    }
});

// Protected route middleware
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            throw new Error('No token provided');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.username = decoded.username;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Please authenticate' });
    }
};

// Save score route
app.post('/api/scores', auth, (req, res) => {
    try {
        const { type, score } = req.body;
        const user = users.get(req.username);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (type === 'typing') {
            user.highScores.typing.push({
                wpm: score.wpm,
                accuracy: score.accuracy,
                duration: score.duration,
                date: new Date()
            });
            scores.typing.push({
                username: req.username,
                wpm: score.wpm,
                accuracy: score.accuracy,
                date: new Date()
            });
        } else if (type === 'dogRescue') {
            user.highScores.dogRescue.push({
                score: score.score,
                date: new Date()
            });
            scores.dogRescue.push({
                username: req.username,
                score: score.score,
                date: new Date()
            });
        }

        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error('Score save error:', error); // Debug log
        res.status(500).json({ error: error.message });
    }
});

// Get leaderboard route
app.get('/api/leaderboard/:type', (req, res) => {
    try {
        const { type } = req.params;
        let leaderboard = [];

        if (type === 'typing') {
            leaderboard = scores.typing
                .sort((a, b) => b.wpm - a.wpm)
                .slice(0, 10)
                .map(({ username, wpm, accuracy }) => ({
                    username,
                    wpm,
                    accuracy
                }));
        } else if (type === 'dogRescue') {
            leaderboard = scores.dogRescue
                .sort((a, b) => b.score - a.score)
                .slice(0, 10)
                .map(({ username, score }) => ({
                    username,
                    score
                }));
        }

        res.json(leaderboard);
    } catch (error) {
        console.error('Leaderboard error:', error); // Debug log
        res.status(500).json({ error: error.message });
    }
});

// Serve static files for any route not matching API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Something went wrong!' 
            : err.message
    });
});

const startServer = (port) => {
    const server = app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }).on('error', (error) => {
        if (error.code === 'EADDRINUSE') {
            console.log(`Port ${port} is busy, trying ${port + 1}`);
            startServer(port + 1);
        } else {
            console.error('Server error:', error);
        }
    });
};

const PORT = process.env.PORT || 3000;
startServer(PORT); 