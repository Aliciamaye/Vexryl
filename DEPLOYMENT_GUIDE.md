# 🚀 Vexryl Platform Deployment Guide

## 📋 **Step-by-Step Production Setup**

### **🗄️ Phase 1: Database Setup (Supabase)**

#### **Step 1: Create Supabase Project**
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → "New project"
3. Choose organization → Create new project
4. Project name: `vexryl-platform`
5. Database password: Generate strong password (save it!)
6. Region: Choose closest to your users
7. Click "Create new project" (takes ~2 minutes)

#### **Step 2: Configure Database Schema**
1. In Supabase dashboard → Go to "SQL Editor"
2. Click "New query"
3. Copy and paste the entire contents of `database/schema.sql`
4. Click "Run" to create all tables, policies, and indexes
5. Verify tables were created in "Table Editor"

#### **Step 3: Get Supabase Credentials**
1. Go to "Settings" → "API"
2. Copy these values (you'll need them later):
   - Project URL
   - Anon public key
   - Service role key (keep this secret!)

### **⚡ Phase 2: API Setup (Cloudflare Workers)**

#### **Step 1: Install Wrangler CLI**
```bash
npm install -g wrangler
```

#### **Step 2: Login to Cloudflare**
```bash
wrangler login
```

#### **Step 3: Deploy API Worker**
```bash
cd apps/api
npm install
wrangler deploy
```

#### **Step 4: Set Environment Variables**
```bash
# Set Supabase credentials
wrangler secret put SUPABASE_URL
# Enter your Supabase project URL

wrangler secret put SUPABASE_ANON_KEY  
# Enter your Supabase anon key

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Enter your Supabase service role key
```

#### **Step 5: Test API**
Visit your worker URL: `https://vexryl-api.your-subdomain.workers.dev`
You should see "Not Found" - this means it's working!

### **🌐 Phase 3: Frontend Setup (Cloudflare Pages)**

#### **Step 1: Create Cloudflare Pages Project**
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Pages" → "Create a project"
3. Connect to your GitHub repository
4. Select the Vexryl repository
5. Configure build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `apps/web/dist`
   - **Root directory**: `apps/web`

#### **Step 2: Set Environment Variables**
In Cloudflare Pages settings → Environment variables:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://vexryl-api.your-subdomain.workers.dev
VITE_ENVIRONMENT=production
```

#### **Step 3: Deploy**
1. Click "Save and Deploy"
2. Wait for build to complete (~3-5 minutes)
3. Your site will be available at `https://vexryl.pages.dev`

### **🔧 Phase 4: Configuration & Testing**

#### **Step 1: Update API CORS**
Update your worker's CORS headers to include your Pages domain:
```javascript
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://vexryl.pages.dev',
  // ... other headers
};
```

#### **Step 2: Test Full Stack**
1. Visit your Cloudflare Pages URL
2. Create an account
3. Try creating a command and event
4. Verify data persists in Supabase

#### **Step 3: Enable Real-time Features**
In Supabase dashboard:
1. Go to "Database" → "Replication"
2. Enable real-time for tables: `commands`, `events`, `projects`

### **📊 Phase 5: Monitoring & Maintenance**

#### **Database Monitoring**
- Monitor usage in Supabase dashboard
- Set up alerts for row limits (500,000 rows free tier)
- Regular backups via GitHub export feature

#### **API Monitoring**
- Check Cloudflare Workers analytics
- Monitor request counts (100,000 requests/day free)
- Set up error alerts

#### **Frontend Monitoring**
- Cloudflare Pages analytics
- Monitor build minutes (500 builds/month free)

## 🔄 **GitHub Export & Data Lifecycle**

### **Automated Data Management**
Per the project plan, after users export to GitHub:

1. **Export Trigger**: User clicks "Export to GitHub"
2. **Data Export**: All project data exported as JSON to GitHub repo
3. **Cleanup**: Data automatically deleted from Supabase/Cloudflare D1
4. **Storage**: Only GitHub contains the exported data
5. **Limits**: This keeps platform within free tier limits

### **Export Implementation**
The `handleGitHub` function in the API worker:
- Exports complete project data to GitHub
- Calls `deleteProjectData()` after successful push
- Keeps platform lean and within free tier constraints

## 🚨 **Important Production Notes**

### **Security**
- Never commit real environment variables to Git
- Use Cloudflare/Supabase secret management
- Enable Row Level Security (RLS) policies
- Regular security updates

### **Performance**
- Cloudflare global CDN handles scaling
- Supabase handles database scaling automatically
- Real-time subscriptions only for active users

### **Cost Management**
- All services used are free tier with generous limits
- Monitor usage dashboards regularly
- GitHub export strategy keeps data costs minimal
- No credit card required for any service

### **Backup Strategy**
- GitHub exports serve as primary backups
- Supabase automatic backups (7 days retention)
- Regular manual exports recommended

## 📝 **Quick Commands Summary**

```bash
# Install dependencies
cd apps/api && npm install
cd apps/web && npm install

# Deploy API
cd apps/api && wrangler deploy

# Local development
cd apps/web && npm run dev
cd apps/api && wrangler dev

# Environment setup
wrangler secret put SUPABASE_URL
wrangler secret put SUPABASE_ANON_KEY
```

## 🎯 **Success Checklist**

- ✅ Supabase project created and schema applied
- ✅ Cloudflare Worker deployed and responding
- ✅ Cloudflare Pages deployed with environment variables
- ✅ Authentication working (signup/signin)
- ✅ Commands and events saving to database
- ✅ Real-time updates working
- ✅ GitHub export functionality tested
- ✅ Data cleanup after export verified

Your Vexryl platform is now fully deployed and production-ready! 🚀
