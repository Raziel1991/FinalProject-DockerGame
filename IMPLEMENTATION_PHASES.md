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

## Phase 2 - Exercise 2 Completion

Completed outcomes:

- Connect frontend forms to GraphQL mutations
- Persist JWT token in local storage
- Add protected route handling for dashboard, game, and profile pages
- Load real data for `me`, `gameProfile`, `leaderboard`, and `challenges`
- Add seed data for demo presentation
- Add interactive Three.js gameplay
- Add async AI challenge completion
- Add live game event feed
- Add rewards: XP, credits, achievements, and cosmetic unlocks
- Add progress reset and match-history clearing operations

Completed tasks:

- Replaced placeholder frontend data with GraphQL queries
- Added auth state management
- Added dashboard widgets
- Added form validation and error states
- Added score, health, command, and game-over mechanics
- Added GraphQL mutations for progress, challenge completion, reset, and history clearing

## Phase 3 - Gameplay Foundation

Completed outcomes:

- Three.js game scene inside the Game page
- Playable Docker-themed loop
- Score, XP, stage progress, credits, cosmetics, and match results
- Progress saved through GraphQL mutations

Current gameplay scope:

- Full multiplayer remains optional bonus scope
- The game includes one clear objective with scoring, timing, crashes, recovery, and success/failure states
- Visuals are simple and presentation-ready

Implemented Docker-themed mechanics:

- Click containers on a Docker whale
- Use Docker command actions to recover or boost containers
- Avoid system failures while throughput increases

## Phase 4 - Rewards and Progression

Completed outcomes:

- Leveling system
- Achievement unlock flow
- Challenge completion flow
- Leaderboard persistence
- Better dashboard progression feedback

Key tasks:

- Award XP and credits after matches
- Unlock achievements based on milestones
- Track daily, weekly, and AI challenges
- Show progression clearly in the frontend

## Phase 5 - Bonus and Presentation

Optional features:

- Socket.io multiplayer
- Polished animations and responsive UI improvements
- Deployment to Vercel, Render, Railway, Azure, or similar

Implemented bonus-style features:

- Asynchronous AI challenge behavior
- Backend live event feed for real-time presentation updates

Presentation checklist:

- Demonstrate registration and login
- Demonstrate GraphQL queries and mutations
- Show MongoDB document structure
- Show at least one gameplay loop
- Show score, achievements, and leaderboard
- Explain architecture and design choices
