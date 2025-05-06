# Typing Test & Dog Rescue Game

A full-stack web application featuring a typing test and an engaging dog rescue game. The platform includes user authentication, gender-based themes, leaderboards, and customizable time limits.

## Features

- User Registration and Login
- Typing Test with multiple time limits (30s, 60s, 2min)
- Dog Rescue Game
- Gender-based Themes (Male/Female)
- Global Leaderboards
- Real-time WPM and Accuracy tracking
- Responsive Design

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- Deployment: Vercel

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/typing-game
   JWT_SECRET=your-secret-key-here
   PORT=3000
   ```
   Replace `your-secret-key-here` with a secure random string.

4. Make sure MongoDB is running on your system

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open `http://localhost:3000` in your browser

## Deployment

To deploy on Vercel:

1. Create a Vercel account if you haven't already
2. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
3. Configure your environment variables in Vercel dashboard
4. Deploy:
   ```bash
   vercel
   ```

## Game Instructions

### Typing Test
- Select your preferred time limit
- Click "Start Test" to begin
- Type the displayed text as accurately and quickly as possible
- Your WPM and accuracy will be calculated in real-time
- Scores are automatically saved when the test ends

### Dog Rescue Game
- Use left and right arrow keys to move your character
- Catch falling dogs to rescue them
- Avoid obstacles (red blocks)
- Game ends if you hit an obstacle
- Your score is based on the number of dogs rescued

## Contributing

Feel free to submit issues and enhancement requests! 