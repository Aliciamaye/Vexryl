/**
 * Bot Deployment Service
 * Handles one-click deployment of Discord bots to various hosting platforms
 */

import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import archiver from 'archiver';
import fetch from 'node-fetch';

const execAsync = promisify(exec);

export class DeploymentService {
  constructor() {
    this.supportedPlatforms = ['railway', 'render', 'heroku', 'digitalocean'];
    this.deploymentTemplates = new Map();
    this.initializeTemplates();
  }

  initializeTemplates() {
    // Railway deployment template
    this.deploymentTemplates.set('railway', {
      name: 'Railway',
      configFiles: {
        'railway.json': {
          "$schema": "https://railway.app/railway.schema.json",
          "build": {
            "builder": "NIXPACKS"
          },
          "deploy": {
            "startCommand": "node bot.js",
            "restartPolicyType": "ON_FAILURE",
            "restartPolicyMaxRetries": 10
          }
        },
        'package.json': (botName) => ({
          "name": botName.toLowerCase().replace(/\s+/g, '-'),
          "version": "1.0.0",
          "description": `Discord bot created with Vexryl`,
          "main": "bot.js",
          "scripts": {
            "start": "node bot.js",
            "dev": "nodemon bot.js"
          },
          "dependencies": {
            "discord.js": "^14.14.1",
            "dotenv": "^16.3.1"
          },
          "devDependencies": {
            "nodemon": "^3.0.2"
          },
          "engines": {
            "node": ">=18.0.0"
          }
        }),
        '.env.example': `# Discord Bot Token (get from https://discord.com/developers/applications)
DISCORD_TOKEN=your_bot_token_here

# Optional: Set bot presence
BOT_STATUS=online
BOT_ACTIVITY=Listening to commands`
      }
    });

    // Render deployment template
    this.deploymentTemplates.set('render', {
      name: 'Render',
      configFiles: {
        'render.yaml': (botName) => `
services:
  - type: web
    name: ${botName.toLowerCase().replace(/\s+/g, '-')}
    env: node
    plan: free
    buildCommand: npm install
    startCommand: node bot.js
    envVars:
      - key: DISCORD_TOKEN
        sync: false`,
        'package.json': (botName) => ({
          "name": botName.toLowerCase().replace(/\s+/g, '-'),
          "version": "1.0.0",
          "description": `Discord bot created with Vexryl`,
          "main": "bot.js",
          "scripts": {
            "start": "node bot.js"
          },
          "dependencies": {
            "discord.js": "^14.14.1",
            "dotenv": "^16.3.1"
          },
          "engines": {
            "node": ">=18.0.0"
          }
        })
      }
    });

    // Heroku deployment template
    this.deploymentTemplates.set('heroku', {
      name: 'Heroku',
      configFiles: {
        'Procfile': 'worker: node bot.js',
        'package.json': (botName) => ({
          "name": botName.toLowerCase().replace(/\s+/g, '-'),
          "version": "1.0.0",
          "description": `Discord bot created with Vexryl`,
          "main": "bot.js",
          "scripts": {
            "start": "node bot.js"
          },
          "dependencies": {
            "discord.js": "^14.14.1",
            "dotenv": "^16.3.1"
          },
          "engines": {
            "node": ">=18.0.0"
          }
        }),
        'app.json': (botName) => ({
          "name": botName,
          "description": `Discord bot created with Vexryl`,
          "keywords": ["discord", "bot", "vexryl"],
          "env": {
            "DISCORD_TOKEN": {
              "description": "Your Discord bot token",
              "required": true
            }
          },
          "formation": {
            "worker": {
              "quantity": 1,
              "size": "eco"
            }
          }
        })
      }
    });
  }

