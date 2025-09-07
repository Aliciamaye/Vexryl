# 🚀 Account Management & Setup Tutorial

## What We've Built

Your Vexryl platform now has a **complete account management system** with:

✅ **Supabase Authentication** (email/password + social login)  
✅ **User Profiles** (automatically created on signup)  
✅ **Project Management** (users can create/manage multiple projects)  
✅ **Data Isolation** (each user only sees their own data)  
✅ **Auto-Save** (all work is automatically saved to database)  
✅ **GitHub Backup** (automatic data migration at 300MB limit)  

---

## Step 1: Set Up Your Database (Supabase)

### 1.1 Create Account & Project
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Fill in:
   - **Name**: `vexryl-platform`
   - **Password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** (takes ~2 minutes)

### 1.2 Set Up Database Tables
1. Go to **SQL Editor** in Supabase dashboard
2. Copy the entire contents of `database/schema.sql`
3. Paste in SQL Editor and click **"Run"**
4. Copy contents of `database/functions.sql`
5. Paste in new SQL Editor tab and click **"Run"**

### 1.3 Configure Authentication Settings
1. Go to **Authentication** > **Settings**
2. **Site URL**: Add `http://localhost:3000` (for development)
3. **Redirect URLs**: Add `http://localhost:3000/auth/callback`
4. **Email Templates**: Customize if needed
5. **Providers**: Enable social logins (GitHub, Google, etc.)

### 1.4 Get Your API Keys
1. Go to **Settings** > **API**
2. Copy these values:
   ```
   Project URL: https://your-project.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Step 2: Configure Your Frontend

### 2.1 Set Environment Variables
Create `.env` file in `apps/web/`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-from-supabase
VITE_API_URL=http://localhost:3001
```

### 2.2 Install Dependencies (Already Done)
```bash
cd apps/web
npm install @supabase/supabase-js --legacy-peer-deps
```

### 2.3 Test Locally
```bash
npm run dev
# Open http://localhost:3000
```

---

## Step 3: Set Up GitHub Database

### 3.1 Create Data Repository
1. Go to GitHub and create new **public** repository
2. Name it: `vexryl-database`
3. Add README file

### 3.2 Generate Access Token
1. GitHub **Settings** > **Developer settings** > **Personal access tokens**
2. Click **"Generate new token (classic)"**
3. Select scopes:
   - ✅ **repo** (Full control)
   - ✅ **public_repo** (Access public repos)
4. **Copy the token** (save it!)

---

## Step 4: Deploy API Backend (Cloudflare Workers)

### 4.1 Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 4.2 Deploy Worker
```bash
cd apps/api
wrangler deploy
# Note the URL: https://worker-name.your-subdomain.workers.dev
```

### 4.3 Set Environment Variables
```bash
wrangler secret put SUPABASE_URL
# Enter: https://your-project.supabase.co

wrangler secret put SUPABASE_ANON_KEY
# Enter: your-anon-key

wrangler secret put SUPABASE_SERVICE_KEY  
# Enter: your-service-role-key (from Supabase Settings > API)

wrangler secret put GITHUB_TOKEN
# Enter: your-github-token

wrangler secret put GITHUB_REPO_OWNER
# Enter: YOUR_GITHUB_USERNAME
```

---

## Step 5: How Account Management Works

### User Registration Flow
1. **User signs up** via email/password or social login
2. **Account created** in Supabase Auth automatically
3. **Profile created** in `users` table with username, email, avatar
4. **Ready to use** - can immediately create projects

### Data Organization
```
User Account (Supabase Auth)
├── Profile (users table)
├── Projects (projects table)
│   ├── Commands (commands table)
│   ├── Events (events table)
│   └── Settings (project metadata)
└── GitHub Backup
    └── /users/{user_id}/project-{project_id}/
```

### Account Features Available

**✅ User Management**
- Email/password authentication
- Social login (GitHub, Google)
- User profiles with avatars
- Password reset functionality

**✅ Project Management**
- Create unlimited projects
- Each project is isolated to the user
- Project privacy settings (public/private)
- Auto-save all changes

**✅ Data Persistence**
- Real-time database sync
- Automatic GitHub backup at 300MB
- Session data loading from GitHub
- Cross-device synchronization

---

## Step 6: Test Your Account System

### 6.1 Test Registration
1. Go to your app: `http://localhost:3000`
2. Click **"Create your account"**
3. Enter email, username, password
4. Check email for confirmation
5. Confirm account and sign in

### 6.2 Test Project Creation
1. After signing in, you'll see the Dashboard
2. Click **"Create Project"**
3. Enter project name and description
4. Click **"Create Project"**

### 6.3 Test Data Persistence
1. Go to **Commands** or **Events** for your project
2. Create some commands/events
3. Watch auto-save indicators
4. Sign out and sign back in
5. Verify data is still there

### 6.4 Test Database in Supabase
1. Go to Supabase dashboard
2. Go to **Table Editor**
3. Check tables: `users`, `projects`, `commands`, `events`
4. See your data stored in the database

---

## Step 7: Production Deployment

### 7.1 Deploy Frontend (Cloudflare Pages)
```bash
cd apps/web
npm run build
npx wrangler pages deploy dist --project-name vexryl-platform
```

### 7.2 Update Environment Variables
1. Cloudflare Pages dashboard > Settings > Environment variables
2. Add:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   VITE_API_URL = https://your-worker-url.workers.dev
   ```

### 7.3 Update Supabase Settings
1. Add your production URL to Supabase **Site URL**
2. Add production URL to **Redirect URLs**

---

## 🎉 Your Account System is Ready!

### What Users Can Do:
- ✅ **Sign up** with email or social login
- ✅ **Create projects** and organize their work
- ✅ **Build commands and events** with auto-save
- ✅ **Access data anywhere** - cross-device sync
- ✅ **Automatic backups** to GitHub
- ✅ **Manage account** settings and profile

### What You Can Monitor:
- 📊 **User count** in Supabase dashboard
- 💾 **Database size** via API calls
- 🔄 **Auto-migration** when hitting limits
- 📁 **GitHub storage** with user folders

### Database Monitoring Commands:
```javascript
// Check database size
fetch('/api/database/size').then(r => r.json()).then(console.log)

// Get user count  
// Check in Supabase > Table Editor > users table

// Manual GitHub save
fetch('/api/github/manual-save', {
  method: 'POST',
  body: JSON.stringify({ userId: 'user-id' })
}).then(r => r.json()).then(console.log)
```

---

## 🚨 Troubleshooting

**Authentication not working?**
- Check environment variables in `.env`
- Verify Supabase project URL and keys
- Check browser console for errors

**Data not saving?**
- Verify API URL in environment
- Check Cloudflare Worker logs
- Test API endpoints with curl

**Social login issues?**
- Configure OAuth providers in Supabase
- Check redirect URLs match exactly
- Verify provider app settings

**Need help?** Check the error logs in:
- Browser Developer Console
- Supabase Dashboard > Logs
- Cloudflare Dashboard > Workers > Logs

---

Your platform now has **enterprise-grade account management** with automatic scaling, data backup, and user isolation - all running on free tiers! 🚀
