# Vexryl Project Plan

## 1. Services & Tech Stack
- **Frontend Hosting:** Cloudflare Pages (free static hosting)
- **Backend/API:** Cloudflare Workers & Pages Functions (serverless, free tier)
- **Database:** Cloudflare D1 (SQL, free tier)
- **Domain:** FreeDNS (free domain management)
- **Authentication:** Discord OAuth2

## 2. Core Features & Restrictions
- **User Limits:**
  - Max 5 bots per user
  - Max 15 valid slash commands per user
  - Max 15 event listeners per user
  - Max 7 enabled modules per user
- **Modules:**
  - Prebuilt features (automod, logging, economy, moderation, etc.)
  - No music modules
- **Marketplace:**
  - Users can share/import builds (commands/events) for free
- **Security:**
  - Input validation, rate limiting, secure storage
  - Never store Discord tokens in plaintext
- **Bot Hosting:**
  - No free hosting
  - Users connect their own Railway (or similar) account via API
  - Console UI powered by connected API

## 3. Backend Structure
- Store accounts, bots, bot data, and marketplace builds in Cloudflare D1
- API endpoints via Cloudflare Workers/Pages Functions
- Enforce all limits and security in backend logic

## 4. Free Services Only
- No paid services, no credit card required
- All features must work with free tiers

## 5. Project Folder Structure (Recommended)
- `/frontend` - React app (Vite or Next.js)
- `/backend` - Cloudflare Workers/Pages Functions
- `/database` - D1 schema & migrations
- `/docs` - Documentation & plans

## 6. Development Steps
1. Set up frontend with React and Cloudflare Pages
2. Set up backend API with Cloudflare Workers/Pages Functions
3. Set up Cloudflare D1 database
4. Implement Discord OAuth2 authentication
5. Build dashboard for managing bots, commands, events, modules
6. Build marketplace for sharing/importing builds
7. Integrate Railway API for bot hosting/console
8. Add security features
9. Test and deploy


## Hosting Integration (Frontend)
- Dashboard section for connecting Railway/Heroku accounts
- UI for creating/starting/stopping bots
- Responsive design

## Hosting Integration (Backend/API)
- Implement OAuth2 flow for Railway and Heroku (user connects account)
- Store hosting tokens securely in Cloudflare D1
- API endpoints:
  - POST /api/hosting/connect (connect account)
  - POST /api/hosting/create-bot (create new bot project)
  - POST /api/hosting/start-bot (start bot)
  - POST /api/hosting/stop-bot (stop bot)
  - GET /api/hosting/bots (list user bots)
- Use Railway/Heroku public APIs for automation
- Security: Only allow actions for authenticated/authorized users
- Error handling for failed API calls
- Logging and monitoring for hosting actions

---

**All services and features must comply with the free-only rule.**

Refer to this file for the complete Vexryl project plan.
