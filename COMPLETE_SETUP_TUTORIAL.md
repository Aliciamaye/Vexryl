# 🚀 Vexryl Platform Complete Setup Tutorial

## Step 1: Database Setup (Supabase)

### 1.1 Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose your organization
4. Fill in:
   - **Project Name**: `vexryl-platform`
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
5. Click "Create new project" (takes ~2 minutes)

### 1.2 Configure Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Copy and paste the entire contents of `database/schema.sql`
4. Click **Run** to create all tables
5. Go to **SQL Editor** again, new query
6. Copy and paste contents of `database/functions.sql` 
7. Click **Run** to create monitoring functions

### 1.3 Set Up Authentication
1. Go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:3000` (for development)
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`
4. **Email Templates**: Customize if needed (optional)
5. **Providers**: Enable any social login you want (Google, GitHub, etc.)

### 1.4 Get Your API Keys
1. Go to **Settings** > **API**
2. Copy these values (you'll need them):
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep secret!)

## Step 2: GitHub Database Setup

### 2.1 Create GitHub Repository for Data Storage
1. Go to GitHub and create a new **public** repository
2. Name it: `vexryl-database`
3. Add a README file
4. Repository URL will be: `https://github.com/YOUR_USERNAME/vexryl-database`

### 2.2 Generate GitHub Personal Access Token
1. Go to GitHub **Settings** > **Developer settings** > **Personal access tokens** > **Tokens (classic)**
2. Click **Generate new token (classic)**
3. Set **Expiration**: No expiration (or 1 year)
4. Select scopes:
   - ✅ **repo** (Full control of private repositories)
   - ✅ **public_repo** (Access public repositories)
5. Click **Generate token**
6. **COPY THE TOKEN** - you won't see it again!

## Step 3: Cloudflare Workers Setup (API Backend)

### 3.1 Install Wrangler CLI
```powershell
# Install Node.js if you haven't already
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### 3.2 Deploy the Worker
```powershell
# Navigate to API directory
cd apps\api

# Deploy the worker
wrangler deploy

# You'll get a URL like: https://worker-name.your-subdomain.workers.dev
```

### 3.3 Set Environment Variables
```powershell
# Set all your secrets (replace with your actual values)
wrangler secret put SUPABASE_URL
# Enter: https://your-project.supabase.co

wrangler secret put SUPABASE_ANON_KEY  
# Enter: your-anon-key-from-step-1.4

wrangler secret put SUPABASE_SERVICE_KEY
# Enter: your-service-role-key-from-step-1.4

wrangler secret put GITHUB_TOKEN
# Enter: your-github-token-from-step-2.2

wrangler secret put GITHUB_REPO_OWNER
# Enter: YOUR_GITHUB_USERNAME
```

### 3.4 Test Your API
```powershell
# Test if your API is working
curl https://your-worker-url.workers.dev/api/projects
# Should return: {"error":"Unauthorized"} (this is correct - no auth token)
```

## Step 4: Frontend Setup (React Dashboard)

### 4.1 Install Dependencies
```powershell
# Navigate to web directory
cd ..\web

# Install packages
npm install
```

### 4.2 Create Environment File
Create `.env` file in `apps/web/`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase
VITE_API_URL=https://your-worker-url.workers.dev
```

### 4.3 Test Locally
```powershell
# Start development server
npm run dev

# Open browser to: http://localhost:3000
```

## Step 5: Account Management System

### 5.1 How Accounts Work

Your platform now has a complete account system:

**Registration Flow:**
1. User signs up via Supabase Auth (email/password or social login)
2. User profile automatically created in `users` table
3. User can create projects, commands, and events
4. All data linked to their account via `user_id`

**Data Storage:**
- **Active Session**: Data stored in Supabase (fast access)
- **Long-term**: Data migrated to GitHub when database hits 300MB
- **User Folders**: Each user gets `/users/{user_id}/project-{project_id}/` in GitHub

### 5.2 Account Features Available

**✅ User Profiles**
- Username, email, avatar
- Custom settings (stored as JSON)
- Account creation/update timestamps

**✅ Project Management**
- Multiple projects per user
- Project privacy settings (public/private)
- Project metadata and configuration

**✅ Data Isolation**
- Row Level Security (RLS) ensures users only see their data
- Commands and events linked to user accounts
- Secure API endpoints with authentication

**✅ Data Persistence**
- Auto-save functionality in builders
- Automatic GitHub backup when needed
- Session data loading from GitHub storage

## Step 6: Deploy to Production (Cloudflare Pages)

### 6.1 Build and Deploy Frontend
```powershell
# From apps/web directory
npm run build

# Deploy to Cloudflare Pages
npx wrangler pages deploy dist --project-name vexryl-platform
```

### 6.2 Set Production Environment Variables
1. Go to Cloudflare Dashboard > Pages > Your Project
2. Go to **Settings** > **Environment variables**
3. Add these variables:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   VITE_API_URL = https://your-worker-url.workers.dev
   ```

### 6.3 Update CORS and Redirect URLs
1. **Supabase**: Update Site URL to your Pages URL
2. **Worker**: Update CORS headers if needed

## Step 7: Test Everything

### 7.1 Test User Registration
1. Go to your deployed site
2. Click "Sign Up"
3. Create an account with email/password
4. Verify you can log in

### 7.2 Test Project Creation
1. After logging in, create a new project
2. Add some commands in the Command Builder
3. Create some events in the Event Workflow Builder
4. Verify auto-save is working

### 7.3 Test Data Persistence
1. Log out and log back in
2. Verify your projects and data are still there
3. Check Supabase dashboard to see data in tables

## 🎉 You're Done!

Your platform now has:
- ✅ Complete user authentication and account management
- ✅ Real-time database with auto-save
- ✅ Automatic GitHub backup system
- ✅ Production-ready deployment
- ✅ All free-tier services

## 🔧 Account Management Commands

### View User Data
```sql
-- In Supabase SQL Editor
SELECT * FROM users WHERE email = 'user@example.com';
```

### Check Database Size
```javascript
// In browser console on your site
const response = await fetch('/api/database/size');
const { size_mb } = await response.json();
console.log(`Database size: ${size_mb}MB`);
```

### Manual GitHub Backup
```javascript
// Trigger manual save to GitHub
const response = await fetch('/api/github/manual-save', {
  method: 'POST',
  body: JSON.stringify({ userId: 'user-id-here' })
});
```

## 🚨 Troubleshooting

**If authentication fails:**
- Check environment variables in both Worker and Pages
- Verify Supabase redirect URLs include your domain
- Check browser console for CORS errors

**If data doesn't save:**
- Verify API URL is correct in frontend env
- Check Worker logs in Cloudflare dashboard
- Test API endpoints directly with curl

**If GitHub integration fails:**
- Verify GitHub token has correct permissions
- Check repository exists and is accessible
- Verify GITHUB_REPO_OWNER environment variable

Need help with any specific step? Let me know!