  /**
   * Generate deployment package for a bot
   */
  async generateDeploymentPackage(botData, platform = 'railway') {
    const { name, description, generatedCode } = botData;
    const template = this.deploymentTemplates.get(platform);
    
    if (!template) {
      throw new Error(`Unsupported platform: ${platform}`);
    }

    const deploymentData = {
      botCode: this.enhanceBotCode(generatedCode, botData),
      configFiles: {},
      platform,
      botName: name,
      readme: this.generateReadme(botData, platform)
    };

    // Generate config files
    for (const [filename, content] of Object.entries(template.configFiles)) {
      if (typeof content === 'function') {
        deploymentData.configFiles[filename] = JSON.stringify(content(name), null, 2);
      } else if (typeof content === 'object') {
        deploymentData.configFiles[filename] = JSON.stringify(content, null, 2);
      } else {
        deploymentData.configFiles[filename] = content;
      }
    }

    return deploymentData;
  }

  /**
   * Enhance bot code with production features
   */
  enhanceBotCode(baseCode, botData) {
    const enhancements = `
// Enhanced Discord.js Bot Code - Generated by Vexryl
// Bot Name: ${botData.name}
// Description: ${botData.description}
// Generated: ${new Date().toISOString()}

require('dotenv').config();

const { Client, GatewayIntentBits, EmbedBuilder, ActivityType } = require('discord.js');

// Initialize client with comprehensive intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages
  ]
});

// Error handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Bot ready event
client.once('ready', () => {
  console.log(\`🚀 \${client.user.tag} is now online!\`);
  console.log(\`📊 Serving \${client.guilds.cache.size} servers\`);
  console.log(\`👥 Watching \${client.users.cache.size} users\`);
  
  // Set bot presence
  client.user.setPresence({
    activities: [{
      name: '${botData.description || 'commands'}',
      type: ActivityType.Listening
    }],
    status: process.env.BOT_STATUS || 'online'
  });
});

// Connection error handling
client.on('error', (error) => {
  console.error('Discord client error:', error);
});

client.on('warn', (warning) => {
  console.warn('Discord client warning:', warning);
});

client.on('disconnect', () => {
  console.log('Bot disconnected');
});

client.on('reconnecting', () => {
  console.log('Bot reconnecting...');
});

${baseCode.replace('client.login(process.env.DISCORD_TOKEN);', '')}

// Enhanced login with validation
const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('❌ Missing DISCORD_TOKEN environment variable');
  console.error('Please set your bot token in the environment variables');
  process.exit(1);
}

client.login(token).catch((error) => {
  console.error('❌ Failed to login:', error.message);
  console.error('Please check your DISCORD_TOKEN is valid');
  process.exit(1);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log('🔄 Shutting down gracefully...');
  client.destroy();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
`;

    return enhancements;
  }

  /**
   * Generate README for deployment
   */
  generateReadme(botData, platform) {
    return `# ${botData.name}

${botData.description}

**Created with [Vexryl](https://vexryl.com) - Visual Discord Bot Builder**

## Features

- 🤖 Discord.js v14 powered
- ⚡ Production-ready code
- 🔧 Easy configuration
- 📊 Comprehensive logging
- 🛡️ Error handling

## Quick Deploy to ${this.deploymentTemplates.get(platform)?.name}

### Prerequisites

1. Create a Discord application at [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a bot and copy the token
3. Invite your bot to your server with appropriate permissions

### Environment Variables

\`\`\`
DISCORD_TOKEN=your_bot_token_here
BOT_STATUS=online
BOT_ACTIVITY=Listening to commands
\`\`\`

### Deployment Steps

${this.getDeploymentSteps(platform)}

## Bot Configuration

This bot includes:
- ${botData.nodes?.length || 0} command/event nodes
- ${botData.edges?.length || 0} connections
- Custom variables and logic flows

## Support

Need help? Visit [Vexryl Documentation](https://docs.vexryl.com) or join our [Discord Community](https://discord.gg/vexryl)

## License

Generated code is free to use and modify.
`;
  }

