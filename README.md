# Docker Heist

Docker Heist is a COMP-308 web-based game project built with React, Vite, Three.js, Node.js, Express, Apollo Server, GraphQL, MongoDB, and JWT authentication.

The current version includes:

- registration and login
- protected routes for Dashboard, Game, and Profile
- a Three.js placeholder scene for the mission screen
- mock gameplay actions that save progress through GraphQL
- achievement tracking
- active challenge data
- live leaderboard data from MongoDB
- development demo accounts and seeded presentation data

The project keeps the gameplay loop simple and presentation-friendly. It does not include multiplayer, AI mechanics, or final production balancing.

## Tech Stack

- Frontend: React, Vite, React Router, Apollo Client, Three.js
- Backend: Node.js, Express, Apollo Server, GraphQL
- Database: MongoDB with Mongoose
- Auth: JWT
- Testing: Vitest, React Testing Library

## Run The Project

### 1. Start MongoDB

Make sure MongoDB is running locally.

### 2. Start the server

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

Backend URLs:

- `http://localhost:4000`
- `http://localhost:4000/graphql`
- `http://localhost:4000/health`

In development mode, the server creates demo users and presentation data automatically.

Demo login:

- `demo@dockerops.com`
- `Demo123!`

### 3. Start the client

```bash
cd client
copy .env.example .env
npm install
npm run dev
```

Frontend URL:

- `http://localhost:5173`

## Run Tests

Client tests:

```bash
cd client
npm run test
```

Watch mode:

```bash
cd client
npm run test:watch
```

## Main Flow

1. Register a new user or log in with the demo account.
2. Open the Game page.
3. Use the mock mission buttons such as `Build Image` and `Patch Leak`.
4. Progress is saved through GraphQL.
5. Open Dashboard to review progress, achievements, recent match data, and active challenges.
6. Open Leaderboard to see real leaderboard entries sorted by score.

## Notes

- The game scene is still a placeholder scene, not a final Docker simulation.
- Gameplay actions are deterministic and simple on purpose for class presentation.
- The leaderboard is backed by `LeaderboardEntry` records and linked `GameProfile` data.
- Development presentation data is seeded automatically when the server starts outside production.
