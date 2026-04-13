# Implementation Phases

## Phase 1 - Scaffold

Completed in this scaffold:

- Backend folder structure
- Express + Apollo Server starter setup
- GraphQL schema with auth and placeholder game queries
- MongoDB models for key project entities
- JWT authentication scaffold for `register`, `login`, and `me`
- Frontend route and page stubs
- README and project instructions

## Phase 2 - Core App Wiring

Target outcomes:

- Connect frontend forms to GraphQL mutations
- Persist JWT token in local storage
- Add protected route handling for dashboard, game, and profile pages
- Load real data for `me`, `gameProfile`, `leaderboard`, and `challenges`
- Add seed data for demo presentation

Key tasks:

- Replace placeholder frontend data with GraphQL queries
- Add auth state management
- Add basic dashboard widgets
- Add form validation and error states

## Phase 3 - Gameplay Foundation

Target outcomes:

- Add a Three.js game scene inside the Game page
- Implement one simple playable Docker-themed loop
- Track score, XP, stage progress, and match results
- Save progress through GraphQL mutations

Suggested gameplay scope:

- Avoid full multiplayer in the first playable version
- Build one clear objective with scoring, timing, and success/failure states
- Keep visuals simple and presentation-ready

Suggested Docker-themed mechanics:

- Sort images into the correct containers
- Match Docker commands to deployment outcomes
- Avoid system failures while completing timed tasks

## Phase 4 - Rewards and Progression

Target outcomes:

- Leveling system
- Achievement unlock flow
- Challenge completion flow
- Leaderboard persistence
- Better dashboard progression feedback

Key tasks:

- Award XP and credits after matches
- Unlock achievements based on milestones
- Track daily or weekly challenges
- Show progression clearly in the frontend

## Phase 5 - Bonus and Presentation

Optional features:

- Socket.io multiplayer or asynchronous competition
- AI-driven challenge behavior
- Polished animations and responsive UI improvements
- Deployment to Vercel, Render, Railway, Azure, or similar

Presentation checklist:

- Demonstrate registration and login
- Demonstrate GraphQL queries and mutations
- Show MongoDB document structure
- Show at least one gameplay loop
- Show score, achievements, and leaderboard
- Explain architecture and design choices
