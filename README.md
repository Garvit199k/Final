# TypeRescue - Typing Test & Dog Rescue Game

A web application that combines typing practice with an engaging dog rescue game. Built with Node.js, Express, and vanilla JavaScript.

## Features

- **Typing Test Game**
  - Real-time character highlighting
  - WPM and accuracy tracking
  - Multiple time duration options
  - Instant feedback on typing performance

- **Dog Rescue Game**
  - Word-based gameplay
  - Score tracking
  - Progressive difficulty
  - Engaging animations

- **User System**
  - User registration and login
  - Gender-based themes
  - Score history tracking
  - Global leaderboards

## Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd typing-test-game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=3000
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

## Running the Application

### Development Mode

1. Start the server with hot reloading:
   ```bash
   npm run dev
   ```

2. In a separate terminal, start the client:
   ```bash
   npm run preview
   ```

3. Visit `http://localhost:8080` in your browser

### Production Mode

1. Start the server:
   ```bash
   npm start
   ```

2. Visit `http://localhost:3000` in your browser

## Deployment

The application is configured for deployment on Vercel:

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Project Structure

```
typing-test-game/
├── public/
│   ├── css/
│   │   ├── style.css
│   │   └── themes.css
│   ├── js/
│   │   ├── auth.js
│   │   ├── typing.js
│   │   ├── dogRescue.js
│   │   ├── leaderboard.js
│   │   └── ui.js
│   └── index.html
├── server.js
├── package.json
├── vercel.json
└── README.md
```

## API Endpoints

- `POST /api/register` - Register a new user
- `POST /api/login` - User login
- `POST /api/scores` - Save game scores (protected)
- `GET /api/leaderboard/:type` - Get leaderboard data

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 