  /**
   * Get platform-specific deployment steps
   */
  getDeploymentSteps(platform) {
    const steps = {
      railway: `
1. Visit [Railway](https://railway.app)
2. Sign up/Login and create a new project
3. Connect your GitHub repository or upload this code
4. Add environment variable: \`DISCORD_TOKEN\`
5. Deploy and your bot will be online!`,

      render: `
1. Visit [Render](https://render.com)
2. Create a new Web Service
3. Connect your GitHub repository
4. Set build command: \`npm install\`
5. Set start command: \`node bot.js\`
6. Add environment variable: \`DISCORD_TOKEN\`
7. Deploy!`,

      heroku: `
1. Install [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Run: \`heroku create your-bot-name\`
3. Run: \`heroku config:set DISCORD_TOKEN=your_token\`
4. Run: \`git push heroku main\`
5. Run: \`heroku ps:scale worker=1\``,

      digitalocean: `
1. Create a DigitalOcean Droplet
2. Upload and extract this code
3. Run: \`npm install\`
4. Set environment variables
5. Use PM2 or systemd to run: \`node bot.js\``
    };

    return steps[platform] || 'Platform-specific steps not available';
  }

  /**
   * Create deployment ZIP file
   */
  async createDeploymentZip(deploymentData, outputPath) {
    const archive = archiver('zip', { zlib: { level: 9 } });
    const output = await fs.open(outputPath, 'w');
    
    return new Promise((resolve, reject) => {
      archive.on('error', reject);
      archive.on('end', resolve);
      
      archive.pipe(output.createWriteStream());
      
      // Add bot code
      archive.append(deploymentData.botCode, { name: 'bot.js' });
      
      // Add README
      archive.append(deploymentData.readme, { name: 'README.md' });
      
      // Add config files
      for (const [filename, content] of Object.entries(deploymentData.configFiles)) {
        archive.append(content, { name: filename });
      }
      
      archive.finalize();
    });
  }

  /**
   * Deploy to Railway (example integration)
   */
  async deployToRailway(deploymentData, apiKey) {
    // This would integrate with Railway's API
    // For now, return deployment info
    return {
      success: true,
      deploymentId: `railway_${Date.now()}`,
      url: `https://${deploymentData.botName.toLowerCase()}.railway.app`,
      status: 'deployed',
      platform: 'railway',
      logs: []
    };
  }

  /**
   * Get deployment status
   */
  async getDeploymentStatus(deploymentId, platform) {
    // Mock implementation - integrate with actual platform APIs
    return {
      id: deploymentId,
      status: 'running',
      platform,
      uptime: '2h 34m',
      memory: '45MB',
      cpu: '0.1%',
      logs: [
        { timestamp: new Date(), level: 'info', message: 'Bot started successfully' },
        { timestamp: new Date(), level: 'info', message: 'Connected to Discord' }
      ]
    };
  }

  /**
   * Generate Discord bot invite URL
   */
  generateInviteUrl(clientId, permissions = '8') {
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
  }

  /**
   * Get supported platforms
   */
  getSupportedPlatforms() {
    return Array.from(this.deploymentTemplates.entries()).map(([key, value]) => ({
      id: key,
      name: value.name,
      description: `Deploy to ${value.name}`,
      features: this.getPlatformFeatures(key)
    }));
  }

  /**
   * Get platform-specific features
   */
  getPlatformFeatures(platform) {
    const features = {
      railway: ['Free tier available', 'Automatic deploys', 'Custom domains', 'Built-in monitoring'],
      render: ['Free tier available', 'Automatic SSL', 'GitHub integration', 'Live logs'],
      heroku: ['Popular platform', 'Add-ons ecosystem', 'CLI tools', 'Process scaling'],
      digitalocean: ['Full control', 'Multiple regions', 'Affordable pricing', 'Custom setup']
    };

    return features[platform] || [];
  }
}

export default DeploymentService;
