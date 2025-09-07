import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Server, 
  Play, 
  Download, 
  ExternalLink, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Copy,
  Settings,
  Monitor,
  Zap
} from 'lucide-react';

/**
 * Deployment Manager
 * One-click deployment interface for Discord bots
 */
export default function DeploymentManager({ botData, onClose }) {
  const [selectedPlatform, setSelectedPlatform] = useState('railway');
  const [deploymentStatus, setDeploymentStatus] = useState('idle');
  const [deploymentData, setDeploymentData] = useState(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [deploymentLogs, setDeploymentLogs] = useState([]);

  const platforms = [
    {
      id: 'railway',
      name: 'Railway',
      description: 'Deploy in seconds with automatic builds',
      icon: '🚂',
      features: ['Free tier', 'Auto deploys', 'Custom domains'],
      popular: true
    },
    {
      id: 'render',
      name: 'Render',
      description: 'Modern cloud hosting with automatic SSL',
      icon: '🔥',
      features: ['Free tier', 'GitHub integration', 'Live logs']
    },
    {
      id: 'heroku',
      name: 'Heroku',
      description: 'Popular platform with extensive add-ons',
      icon: '💜',
      features: ['CLI tools', 'Add-ons', 'Process scaling']
    },
    {
      id: 'digitalocean',
      name: 'DigitalOcean',
      description: 'Full control with custom server setup',
      icon: '🌊',
      features: ['Full control', 'Multiple regions', 'Affordable']
    }
  ];

  const [config, setConfig] = useState({
    botName: botData.name || 'my-discord-bot',
    description: botData.description || 'Created with Vexryl',
    environment: 'production',
    autoRestart: true,
    monitoring: true
  });

  useEffect(() => {
    // Generate initial code when component mounts
    generateDeploymentCode();
  }, [botData]);

  const generateDeploymentCode = async () => {
    try {
      // This would call the CodeGenerator to create the bot code
      const code = await generateBotCode(botData);
      setGeneratedCode(code);
    } catch (error) {
      console.error('Failed to generate code:', error);
    }
  };

  const generateBotCode = async (botData) => {
    // Mock code generation - in real implementation, this would use the CodeGenerator
    return `// Generated Discord.js Bot Code
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once('ready', () => {
  console.log('${botData.name} is ready!');
});

// Generated from ${botData.nodes?.length || 0} nodes
// Add your commands and events here

client.login(process.env.DISCORD_TOKEN);`;
  };

  const handleDeploy = async () => {
    setDeploymentStatus('preparing');
    addLog('info', 'Preparing deployment...');

    try {
      // Step 1: Generate deployment package
      setDeploymentStatus('generating');
      addLog('info', 'Generating deployment package...');
      
      const deploymentPackage = await generateDeploymentPackage();
      
      // Step 2: Deploy to platform
      setDeploymentStatus('deploying');
      addLog('info', `Deploying to ${platforms.find(p => p.id === selectedPlatform)?.name}...`);
      
      const deployment = await deployToplatform(deploymentPackage);
      
      // Step 3: Complete
      setDeploymentStatus('completed');
      setDeploymentData(deployment);
      addLog('success', 'Deployment completed successfully!');
      
    } catch (error) {
      setDeploymentStatus('failed');
      addLog('error', `Deployment failed: ${error.message}`);
    }
  };

  const generateDeploymentPackage = async () => {
    // Simulate API call to generate deployment package
    await delay(2000);
    
    return {
      id: `deploy_${Date.now()}`,
      platform: selectedPlatform,
      botCode: generatedCode,
      config,
      files: {
        'package.json': generatePackageJson(),
        'README.md': generateReadme(),
        '.env.example': generateEnvExample()
      }
    };
  };

  const deployToplatform = async (deploymentPackage) => {
    // Simulate deployment process
    await delay(3000);
    
    const deployment = {
      id: deploymentPackage.id,
      status: 'deployed',
      url: `https://${config.botName}.${selectedPlatform}.app`,
      platform: selectedPlatform,
      createdAt: new Date().toISOString(),
      inviteUrl: generateDiscordInviteUrl()
    };
    
    return deployment;
  };

  const generatePackageJson = () => {
    return JSON.stringify({
      name: config.botName.toLowerCase().replace(/\s+/g, '-'),
      version: '1.0.0',
      description: config.description,
      main: 'bot.js',
      scripts: {
        start: 'node bot.js'
      },
      dependencies: {
        'discord.js': '^14.14.1',
        'dotenv': '^16.3.1'
      },
      engines: {
        node: '>=18.0.0'
      }
    }, null, 2);
  };

  const generateReadme = () => {
    return `# ${config.botName}

${config.description}

## Setup

1. Set your Discord bot token: \`DISCORD_TOKEN=your_token_here\`
2. Invite the bot to your server
3. Run the bot

Created with [Vexryl](https://vexryl.com)`;
  };

  const generateEnvExample = () => {
    return `DISCORD_TOKEN=your_discord_bot_token_here
BOT_STATUS=online
BOT_ACTIVITY=Listening to commands`;
  };

  const generateDiscordInviteUrl = () => {
    const clientId = 'YOUR_BOT_CLIENT_ID';
    const permissions = '8'; // Administrator permissions
    return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${permissions}&scope=bot%20applications.commands`;
  };

  const addLog = (type, message) => {
    setDeploymentLogs(prev => [...prev, {
      id: Date.now(),
      type,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const downloadDeploymentFiles = () => {
    // Create and download a ZIP file with all deployment files
    const files = {
      'bot.js': generatedCode,
      'package.json': generatePackageJson(),
      'README.md': generateReadme(),
      '.env.example': generateEnvExample()
    };

    // In a real implementation, this would create a ZIP file
    console.log('Downloading deployment files...', files);
    alert('Deployment files would be downloaded as ZIP');
  };

  const copyInviteUrl = () => {
    const inviteUrl = deploymentData?.inviteUrl || generateDiscordInviteUrl();
    navigator.clipboard.writeText(inviteUrl);
    alert('Invite URL copied to clipboard!');
  };

  const getStatusIcon = () => {
    switch (deploymentStatus) {
      case 'preparing': return <Clock className="w-4 h-4 animate-spin" />;
      case 'generating': return <Settings className="w-4 h-4 animate-spin" />;
      case 'deploying': return <Cloud className="w-4 h-4 animate-pulse" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getStatusMessage = () => {
    switch (deploymentStatus) {
      case 'preparing': return 'Preparing deployment...';
      case 'generating': return 'Generating code and configs...';
      case 'deploying': return 'Deploying to cloud platform...';
      case 'completed': return 'Deployment completed successfully!';
      case 'failed': return 'Deployment failed';
      default: return 'Ready to deploy';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full mx-4 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Cloud className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-xl font-semibold text-white">Deploy Your Bot</h2>
              <p className="text-gray-400 text-sm">One-click deployment to cloud platforms</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-80px)]">
          {deploymentStatus === 'idle' && (
            <div className="space-y-6">
              {/* Platform Selection */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Choose Platform</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platforms.map((platform) => (
                    <div
                      key={platform.id}
                      onClick={() => setSelectedPlatform(platform.id)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedPlatform === platform.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">{platform.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-white">{platform.name}</h4>
                            {platform.popular && (
                              <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded">Popular</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mt-1">{platform.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {platform.features.map((feature) => (
                              <span
                                key={feature}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bot Configuration */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Bot Name</label>
                    <input
                      type="text"
                      value={config.botName}
                      onChange={(e) => setConfig(prev => ({ ...prev, botName: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Environment</label>
                    <select
                      value={config.environment}
                      onChange={(e) => setConfig(prev => ({ ...prev, environment: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={config.description}
                    onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white"
                    rows={3}
                  />
                </div>
              </div>

              {/* Advanced Options */}
              <div>
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                >
                  <Settings className="w-4 h-4" />
                  Advanced Options
                  <svg className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showAdvanced && (
                  <div className="mt-4 p-4 bg-gray-800 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="autoRestart"
                        checked={config.autoRestart}
                        onChange={(e) => setConfig(prev => ({ ...prev, autoRestart: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="autoRestart" className="text-gray-300">Auto-restart on crashes</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="monitoring"
                        checked={config.monitoring}
                        onChange={(e) => setConfig(prev => ({ ...prev, monitoring: e.target.checked }))}
                        className="rounded"
                      />
                      <label htmlFor="monitoring" className="text-gray-300">Enable monitoring</label>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleDeploy}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Deploy to {platforms.find(p => p.id === selectedPlatform)?.name}
                </button>
                <button
                  onClick={downloadDeploymentFiles}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Deployment Progress */}
          {deploymentStatus !== 'idle' && (
            <div className="space-y-6">
              {/* Status */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {getStatusIcon()}
                  <h3 className="text-lg font-semibold text-white">{getStatusMessage()}</h3>
                </div>
                
                {deploymentStatus === 'completed' && deploymentData && (
                  <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-400 mb-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">Deployment Successful!</span>
                    </div>
                    <p className="text-gray-300 mb-4">Your bot is now live and ready to use.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => window.open(deploymentData.url, '_blank')}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Deployment
                      </button>
                      <button
                        onClick={copyInviteUrl}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Invite URL
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Deployment Logs */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 mb-3">Deployment Logs</h4>
                <div className="bg-gray-800 rounded-lg p-4 max-h-64 overflow-y-auto">
                  {deploymentLogs.map((log) => (
                    <div key={log.id} className="flex items-start gap-3 mb-2 last:mb-0">
                      <span className="text-xs text-gray-400 min-w-16">{log.timestamp}</span>
                      <span className={`text-xs font-semibold uppercase min-w-16 ${
                        log.type === 'error' ? 'text-red-400' :
                        log.type === 'success' ? 'text-green-400' :
                        'text-blue-400'
                      }`}>
                        {log.type}
                      </span>
                      <span className="text-sm text-gray-300">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions during deployment */}
              {deploymentStatus === 'completed' && (
                <div className="flex justify-center">
                  <button
                    onClick={() => {
                      setDeploymentStatus('idle');
                      setDeploymentData(null);
                      setDeploymentLogs([]);
                    }}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Deploy Another Bot
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
