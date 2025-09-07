# Vexryl Deployment Guide

## Cloudflare Pages Deployment

### Prerequisites
- GitHub repository: `https://github.com/Aliciamaye/Vexryl.git`
- Supabase project with authentication enabled
- Cloudflare account

### Step 1: Connect GitHub to Cloudflare Pages
1. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
2. Click "Create a project"
3. Connect to GitHub and select the `Vexryl` repository
4. Configure build settings:
   - **Framework preset**: None (custom)
   - **Build command**: `cd apps/web && npm install --legacy-peer-deps && npm run build`
   - **Build output directory**: `apps/web/dist`
   - **Root directory**: `/` (leave empty)

### Step 2: Set Environment Variables
Go to your Cloudflare Pages project → Settings → Environment Variables

Add these variables for **Production**:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=https://your-api-url.com/api
VITE_GITHUB_TOKEN=your-github-token
VITE_GITHUB_REPO_OWNER=your-github-username
VITE_ENVIRONMENT=production
```

### Step 3: Get Your Values

#### Supabase Values:
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **URL** → use as `VITE_SUPABASE_URL`
   - **anon public** key → use as `VITE_SUPABASE_ANON_KEY`

#### GitHub Token (for exports feature):
1. Go to [GitHub Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)
2. Generate new token (classic)
3. Give it `repo` scope
4. Copy token → use as `VITE_GITHUB_TOKEN`
5. Your username → use as `VITE_GITHUB_REPO_OWNER`

### Step 4: Deploy
1. Save environment variables in Cloudflare Pages
2. Go to Deployments tab
3. Click "Retry deployment" or push a new commit to trigger deployment

### Features Available After Deployment
- ✅ User authentication (Google, Discord, GitHub, Email)
- ✅ Discord command builder
- ✅ Discord event builder  
- ✅ Bot configuration dashboard
- ✅ Export to GitHub repositories
- ✅ Secure user profiles and data persistence

### Troubleshooting
- If build fails: Check that all environment variables are set correctly
- If authentication doesn't work: Verify Supabase URL and anon key
- If exports fail: Check GitHub token permissions

### Local Development
For local development, copy `apps/web/.env.example` to `apps/web/.env.local` and fill in your values.

## Security Notes
- ✅ No secrets committed to Git
- ✅ Environment variables managed via Cloudflare dashboard
- ✅ Git history cleaned of any previous secrets
- ✅ Supabase RLS (Row Level Security) enabled for user data protection
