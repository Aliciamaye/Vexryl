// Hosting services integration
export const HOSTING_SERVICES = {
  railway: {
    name: 'Railway',
    description: 'Deploy with zero configuration',
    logo: '/assets/hosting/railway.svg',
    pricing: 'Free tier: $5/month for usage',
    features: ['Auto-deploy from GitHub', 'Custom domains', 'Database included', '24/7 uptime'],
    setupTime: '2 minutes',
    difficulty: 'Beginner',
    supported: true,
    popular: true
  },
  render: {
    name: 'Render',
    description: 'Simple cloud hosting',
    logo: '/assets/hosting/render.svg',
    pricing: 'Free tier available',
    features: ['Auto-scaling', 'SSL included', 'GitHub integration', 'Logs & monitoring'],
    setupTime: '3 minutes',
    difficulty: 'Beginner',
    supported: true,
    popular: true
  },
  heroku: {
    name: 'Heroku',
    description: 'Platform as a Service',
    logo: '/assets/hosting/heroku.svg',
    pricing: 'Free tier discontinued, $7/month minimum',
    features: ['Add-ons ecosystem', 'CLI tools', 'Auto-scaling', 'Multiple languages'],
    setupTime: '5 minutes',
    difficulty: 'Intermediate',
    supported: true,
    popular: false
  },
  digitalocean: {
    name: 'DigitalOcean App Platform',
    description: 'Managed app hosting',
    logo: '/assets/hosting/digitalocean.svg',
    pricing: '$5/month starter',
    features: ['Managed databases', 'Auto-scaling', 'CDN included', 'Monitoring'],
    setupTime: '5 minutes',
    difficulty: 'Intermediate',
    supported: true,
    popular: false
  },
  vercel: {
    name: 'Vercel',
    description: 'Serverless platform (functions only)',
    logo: '/assets/hosting/vercel.svg',
    pricing: 'Free tier generous',
    features: ['Serverless functions', 'Edge network', 'Git integration', 'Analytics'],
    setupTime: '2 minutes',
    difficulty: 'Advanced',
    supported: false,
    note: 'Limited to serverless functions, not ideal for Discord bots'
  },
  aws: {
    name: 'AWS EC2',
    description: 'Virtual private servers',
    logo: '/assets/hosting/aws.svg',
    pricing: 'From $3.50/month',
    features: ['Full control', 'Multiple regions', 'Auto-scaling', 'Load balancers'],
    setupTime: '15 minutes',
    difficulty: 'Expert',
    supported: true,
    popular: false
  },
  linode: {
    name: 'Linode',
    description: 'Cloud computing platform',
    logo: '/assets/hosting/linode.svg',
    pricing: 'From $5/month',
    features: ['SSD storage', 'Multiple regions', 'Load balancers', 'Backups'],
    setupTime: '10 minutes',
    difficulty: 'Advanced',
    supported: true,
    popular: false
  },
  vultr: {
    name: 'Vultr',
    description: 'High performance cloud',
    logo: '/assets/hosting/vultr.svg',
    pricing: 'From $2.50/month',
    features: ['NVMe storage', 'Worldwide locations', 'Snapshots', 'DDoS protection'],
    setupTime: '10 minutes',
    difficulty: 'Advanced',
    supported: true,
    popular: false
  },
  cloudflare: {
    name: 'Cloudflare Workers',
    description: 'Serverless edge computing',
    logo: '/assets/hosting/cloudflare.svg',
    pricing: 'Free tier: 100k requests/day',
    features: ['Edge computing', 'KV storage', 'Durable Objects', 'Global network'],
    setupTime: '5 minutes',
    difficulty: 'Expert',
    supported: false,
    note: 'Limited WebSocket support, experimental for Discord bots'
  },
  glitch: {
    name: 'Glitch',
    description: 'Community-focused hosting',
    logo: '/assets/hosting/glitch.svg',
    pricing: 'Free tier available',
    features: ['Live collaboration', 'Auto-sleep on free tier', 'Version control', 'Community'],
    setupTime: '2 minutes',
    difficulty: 'Beginner',
    supported: true,
    popular: false,
    note: 'Free tier sleeps after 5 minutes of inactivity'
  },
  replit: {
    name: 'Replit',
    description: 'Online development environment',
    logo: '/assets/hosting/replit.svg',
    pricing: 'Free tier with limitations',
    features: ['Online IDE', 'Collaboration', 'Package manager', 'Database'],
    setupTime: '1 minute',
    difficulty: 'Beginner',
    supported: true,
    popular: false,
    note: 'Free tier has uptime limitations'
  }
};

