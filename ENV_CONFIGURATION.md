# Environment Configuration Guide

This document explains the three different `.env` files used in the Vexryl project and how to set them up properly.

## Overview

The Vexryl project uses three different environment files:

1. `.env` - Root-level environment variables for the entire project
2. `apps/web/.env` - Frontend-specific environment variables
3. `apps/api/.env` - API/backend-specific environment variables

## 1. Root-level `.env`

This file contains project-wide configuration variables that are shared across all applications.

```
# Project configuration
PROJECT_NAME=Vexryl
NODE_ENV=development
```

## 2. Frontend `.env` (apps/web/.env)

This file contains environment variables specific to the frontend React application.

```
# Frontend configuration
VITE_APP_NAME=Vexryl Discord Bot Builder
VITE_API_URL=https://api.vexryl.com
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Note: All frontend environment variables must be prefixed with `VITE_` to be accessible in the React code.

## 3. API `.env` (apps/api/.env)

This file contains environment variables for the Cloudflare Workers API.

```
# API configuration
DATABASE_URL=your_database_url
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret
DISCORD_REDIRECT_URI=https://vexryl.com/auth/callback
JWT_SECRET=your_jwt_secret
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
```

## Development Setup

For local development, you'll need to:

1. Create all three `.env` files in their respective locations
2. Fill in the required variables based on the templates above
3. Never commit these files to the repository (they're in `.gitignore`)

## Production Deployment

For production:

1. Set environment variables directly in your hosting platforms
   - For Cloudflare Workers: Use the Workers dashboard
   - For frontend: Set in your hosting provider (Vercel, Netlify, etc.)

2. Make sure to use production URLs and credentials

## FreeDNS Configuration Alternatives

Since FreeDNS doesn't allow CNAME records, here are alternatives:

1. Use an A record pointing to your server's IP address
2. Consider using Cloudflare as your DNS provider, which supports CNAME flattening
3. If you need a subdomain, create an A record for the subdomain pointing to the same IP

If you must use FreeDNS:
- Create an A record instead of a CNAME
- Use dynamic DNS updates to keep the IP address current if your server's IP changes

## Troubleshooting

If you encounter environment-related issues:

1. Check that all required variables are defined in the correct `.env` file
2. Verify that you've restarted your development server after changing `.env` files
3. For frontend variables, ensure they're prefixed with `VITE_`
4. For deployment issues, verify the environment variables are correctly set in your hosting platform
