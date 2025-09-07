import React, { useState, useMemo } from 'react';
import { Search, Plus, Download, Star, Filter } from 'lucide-react';

// Complete Discord.js block definitions
export const DISCORD_BLOCKS = {
  // COMMAND BLOCKS
  commands: {
    'slash-command': {
      id: 'slash-command',
      type: 'slash-command',
      category: 'command',
      name: 'Slash Command',
      description: 'Create a Discord slash command',
      icon: '/',
      color: '#5865F2',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        name: 'mycommand',
        description: 'A custom slash command',
        options: [],
        permissions: [],
        guildOnly: false,
        ownerOnly: false,
        nsfw: false
      },
      validation: {
        name: { required: true, pattern: /^[a-z0-9_-]{1,32}$/ },
        description: { required: true, maxLength: 100 }
      }
    },
    'prefix-command': {
      id: 'prefix-command',
      type: 'prefix-command',
      category: 'command',
      name: 'Prefix Command',
      description: 'Create a traditional prefix command',
      icon: '!',
      color: '#5865F2',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        name: 'mycommand',
        aliases: [],
        description: 'A custom prefix command',
        permissions: [],
        guildOnly: false,
        ownerOnly: false,
        args: []
      }
    },
    'context-menu': {
      id: 'context-menu',
      type: 'context-menu',
      category: 'command',
      name: 'Context Menu',
      description: 'Create a right-click context menu command',
      icon: '📋',
      color: '#5865F2',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        name: 'Context Action',
        type: 'MESSAGE', // MESSAGE, USER
        permissions: []
      }
    }
  },

  // CONDITION BLOCKS
  conditions: {
    'user-has-permission': {
      id: 'user-has-permission',
      type: 'user-has-permission',
      category: 'condition',
      name: 'User Has Permission',
      description: 'Check if user has specific permission',
      icon: '🔐',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        permission: 'ADMINISTRATOR',
        checkChannel: false,
        allowOwner: true
      }
    },
    'user-has-role': {
      id: 'user-has-role',
      type: 'user-has-role',
      category: 'condition',
      name: 'User Has Role',
      description: 'Check if user has specific role',
      icon: '👑',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        roleId: '',
        roleName: '',
        requireAll: false,
        allowHigher: true
      }
    },
    'channel-type': {
      id: 'channel-type',
      type: 'channel-type',
      category: 'condition',
      name: 'Channel Type',
      description: 'Check the type of channel',
      icon: '#️⃣',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        channelType: 'GUILD_TEXT',
        allowDM: false
      }
    },
    'server-boost-level': {
      id: 'server-boost-level',
      type: 'server-boost-level',
      category: 'condition',
      name: 'Server Boost Level',
      description: 'Check server boost level',
      icon: '🚀',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        level: 1,
        operator: 'gte' // gte, lte, eq, gt, lt
      }
    },
    'member-count': {
      id: 'member-count',
      type: 'member-count',
      category: 'condition',
      name: 'Member Count',
      description: 'Check server member count',
      icon: '👥',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        count: 100,
        operator: 'gte',
        includeOnline: false
      }
    },
    'time-condition': {
      id: 'time-condition',
      type: 'time-condition',
      category: 'condition',
      name: 'Time Condition',
      description: 'Check current time/date',
      icon: '⏰',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        type: 'hour', // hour, day, date, timezone
        value: 12,
        operator: 'eq',
        timezone: 'UTC'
      }
    },
    'random-chance': {
      id: 'random-chance',
      type: 'random-chance',
      category: 'condition',
      name: 'Random Chance',
      description: 'Random percentage chance',
      icon: '🎲',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        percentage: 50,
        seed: null
      }
    },
    'cooldown': {
      id: 'cooldown',
      type: 'cooldown',
      category: 'condition',
      name: 'Cooldown',
      description: 'Add cooldown to commands',
      icon: '⏳',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['continue', 'blocked'],
      defaultConfig: {
        duration: 5000,
        scope: 'user', // user, guild, global, channel
        message: 'Please wait {remaining} seconds'
      }
    },
    'variable-check': {
      id: 'variable-check',
      type: 'variable-check',
      category: 'condition',
      name: 'Variable Check',
      description: 'Check variable value',
      icon: '📊',
      color: '#FFA500',
      inputs: ['flow'],
      outputs: ['true', 'false'],
      defaultConfig: {
        variable: '',
        operator: 'eq',
        value: '',
        dataType: 'string'
      }
    }
  },

  // ACTION BLOCKS
  actions: {
    'send-message': {
      id: 'send-message',
      type: 'send-message',
      category: 'action',
      name: 'Send Message',
      description: 'Send a message to a channel',
      icon: '💬',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        content: 'Hello, World!',
        channel: 'current',
        embed: false,
        embedData: {
          title: '',
          description: '',
          color: 0x0099FF,
          fields: [],
          thumbnail: '',
          image: '',
          footer: { text: '', iconURL: '' },
          author: { name: '', iconURL: '' },
          timestamp: false
        },
        components: [],
        files: [],
        tts: false,
        ephemeral: false,
        deleteAfter: 0
      }
    },
    'edit-message': {
      id: 'edit-message',
      type: 'edit-message',
      category: 'action',
      name: 'Edit Message',
      description: 'Edit an existing message',
      icon: '✏️',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        messageId: '',
        content: '',
        embed: false,
        embedData: {},
        components: []
      }
    },
    'delete-message': {
      id: 'delete-message',
      type: 'delete-message',
      category: 'action',
      name: 'Delete Message',
      description: 'Delete a message',
      icon: '🗑️',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        messageId: '',
        delay: 0,
        reason: ''
      }
    },
    'add-reaction': {
      id: 'add-reaction',
      type: 'add-reaction',
      category: 'action',
      name: 'Add Reaction',
      description: 'Add reaction to message',
      icon: '😀',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        messageId: '',
        emoji: '👍',
        multiple: false,
        reactions: []
      }
    },
    'add-role': {
      id: 'add-role',
      type: 'add-role',
      category: 'action',
      name: 'Add Role',
      description: 'Add role to member',
      icon: '➕',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        roleId: '',
        reason: ''
      }
    },
    'remove-role': {
      id: 'remove-role',
      type: 'remove-role',
      category: 'action',
      name: 'Remove Role',
      description: 'Remove role from member',
      icon: '➖',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        roleId: '',
        reason: ''
      }
    },
    'kick-member': {
      id: 'kick-member',
      type: 'kick-member',
      category: 'action',
      name: 'Kick Member',
      description: 'Kick a member from server',
      icon: '👢',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        reason: '',
        deleteMessages: false,
        notify: true
      }
    },
    'ban-member': {
      id: 'ban-member',
      type: 'ban-member',
      category: 'action',
      name: 'Ban Member',
      description: 'Ban a member from server',
      icon: '🔨',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        reason: '',
        deleteMessageDays: 0,
        notify: true
      }
    },
    'timeout-member': {
      id: 'timeout-member',
      type: 'timeout-member',
      category: 'action',
      name: 'Timeout Member',
      description: 'Timeout a member',
      icon: '⏰',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        duration: 600000, // 10 minutes
        reason: ''
      }
    },
    'create-channel': {
      id: 'create-channel',
      type: 'create-channel',
      category: 'action',
      name: 'Create Channel',
      description: 'Create a new channel',
      icon: '➕',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        name: 'new-channel',
        type: 'GUILD_TEXT',
        topic: '',
        parent: '',
        permissions: [],
        nsfw: false,
        rateLimitPerUser: 0
      }
    },
    'delete-channel': {
      id: 'delete-channel',
      type: 'delete-channel',
      category: 'action',
      name: 'Delete Channel',
      description: 'Delete a channel',
      icon: '🗑️',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        channelId: '',
        reason: ''
      }
    },
    'move-member': {
      id: 'move-member',
      type: 'move-member',
      category: 'action',
      name: 'Move Member',
      description: 'Move member to voice channel',
      icon: '🔄',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        channelId: '',
        reason: ''
      }
    },
    'disconnect-member': {
      id: 'disconnect-member',
      type: 'disconnect-member',
      category: 'action',
      name: 'Disconnect Member',
      description: 'Disconnect member from voice',
      icon: '🔇',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        userId: '',
        reason: ''
      }
    },
    'set-variable': {
      id: 'set-variable',
      type: 'set-variable',
      category: 'action',
      name: 'Set Variable',
      description: 'Set a variable value',
      icon: '📝',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success'],
      defaultConfig: {
        variable: '',
        value: '',
        scope: 'bot', // bot, guild, user, channel
        dataType: 'string',
        operation: 'set' // set, add, subtract, multiply, divide
      }
    },
    'wait': {
      id: 'wait',
      type: 'wait',
      category: 'action',
      name: 'Wait',
      description: 'Wait for specified time',
      icon: '⏳',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['continue'],
      defaultConfig: {
        duration: 1000,
        unit: 'ms' // ms, s, m, h
      }
    },
    'api-request': {
      id: 'api-request',
      type: 'api-request',
      category: 'action',
      name: 'API Request',
      description: 'Make HTTP API request',
      icon: '🌐',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        url: '',
        method: 'GET',
        headers: {},
        body: '',
        responseVariable: ''
      }
    },
    'webhook': {
      id: 'webhook',
      type: 'webhook',
      category: 'action',
      name: 'Send Webhook',
      description: 'Send message via webhook',
      icon: '🪝',
      color: '#00D166',
      inputs: ['flow'],
      outputs: ['success', 'error'],
      defaultConfig: {
        webhookUrl: '',
        content: '',
        username: '',
        avatarURL: '',
        embed: false,
        embedData: {}
      }
    }
  },

  // EVENT BLOCKS (Complete Discord.js events)
  events: {
    'ready': {
      id: 'ready',
      type: 'ready',
      category: 'event',
      name: 'Bot Ready',
      description: 'Bot is ready and logged in',
      icon: '🟢',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        runOnce: true
      }
    },
    'messageCreate': {
      id: 'messageCreate',
      type: 'messageCreate',
      category: 'event',
      name: 'Message Create',
      description: 'New message sent',
      icon: '💬',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        ignoreBots: true,
        ignoreWebhooks: false,
        ignoreSystem: true,
        channelFilter: [],
        userFilter: []
      }
    },
    'messageDelete': {
      id: 'messageDelete',
      type: 'messageDelete',
      category: 'event',
      name: 'Message Delete',
      description: 'Message was deleted',
      icon: '🗑️',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logDeletes: true,
        ignoreOwnDeletes: true
      }
    },
    'messageUpdate': {
      id: 'messageUpdate',
      type: 'messageUpdate',
      category: 'event',
      name: 'Message Update',
      description: 'Message was edited',
      icon: '✏️',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        ignoreBots: true,
        ignoreEmbedUpdates: true
      }
    },
    'guildMemberAdd': {
      id: 'guildMemberAdd',
      type: 'guildMemberAdd',
      category: 'event',
      name: 'Member Join',
      description: 'New member joined server',
      icon: '👋',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        welcomeMessage: true,
        autoRole: false
      }
    },
    'guildMemberRemove': {
      id: 'guildMemberRemove',
      type: 'guildMemberRemove',
      category: 'event',
      name: 'Member Leave',
      description: 'Member left server',
      icon: '👋',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        goodbyeMessage: false,
        logLeaves: true
      }
    },
    'guildMemberUpdate': {
      id: 'guildMemberUpdate',
      type: 'guildMemberUpdate',
      category: 'event',
      name: 'Member Update',
      description: 'Member was updated',
      icon: '👤',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        trackRoleChanges: true,
        trackNicknameChanges: false
      }
    },
    'messageReactionAdd': {
      id: 'messageReactionAdd',
      type: 'messageReactionAdd',
      category: 'event',
      name: 'Reaction Add',
      description: 'Reaction added to message',
      icon: '😀',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        ignoreBots: true,
        specificEmoji: '',
        specificMessage: ''
      }
    },
    'messageReactionRemove': {
      id: 'messageReactionRemove',
      type: 'messageReactionRemove',
      category: 'event',
      name: 'Reaction Remove',
      description: 'Reaction removed from message',
      icon: '😕',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        ignoreBots: true,
        specificEmoji: '',
        specificMessage: ''
      }
    },
    'voiceStateUpdate': {
      id: 'voiceStateUpdate',
      type: 'voiceStateUpdate',
      category: 'event',
      name: 'Voice State Update',
      description: 'Voice channel state changed',
      icon: '🔊',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        trackJoins: true,
        trackLeaves: true,
        trackMoves: true,
        trackMute: false,
        trackDeafen: false
      }
    },
    'guildBanAdd': {
      id: 'guildBanAdd',
      type: 'guildBanAdd',
      category: 'event',
      name: 'Member Banned',
      description: 'Member was banned',
      icon: '🔨',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logBans: true,
        announcePublic: false
      }
    },
    'guildBanRemove': {
      id: 'guildBanRemove',
      type: 'guildBanRemove',
      category: 'event',
      name: 'Member Unbanned',
      description: 'Member was unbanned',
      icon: '🔓',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logUnbans: true,
        announcePublic: false
      }
    },
    'channelCreate': {
      id: 'channelCreate',
      type: 'channelCreate',
      category: 'event',
      name: 'Channel Create',
      description: 'Channel was created',
      icon: '➕',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logCreation: true,
        announcePublic: false
      }
    },
    'channelDelete': {
      id: 'channelDelete',
      type: 'channelDelete',
      category: 'event',
      name: 'Channel Delete',
      description: 'Channel was deleted',
      icon: '🗑️',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logDeletion: true,
        announcePublic: false
      }
    },
    'roleCreate': {
      id: 'roleCreate',
      type: 'roleCreate',
      category: 'event',
      name: 'Role Create',
      description: 'Role was created',
      icon: '🏷️',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logCreation: true
      }
    },
    'roleDelete': {
      id: 'roleDelete',
      type: 'roleDelete',
      category: 'event',
      name: 'Role Delete',
      description: 'Role was deleted',
      icon: '🗑️',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        logDeletion: true
      }
    },
    'interactionCreate': {
      id: 'interactionCreate',
      type: 'interactionCreate',
      category: 'event',
      name: 'Interaction Create',
      description: 'Interaction (button, select menu, etc.)',
      icon: '🔘',
      color: '#00FF00',
      inputs: [],
      outputs: ['execution'],
      defaultConfig: {
        interactionType: 'any', // button, selectMenu, modal, slash, context
        customId: ''
      }
    }
  }
};