// Hosting integration API
export class HostingService {
  constructor(service) {
    this.service = service;
  }

  // Generate deployment configuration
  generateConfig(botConfig, envVars) {
    switch (this.service) {
      case 'railway':
        return this.generateRailwayConfig(botConfig, envVars);
      case 'render':
        return this.generateRenderConfig(botConfig, envVars);
      case 'heroku':
        return this.generateHerokuConfig(botConfig, envVars);
      default:
        return this.generateGenericConfig(botConfig, envVars);
    }
  }

  generateRailwayConfig(botConfig, envVars) {
    return {
      service: 'railway',
      files: {
        'package.json': {
          name: botConfig.name || 'vexryl-bot',
          version: '1.0.0',
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
          },
          dependencies: {
            'discord.js': '^14.14.1',
            'dotenv': '^16.3.1'
          },
          engines: {
            node: '18.x'
          }
        },
        'index.js': this.generateBotCode(botConfig),
        '.env.example': this.generateEnvExample(envVars),
        'railway.toml': {
          '[build]': {
            builder: 'nixpacks'
          },
          '[deploy]': {
            startCommand: 'npm start',
            restartPolicyType: 'always'
          }
        }
      },
      deployment: {
        steps: [
          'Connect your GitHub repository to Railway',
          'Set environment variables in Railway dashboard',
          'Deploy will happen automatically on push to main branch',
          'Bot will be online 24/7'
        ],
        envVars: envVars
      }
    };
  }

  generateRenderConfig(botConfig, envVars) {
    return {
      service: 'render',
      files: {
        'package.json': {
          name: botConfig.name || 'vexryl-bot',
          version: '1.0.0',
          main: 'index.js',
          scripts: {
            start: 'node index.js'
          },
          dependencies: {
            'discord.js': '^14.14.1',
            'dotenv': '^16.3.1'
          },
          engines: {
            node: '18.x'
          }
        },
        'index.js': this.generateBotCode(botConfig),
        'render.yaml': {
          services: [{
            type: 'web',
            name: botConfig.name || 'vexryl-bot',
            env: 'node',
            buildCommand: 'npm install',
            startCommand: 'npm start',
            plan: 'free',
            envVars: envVars.map(env => ({
              key: env.key,
              sync: false
            }))
          }]
        }
      },
      deployment: {
        steps: [
          'Connect your GitHub repository to Render',
          'Create a new Web Service',
          'Set environment variables in Render dashboard',
          'Deploy manually or enable auto-deploy'
        ],
        envVars: envVars
      }
    };
  }

  generateHerokuConfig(botConfig, envVars) {
    return {
      service: 'heroku',
      files: {
        'package.json': {
          name: botConfig.name || 'vexryl-bot',
          version: '1.0.0',
          main: 'index.js',
          scripts: {
            start: 'node index.js'
          },
          dependencies: {
            'discord.js': '^14.14.1',
            'dotenv': '^16.3.1'
          },
          engines: {
            node: '18.x'
          }
        },
        'index.js': this.generateBotCode(botConfig),
        'Procfile': 'worker: node index.js',
        'app.json': {
          name: botConfig.name || 'vexryl-bot',
          description: 'Discord bot created with Vexryl',
          repository: 'https://github.com/your-username/your-bot',
          keywords: ['discord', 'bot', 'vexryl'],
          env: envVars.reduce((acc, env) => {
            acc[env.key] = { description: env.description || env.key };
            return acc;
          }, {})
        }
      },
      deployment: {
        steps: [
          'Install Heroku CLI',
          'Create new Heroku app: heroku create your-bot-name',
          'Set environment variables: heroku config:set DISCORD_TOKEN=your_token',
          'Deploy: git push heroku main',
          'Scale worker: heroku ps:scale worker=1'
        ],
        envVars: envVars
      }
    };
  }

  generateGenericConfig(botConfig, envVars) {
    return {
      service: 'generic',
      files: {
        'package.json': {
          name: botConfig.name || 'vexryl-bot',
          version: '1.0.0',
          main: 'index.js',
          scripts: {
            start: 'node index.js',
            dev: 'nodemon index.js'
          },
          dependencies: {
            'discord.js': '^14.14.1',
            'dotenv': '^16.3.1'
          }
        },
        'index.js': this.generateBotCode(botConfig),
        '.env.example': this.generateEnvExample(envVars),
        'README.md': this.generateReadme(botConfig)
      },
      deployment: {
        steps: [
          'Clone/download the generated files',
          'Run npm install',
          'Create .env file with your environment variables',
          'Run npm start to test locally',
          'Deploy to your chosen hosting service'
        ],
        envVars: envVars
      }
    };
  }

  generateBotCode(botConfig) {
    const commands = botConfig.commands || [];
    const events = botConfig.events || [];

    return `
const { Client, GatewayIntentBits, Collection, SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

// Create bot client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessageReactions
  ]
});

// Commands collection
client.commands = new Collection();

// Generated Commands
${commands.map(cmd => this.generateCommandCode(cmd)).join('\n\n')}

// Register slash commands
async function registerCommands() {
  const commands = [
    ${commands.map(cmd => `new SlashCommandBuilder()
      .setName('${cmd.name}')
      .setDescription('${cmd.description}')
      ${cmd.options ? cmd.options.map(opt => this.generateOptionCode(opt)).join('\n      ') : ''}`).join(',\n    ')}
  ].map(command => command.toJSON());

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

// Generated Events
${events.map(event => this.generateEventCode(event)).join('\n\n')}

// Bot ready event
client.once('ready', async () => {
  console.log(\`Bot is ready! Logged in as \${client.user.tag}\`);
  await registerCommands();
});

// Command interaction handler
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
    `.trim();
  }

  generateCommandCode(command) {
    return `
// Command: ${command.name}
const ${command.name}Command = {
  data: new SlashCommandBuilder()
    .setName('${command.name}')
    .setDescription('${command.description}'),
  async execute(interaction) {
    // Generated command logic
    ${this.generateCommandLogic(command)}
  }
};

client.commands.set('${command.name}', ${command.name}Command);
    `.trim();
  }

  generateEventCode(event) {
    return `
// Event: ${event.name}
client.on('${event.event}', async (...args) => {
  try {
    // Generated event logic
    ${this.generateEventLogic(event)}
  } catch (error) {
    console.error('Event error:', error);
  }
});
    `.trim();
  }

  generateCommandLogic(command) {
    // This would generate the actual command logic based on the visual builder
    return `
    await interaction.reply({
      content: 'Command ${command.name} executed!',
      ephemeral: true
    });
    `;
  }

  generateEventLogic(event) {
    // This would generate the actual event logic based on the visual builder
    return `
    console.log('Event ${event.name} triggered');
    `;
  }

  generateOptionCode(option) {
    switch (option.type) {
      case 'string':
        return `.addStringOption(option => option.setName('${option.name}').setDescription('${option.description}').setRequired(${option.required || false}))`;
      case 'integer':
        return `.addIntegerOption(option => option.setName('${option.name}').setDescription('${option.description}').setRequired(${option.required || false}))`;
      case 'user':
        return `.addUserOption(option => option.setName('${option.name}').setDescription('${option.description}').setRequired(${option.required || false}))`;
      case 'channel':
        return `.addChannelOption(option => option.setName('${option.name}').setDescription('${option.description}').setRequired(${option.required || false}))`;
      case 'role':
        return `.addRoleOption(option => option.setName('${option.name}').setDescription('${option.description}').setRequired(${option.required || false}))`;
      default:
        return '';
    }
  }

  generateEnvExample(envVars) {
    return envVars.map(env => `${env.key}=${env.example || 'your_value_here'}`).join('\n');
  }

  generateReadme(botConfig) {
    return `
# ${botConfig.name || 'Vexryl Bot'}

Discord bot created with Vexryl platform.

## Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Create \`.env\` file with your credentials:
\`\`\`
DISCORD_TOKEN=your_bot_token
CLIENT_ID=your_application_id
\`\`\`

3. Run the bot:
\`\`\`bash
npm start
\`\`\`

## Features

- Slash commands
- Event handling  
- Auto-deploy ready

Generated by [Vexryl](https://vexryl.com)
    `.trim();
  }
}

export default HostingService;
