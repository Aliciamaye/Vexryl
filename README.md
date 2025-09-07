# 🤖 Vexryl - No-Code Discord Bot Platform

A complete Discord bot building platform with visual drag-and-drop builders, marketplace, and deployment system.

## 🔗 Repository Links

- **Main Repository**: https://github.com/Aliciamaye/Vexryl.git
- **Database Storage**: https://github.com/Aliciamaye/vexryl-database.git

## ✨ Features

- **Visual Command Builder** - Drag-and-drop interface for creating slash commands
- **Event System Builder** - Visual flow builder for Discord events (join/leave, messages, etc.)
- **Professional Dashboard** - Clean, responsive interface with dark/light mode
- **Marketplace** - Community-driven bot modules and templates
- **Account Management** - Full user authentication with Supabase
- **Data Persistence** - Auto-save with GitHub backup system
- **Bot Management** - Configure, start/stop, and monitor your bots
- **Production Ready** - Deploy to Cloudflare Workers + Pages

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- No external services required for local testing

### Option 1: Easy Start (Windows)
```bash
# Double-click start.bat or run in terminal:
start.bat
```

### Option 2: Easy Start (Mac/Linux)
```bash
# Make executable and run:
chmod +x start.sh
./start.sh
```

### Option 3: Manual Setup
```bash
# Install root dependencies
npm install

# Install web dependencies
cd apps/web
npm install --legacy-peer-deps

# Install API dependencies  
cd ../api
npm install

# Go back to root
cd ../..

# Start both servers
npm run dev
```

## 🌐 Access Points

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

## 📱 Usage

### 1. Getting Started
1. Visit http://localhost:3000
2. Click "Get Started" 
3. Create an account or use Discord login
4. Access the dashboard

### 2. Building Commands
1. Go to Dashboard → "Command Builder"
2. Drag blocks from the sidebar (Options, Actions, Conditions)
3. Connect them on the canvas
4. Set command name and description
5. Save your command

### 3. Building Events
1. Go to Dashboard → "Event Builder"
2. Select event type (Member Join, Message Sent, etc.)
3. Drag action and condition blocks
4. Connect to the event trigger
5. Save your event listener

### 4. Bot Management
1. Navigate to Settings
2. Configure bot token, name, avatar
3. Start/stop your bot
4. Monitor statistics

## 🏗️ Architecture

```
vexryl/
├── apps/
│   ├── web/          # React frontend with Vite
│   └── api/          # Cloudflare Workers API
├── packages/         # Shared packages (planned)
└── docs/            # Documentation (planned)
```

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, ReactFlow
- **Backend**: Cloudflare Workers, Itty Router
- **Storage**: LocalStorage (demo), Supabase (production)
- **Auth**: JWT tokens, Discord OAuth

## 🎯 Limits (Demo)

- **Commands**: 15 per bot
- **Events**: 10 per bot  
- **Modules**: 6 prebuilt per bot
- **Storage**: Browser localStorage

## 🔧 Configuration

### Environment Variables (Optional)

Copy `.env.example` to `.env` in `apps/web/`:

```bash
# API Configuration
VITE_API_URL=http://localhost:3001/api

# Discord OAuth (optional)
DISCORD_CLIENT_ID=your_client_id
DISCORD_CLIENT_SECRET=your_client_secret
```

### Production Setup

For production deployment:

1. **Frontend**: Deploy to Vercel/Netlify
2. **Backend**: Deploy to Cloudflare Workers
3. **Database**: Configure Supabase
4. **Auth**: Set up Discord OAuth app

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start both web and API
npm run dev:web          # Start only web app
npm run dev:api          # Start only API

# Building
npm run build            # Build web app
npm run install:all      # Install all dependencies

# Testing
npm test                 # Show access URLs
```

### Project Structure

```
apps/web/
├── App.jsx              # Landing page
├── AuthPage.jsx         # Login/signup
├── Dashboard.jsx        # Main dashboard
├── CommandBuilder.jsx   # Visual command builder
├── EventBuilder.jsx     # Visual event builder
├── BotSettings.jsx      # Bot configuration
├── Marketplace.jsx      # Community marketplace
└── Router.jsx           # Client-side routing

apps/api/
├── index.js             # Main worker entry
├── auth/               # Authentication endpoints
├── commands/           # Command CRUD operations
├── events/             # Event CRUD operations
├── bots/               # Bot management
└── marketplace/        # Marketplace API
```

## 🎨 UI Features

- **Responsive Design** - Works on desktop, tablet, mobile
- **Dark/Light Mode** - Toggle in top navigation
- **Glassmorphism** - Modern translucent design elements
- **Professional Layout** - Clean, intuitive interface
- **Drag & Drop** - Visual block-based builders
- **Real-time Preview** - See changes as you build

## 📋 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/discord` - Discord OAuth
- `GET /api/auth/verify` - Verify token

### Commands
- `GET /api/commands` - List user commands
- `POST /api/commands` - Create command
- `PUT /api/commands/:id` - Update command
- `DELETE /api/commands/:id` - Delete command
- `POST /api/commands/:id/test` - Test command

### Events
- `GET /api/events` - List user events
- `POST /api/events` - Create event
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/test` - Test event

### Bots
- `GET /api/bots` - List user bots
- `POST /api/bots` - Create bot
- `PUT /api/bots/:id` - Update bot
- `POST /api/bots/:id/start` - Start bot
- `POST /api/bots/:id/stop` - Stop bot

### Marketplace
- `GET /api/marketplace` - Browse marketplace
- `POST /api/marketplace` - Upload module
- `POST /api/marketplace/:id/download` - Download module

## 🔒 Security

- JWT-based authentication
- CORS protection
- Input validation
- Rate limiting (planned)
- Secure token storage

## 🚦 Status

✅ **Completed**
- Visual builders (command & event)
- Complete dashboard UI
- Authentication system
- Local storage demo
- Responsive design
- Dark/light mode

🚧 **In Progress**
- Discord bot deployment
- Real-time collaboration
- Advanced marketplace features

📋 **Planned**
- Plugin system
- Analytics dashboard
- Team collaboration
- Advanced deployment options

## 🤝 Contributing

This is a demo project. For production use:

1. Set up proper database (Supabase)
2. Configure Discord OAuth
3. Implement proper security measures
4. Add comprehensive testing
5. Set up CI/CD pipeline

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues or questions:
1. Check the console for errors
2. Verify Node.js version (16+)
3. Ensure both servers are running
4. Clear browser localStorage if needed

---

**Made with ❤️ for the Discord community**
