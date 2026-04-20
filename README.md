# Docker Heist

Docker Heist is a COMP-308 Exercise 2 web-based game project. Players manage a Docker-themed container fleet rendered with Three.js, recover crashed containers, earn score/XP/credits, complete AI challenge runs, and track progress through a GraphQL API backed by MongoDB.

## Course And Project

- Course: COMP-308 - Emerging Technologies
- Assignment: Group Project, Exercise 2 - Game / Programming Students
- Project type: Web-based game
- Project name: Docker Heist
- Group name: Group 2
- Team members: Angelica Cuadrado, Shane Duffney, raziel Mendoza
- Status: Local implementation complete. Deployment URL can be added after hosting.

## Live Links

After deployment 

- Frontend: Not deployed yet
- Backend API: Not deployed yet
- GraphQL endpoint: Not deployed yet

Local development URLs:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- GraphQL: `http://localhost:4000/graphql`
- Health check: `http://localhost:4000/health`

## Demo Account

The server seeds a demo account in development mode.

- Email: `demo@dockerops.com`
- Password: `Demo123!`

## Features

- JWT user registration and login
- Protected Dashboard, Game, and Profile pages
- React Vite frontend with functional components
- Apollo Client integration with GraphQL
- Interactive Three.js game scene
- Clickable Docker containers with raycast selection
- Docker command actions:
  - `docker start`
  - `docker stop`
  - `docker restart`
  - `docker commit`
- Score, XP, level, health, reputation, credits, and mission progress tracking
- Game-over state when container health reaches zero
- Async AI challenge mode against an Adaptive Sentinel AI
- Achievement unlocks based on gameplay milestones
- Cosmetic unlock rewards
- MongoDB-backed leaderboard
- Dashboard with profile, achievements, recent matches, active challenges, and live events
- Profile page with reward display, progress reset, and match-history clearing
- Backend live game event feed for near real-time presentation updates
- Development seed data for demo users, leaderboard entries, and challenges

## Tech Stack

- Frontend: React 18, Vite, React Router, Apollo Client, Three.js
- Backend: Node.js, Express, Apollo Server, GraphQL
- Database: MongoDB with Mongoose
- Authentication: JWT with bcrypt password hashing
- Styling: CSS with responsive layouts
- Testing: Vitest and React Testing Library

## Project Structure

```text
FinalProject/
  client/
    src/
      components/
      context/
      graphql/
      pages/
      services/
      styles/
    package.json
    vite.config.js
  server/
    src/
      config/
      graphql/
      middleware/
      models/
      routes/
      utils/
      index.js
    package.json
  COMP308W25GroupProject.docx
  IMPLEMENTATION_PHASES.md
  README.md
```

## Environment Variables

### Server

Create `server/.env`:

```env
PORT=4000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=replace-with-a-secure-secret-comp308
CLIENT_URL=http://localhost:5173
```

The backend CORS configuration also allows common Vite development origins on ports `5173` and `5174`.

### Client

Create `client/.env`:

```env
VITE_GRAPHQL_URL=http://localhost:4000/graphql
```

## Run The Project Locally

### 1. Install Server Dependencies

```bash
cd server
npm install
```

### 2. Start The Server

```bash
cd server
npm run dev
```

Expected backend URLs:

- `http://localhost:4000`
- `http://localhost:4000/graphql`
- `http://localhost:4000/health`

### 3. Install Client Dependencies

```bash
cd client
npm install
```

### 4. Start The Client

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

## How To Demo

1. Open `http://localhost:5173`.
2. Register a new user or log in with the demo account.
3. Open the Game page.
4. Click containers on the Three.js Docker whale.
5. Use Docker command actions to manage the fleet.
6. Watch score, XP, level, and health update.
7. Select an AI challenge and submit the current run.
8. Open Dashboard to show MongoDB-backed progress, achievements, matches, challenges, and live events.
9. Open Leaderboard to show ranked scores.
10. Open Profile to show rewards, cosmetics, and progress-management operations.
11. Open GraphQL at `http://localhost:4000/graphql` to demonstrate API queries and mutations.

## Main GraphQL Operations

Queries:

- `me`
- `currentUser`
- `profile`
- `gameProfile`
- `dashboard`
- `leaderboard`
- `getLeaderboard`
- `achievements`
- `getAchievements`
- `challenges`
- `recentMatches`
- `liveGameEvents`

Mutations:

- `register`
- `login`
- `updateMyGameProfile`
- `saveGameProgress`
- `completeChallenge`
- `resetMyGameProgress`
- `clearMyMatchHistory`

## MongoDB Models

- `User`: account data, email, username, hashed password, role
- `GameProfile`: level, XP, score, credits, current stage, health, mission progress, cosmetics, achievements
- `Achievement`: badge metadata and unlock state
- `LeaderboardEntry`: ranked score records
- `Challenge`: daily, weekly, and AI challenge definitions
- `MatchResult`: saved game/challenge history

## Testing

Run client tests:

```bash
cd client
npm run test
```

Run client build:

```bash
cd client
npm run build
```

Current verification:

- Client tests pass: 17 tests
- Client production build passes
- Backend resolver import check passes

Note: The production build may show a Vite chunk-size warning because Three.js is bundled into the app. This does not block the build.

## Deployment Notes

The project can be deployed with separate frontend and backend services.


Deployment checklist:

1. Deploy MongoDB Atlas and copy the connection string.
2. Deploy the backend with:
   - `PORT`
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `CLIENT_URL` set to the deployed frontend URL
3. Deploy the frontend with:
   - `VITE_GRAPHQL_URL` set to the deployed backend GraphQL URL
4. Add the deployed URLs to the Live Links section.

## Known Limitations

- Multiplayer is not implemented because it is listed as optional bonus scope.
- Live game updates use a backend event feed with client polling instead of WebSocket subscriptions.
- Gameplay is intentionally simple and deterministic so it can be demonstrated reliably during presentation.
- Deployment links must be added after hosting.

## Presentation Checklist

- Show registration and login.
- Show protected routes.
- Show the Three.js game scene.
- Demonstrate Docker command gameplay.
- Submit an AI challenge.
- Show score, XP, credits, level, achievements, and cosmetics.
- Show Dashboard data loaded from GraphQL.
- Show Leaderboard data loaded from MongoDB.
- Show Profile reset/history operations.
- Show GraphQL schema/operations.
- Show MongoDB document structure.
- Explain frontend/backend architecture.
- Show deployed app link if available.
