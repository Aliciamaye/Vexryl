import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ExternalLink, Check, Copy, AlertCircle, Bot, Settings, Zap } from 'lucide-react';
import { useToast } from '../stores/ToastStore';
import { useDiscordBot } from '../stores/DiscordBotStore';

const BotSetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [botData, setBotData] = useState({
    name: '',
    description: '',
    clientId: '',
    token: '',
    permissions: '8', // Administrator by default
    intents: ['GUILDS', 'GUILD_MESSAGES', 'MESSAGE_CONTENT']
  });
  const [loading, setLoading] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copiedUrl, setCopiedUrl] = useState(false);
  
  const { toast } = { toast: (message) => console.log(message) }; // Temporary placeholder
  const { addBot } = { addBot: (bot) => console.log('Adding bot:', bot) }; // Temporary placeholder

  const requiredIntents = [
    { id: 'GUILDS', label: 'Guilds', description: 'Required for basic bot functionality' },
    { id: 'GUILD_MESSAGES', label: 'Guild Messages', description: 'Read messages in servers' },
    { id: 'MESSAGE_CONTENT', label: 'Message Content', description: 'Access message content (required for most features)' },
    { id: 'GUILD_MEMBERS', label: 'Guild Members', description: 'Access member information' },
    { id: 'GUILD_PRESENCES', label: 'Guild Presences', description: 'See member activity status' },
    { id: 'DIRECT_MESSAGES', label: 'Direct Messages', description: 'Send/receive DMs' }
  ];

  const commonPermissions = [
    { value: '8', label: 'Administrator', description: 'Full server control (recommended for setup)' },
    { value: '395137211456', label: 'Standard Bot', description: 'Send messages, manage roles, moderate' },
    { value: '2048', label: 'Send Messages', description: 'Basic message sending only' },
    { value: '3072', label: 'Send Messages + Embed Links', description: 'Messages with rich embeds' }
  ];

  const handleInputChange = (field, value) => {
    setBotData(prev => ({ ...prev, [field]: value }));
  };

  const handleIntentToggle = (intentId) => {
    setBotData(prev => ({
      ...prev,
      intents: prev.intents.includes(intentId)
        ? prev.intents.filter(i => i !== intentId)
        : [...prev.intents, intentId]
    }));
  };

  const validateBot = async () => {
    if (!botData.clientId || !botData.token) {
      toast.error('Client ID and Token are required');
      return false;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/discord/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: botData.clientId,
          token: botData.token
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to validate bot');
      }

      // Update bot data with validated info
      setBotData(prev => ({
        ...prev,
        name: result.botInfo.username,
        avatar: result.botInfo.avatar
      }));

      return true;
    } catch (error) {
      toast.error(`Validation failed: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const generateInviteUrl = () => {
    const baseUrl = 'https://discord.com/api/oauth2/authorize';
    const params = new URLSearchParams({
      client_id: botData.clientId,
      permissions: botData.permissions,
      scope: 'bot applications.commands'
    });
    
    const url = `${baseUrl}?${params.toString()}`;
    setInviteUrl(url);
  };

  const copyInviteUrl = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedUrl(true);
      toast.success('Invite URL copied to clipboard!');
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      toast.error('Failed to copy URL');
    }
  };

  const completeSetup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/bots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botData)
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to create bot');
      }

      // Add to local store
      addBot(result.bot);
      
      toast.success('Bot created successfully!');
      onComplete?.(result.bot);
    } catch (error) {
      toast.error(`Setup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = async () => {
    if (step === 2) {
      const isValid = await validateBot();
      if (!isValid) return;
    }
    
    if (step === 3) {
      generateInviteUrl();
    }
    
    setStep(prev => prev + 1);
  };

  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-16 h-0.5 mx-2 ${
                step > stepNum ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Bot Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="botName">Bot Name</Label>
              <Input
                id="botName"
                value={botData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="My Awesome Bot"
              />
            </div>
            
            <div>
              <Label htmlFor="botDescription">Description (Optional)</Label>
              <Textarea
                id="botDescription"
                value={botData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what your bot does..."
                rows={3}
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Need to create a Discord bot?</h4>
              <p className="text-blue-700 text-sm mb-3">
                Visit the Discord Developer Portal to create your bot and get the required credentials.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open('https://discord.com/developers/applications', '_blank')}
                className="text-blue-600 border-blue-200 hover:bg-blue-100"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Discord Developer Portal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Discord Credentials */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Discord Bot Credentials
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientId">Client ID *</Label>
              <Input
                id="clientId"
                value={botData.clientId}
                onChange={(e) => handleInputChange('clientId', e.target.value)}
                placeholder="123456789012345678"
              />
              <p className="text-sm text-gray-500 mt-1">
                Found in General Information section of your Discord app
              </p>
            </div>
            
            <div>
              <Label htmlFor="token">Bot Token *</Label>
              <Input
                id="token"
                type="password"
                value={botData.token}
                onChange={(e) => handleInputChange('token', e.target.value)}
                placeholder="Your bot token"
              />
              <p className="text-sm text-gray-500 mt-1">
                Found in Bot section - keep this secret!
              </p>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">Security Notice</h4>
                  <p className="text-amber-700 text-sm">
                    Your bot token will be encrypted and stored securely. Never share your token with anyone.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Permissions & Intents */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Bot Permissions & Intents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-base font-medium">Permissions</Label>
              <p className="text-sm text-gray-500 mb-3">
                Choose the permissions your bot needs in Discord servers
              </p>
              <div className="space-y-2">
                {commonPermissions.map((perm) => (
                  <label key={perm.value} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="permissions"
                      value={perm.value}
                      checked={botData.permissions === perm.value}
                      onChange={(e) => handleInputChange('permissions', e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{perm.label}</div>
                      <div className="text-sm text-gray-500">{perm.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-medium">Gateway Intents</Label>
              <p className="text-sm text-gray-500 mb-3">
                Select what events your bot can receive from Discord
              </p>
              <div className="space-y-2">
                {requiredIntents.map((intent) => (
                  <label key={intent.id} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={botData.intents.includes(intent.id)}
                      onChange={() => handleIntentToggle(intent.id)}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{intent.label}</div>
                      <div className="text-sm text-gray-500">{intent.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Invite Bot */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Invite Your Bot to Discord</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Almost Done!</h4>
              <p className="text-green-700 text-sm">
                Use the invite link below to add your bot to a Discord server, then complete the setup.
              </p>
            </div>

            {inviteUrl && (
              <div>
                <Label>Bot Invite URL</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input value={inviteUrl} readOnly className="flex-1" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyInviteUrl}
                    className={copiedUrl ? 'text-green-600 border-green-200' : ''}
                  >
                    {copiedUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                onClick={() => window.open(inviteUrl, '_blank')}
                className="flex-1"
                disabled={!inviteUrl}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open Invite Link
              </Button>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Next Steps:</h4>
              <ol className="text-blue-700 text-sm space-y-1 ml-4 list-decimal">
                <li>Click the invite link above</li>
                <li>Select a Discord server to add your bot</li>
                <li>Authorize the requested permissions</li>
                <li>Return here and click "Complete Setup"</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={step === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {step < 4 ? (
            <Button onClick={nextStep} disabled={loading}>
              {loading ? 'Validating...' : 'Next'}
            </Button>
          ) : (
            <Button onClick={completeSetup} disabled={loading}>
              {loading ? 'Creating Bot...' : 'Complete Setup'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BotSetupWizard;