const BlockLibrary = ({ activeTab, onBlockDrag }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blocks = useMemo(() => {
    let blockList = [];
    
    switch (activeTab) {
      case 'commands':
        blockList = Object.values(DISCORD_BLOCKS.commands);
        break;
      case 'conditions':
        blockList = Object.values(DISCORD_BLOCKS.conditions);
        break;
      case 'actions':
        blockList = [...Object.values(DISCORD_BLOCKS.actions), ...Object.values(DISCORD_BLOCKS.events)];
        break;
      default:
        blockList = [
          ...Object.values(DISCORD_BLOCKS.commands),
          ...Object.values(DISCORD_BLOCKS.conditions),
          ...Object.values(DISCORD_BLOCKS.actions),
          ...Object.values(DISCORD_BLOCKS.events)
        ];
    }

    return blockList.filter(block => {
      const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          block.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [activeTab, searchTerm]);

  const onDragStart = (event, block) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(block));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Search */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search blocks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Block List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {blocks.map((block) => (
          <div
            key={block.id}
            draggable
            onDragStart={(event) => onDragStart(event, block)}
            className="bg-gray-700 rounded-lg p-3 border border-gray-600 hover:border-gray-500 cursor-grab active:cursor-grabbing transition-colors"
          >
            <div className="flex items-start gap-3">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: block.color + '20', color: block.color }}
              >
                {block.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white text-sm">{block.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{block.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                    {block.category}
                  </span>
                  {block.inputs?.length > 0 && (
                    <span className="text-xs text-blue-400">
                      {block.inputs.length} inputs
                    </span>
                  )}
                  {block.outputs?.length > 0 && (
                    <span className="text-xs text-green-400">
                      {block.outputs.length} outputs
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {blocks.length === 0 && (
          <div className="text-center py-8">
            <Filter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No blocks found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockLibrary;
