# Deployment Architecture Guide

## Overview
Your Vexryl platform uses a **two-service architecture** on Cloudflare:

1. **Cloudflare Workers** = API Backend (handles database operations)
2. **Cloudflare Pages** = Frontend Website (serves the React app)

These are **separate deployments** that work together.

## Why Two Services?

### Cloudflare Workers (API)
- Handles all database operations (Supabase + GitHub)
- Processes authentication
- Manages auto-migration logic
- Runs server-side code with environment variables
- **Location**: `apps/api/worker.js`

### Cloudflare Pages (Frontend)
- Serves your React dashboard and builders
- Static file hosting with global CDN
- Connects to Workers API for data
- **Location**: `apps/web/` (your React components)

## Deployment Process

### Step 1: Deploy Cloudflare Workers (API First)

```bash
# Navigate to API directory
cd apps/api

# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Create worker
wrangler deploy
```

**Environment Variables for Workers:**
```bash
# Set in Cloudflare dashboard or via CLI
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
wrangler secret put GITHUB_TOKEN
wrangler secret put GITHUB_REPO_OWNER
```

### Step 2: Deploy Cloudflare Pages (Frontend)

```bash
# Navigate to web directory
cd apps/web

# Build the React app
npm run build

# Deploy to Pages
npx wrangler pages deploy dist --project-name vexryl-dashboard
```

**Environment Variables for Pages:**
```env
# In Pages dashboard > Settings > Environment Variables
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-worker.your-subdomain.workers.dev
```

## Database Workflow Implementation

### Automatic Migration System

Your platform now implements the exact workflow from your project plan:

1. **Active Usage**: Users work with data stored in Supabase (fast, real-time)
2. **Size Monitoring**: Worker API checks database size regularly
3. **Auto-Migration**: When Supabase hits 300MB, triggers migration
4. **GitHub Storage**: Data moves to GitHub in user folders (`/users/{userId}/project-{projectId}/`)
5. **Cleanup**: Supabase data is deleted after successful GitHub save
6. **Session Loading**: When users return, data loads from GitHub back into Supabase

### API Endpoints Available

```javascript
// Database management
GET /api/database/size               // Check current database size
POST /api/database/migrate-all       // Trigger auto-migration
POST /api/database/load-session      // Load user data from GitHub

// Manual operations
POST /api/github/manual-save         // Save specific user data to GitHub
POST /api/github/export              // Export and delete specific project
```

## Cost Structure (All Free Tiers)

- **Supabase**: Free (500MB database, perfect for temporary storage)
- **Cloudflare Workers**: Free (100,000 requests/day)
- **Cloudflare Pages**: Free (unlimited bandwidth)
- **GitHub**: Free (unlimited public repositories)

## Domain Configuration

### Option A: Separate Subdomains
- API: `api.yourdomain.com` → Points to Cloudflare Workers
- App: `app.yourdomain.com` → Points to Cloudflare Pages

### Option B: Single Domain with Path Routing
- API: `yourdomain.com/api/*` → Worker handles API routes
- App: `yourdomain.com/*` → Pages handles everything else

## Production Checklist

### Cloudflare Workers Setup
- [ ] Worker deployed and accessible
- [ ] Environment variables configured
- [ ] CORS headers working for your domain
- [ ] Database size monitoring active
- [ ] GitHub integration working

### Cloudflare Pages Setup
- [ ] React app builds successfully
- [ ] Environment variables point to Worker API
- [ ] Authentication flow working
- [ ] Real-time subscriptions connected

### Database Configuration
- [ ] Supabase database schema deployed
- [ ] RLS policies active
- [ ] Size monitoring functions created
- [ ] GitHub repository ready for user data

### GitHub Integration
- [ ] Personal access token created
- [ ] Repository permissions set
- [ ] User folder structure working
- [ ] Auto-migration tested

## Monitoring & Maintenance

### Database Size Monitoring
The system automatically checks Supabase size and triggers migration when needed. You can also manually check:

```javascript
// In your dashboard, call the API
const response = await fetch('/api/database/size');
const { size_mb } = await response.json();
console.log(`Database size: ${size_mb}MB`);
```

### User Data Recovery
If a user needs their old data, it automatically loads from GitHub when they log in.

## Next Steps

1. **Deploy Workers first** (API must be ready before frontend)
2. **Test API endpoints** with curl or Postman
3. **Deploy Pages** with correct API URL
4. **Test full user flow** (register → create project → auto-save → migration)
5. **Monitor database size** and test migration triggers

This architecture gives you a production-ready platform that scales efficiently and stays within free tiers while providing enterprise-level functionality!
