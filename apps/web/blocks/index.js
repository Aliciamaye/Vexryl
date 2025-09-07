// Block registry and loader system
import { lazy } from 'react';

// Block Types
export const BLOCK_TYPES = {
  OPTIONS: 'options',
  ACTIONS: 'actions', 
  CONDITIONS: 'conditions',
  FLOWS: 'flows'
};

// Dynamic block loading registry
const blockRegistry = {
  // Flow Triggers
  flows: {
    'on_message_received': {
      name: 'Message Received',
      description: 'Triggers when a new message is sent',
      category: 'message',
      component: lazy(() => import('./flows/OnMessageReceived.jsx')),
      script: lazy(() => import('./flows/OnMessageReceived.js')),
    },
    'on_user_joined': {
      name: 'User Joined',
      description: 'Triggers when a new member joins the server',
      category: 'member',
      component: lazy(() => import('./flows/OnUserJoined.jsx')),
      script: lazy(() => import('./flows/OnUserJoined.js')),
    },
    'on_button_click': {
      name: 'Button Click',
      description: 'Triggers when a user clicks a button',
      category: 'interaction',
      component: lazy(() => import('./flows/OnButtonClick.jsx')),
      script: lazy(() => import('./flows/OnButtonClick.js')),
    },
    'on_reaction_added': {
      name: 'Reaction Added',
      description: 'Triggers when a reaction is added to a message',
      category: 'message',
      component: lazy(() => import('./flows/OnReactionAdded.jsx')),
      script: lazy(() => import('./flows/OnReactionAdded.js')),
    },
  },

  // Actions
  actions: {
    'message_text': {
      name: 'Send Message',
      description: 'Send a text message to a channel',
      category: 'message',
      component: lazy(() => import('./actions/MessageText.jsx')),
      script: lazy(() => import('./actions/MessageText.js')),
    },
    'message_embed': {
      name: 'Send Embed',
      description: 'Send a rich embed message',
      category: 'message',
      component: lazy(() => import('./actions/MessageEmbed.jsx')),
      script: lazy(() => import('./actions/MessageEmbed.js')),
    },
    'user_kick': {
      name: 'Kick User',
      description: 'Remove a user from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/UserKick.jsx')),
      script: lazy(() => import('./actions/UserKick.js')),
    },
    'user_ban': {
      name: 'Ban User',
      description: 'Ban a user from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/UserBan.jsx')),
      script: lazy(() => import('./actions/UserBan.js')),
    },
    'role_add': {
      name: 'Add Role',
      description: 'Give a role to a user',
      category: 'roles',
      component: lazy(() => import('./actions/RoleAdd.jsx')),
      script: lazy(() => import('./actions/RoleAdd.js')),
    },
    'reaction_add': {
      name: 'Add Reaction',
      description: 'Add a reaction to a message',
      category: 'message',
      component: lazy(() => import('./actions/ReactionAdd.jsx')),
      script: lazy(() => import('./actions/ReactionAdd.js')),
    },
    'channel_create': {
      name: 'Create Channel',
      description: 'Create a new channel',
      category: 'channel',
      component: lazy(() => import('./actions/ChannelCreate.jsx')),
      script: lazy(() => import('./actions/ChannelCreate.js')),
    },
  },

  // Conditions
  conditions: {
    'user_has_role': {
      name: 'User Has Role',
      description: 'Check if a user has a specific role',
      category: 'user',
      component: lazy(() => import('./conditions/UserHasRole.jsx')),
      script: lazy(() => import('./conditions/UserHasRole.js')),
    },
    'message_contains': {
      name: 'Message Contains',
      description: 'Check if message contains specific text',
      category: 'message',
      component: lazy(() => import('./conditions/MessageContains.jsx')),
      script: lazy(() => import('./conditions/MessageContains.js')),
    },
    'user_permission_check': {
      name: 'User Permission',
      description: 'Check if user has specific permission',
      category: 'user',
      component: lazy(() => import('./conditions/UserPermissionCheck.jsx')),
      script: lazy(() => import('./conditions/UserPermissionCheck.js')),
    },
  },

  // Command Options (Slash command parameters)
  options: {
    'variable_get': {
      name: 'Get Variable',
      description: 'Retrieve a stored variable value',
      category: 'data',
      component: lazy(() => import('./options/VariableGet.jsx')),
      script: lazy(() => import('./options/VariableGet.js')),
    },
    'variable_set': {
      name: 'Set Variable',
      description: 'Store a value in a variable',
      category: 'data',
      component: lazy(() => import('./options/VariableSet.jsx')),
      script: lazy(() => import('./options/VariableSet.js')),
    },
    'math_operation': {
      name: 'Math Operation',
      description: 'Perform mathematical calculations',
      category: 'utility',
      component: lazy(() => import('./options/MathOperation.jsx')),
      script: lazy(() => import('./options/MathOperation.js')),
    },
    'string': {
      name: 'String Option',
      description: 'A text string parameter',
      category: 'basic',
      component: lazy(() => import('./options/StringOption.jsx')),
      script: lazy(() => import('./options/StringOption.js')),
      config: {
        required: false,
        minLength: 0,
        maxLength: 6000,
        choices: []
      }
    },
    'integer': {
      name: 'Integer Option', 
      description: 'A whole number parameter',
      category: 'basic',
      component: lazy(() => import('./options/IntegerOption.jsx')),
      script: lazy(() => import('./options/IntegerOption.js')),
      config: {
        required: false,
        minValue: null,
        maxValue: null,
        choices: []
      }
    },
    'number': {
      name: 'Number Option',
      description: 'A decimal number parameter', 
      category: 'basic',
      component: lazy(() => import('./options/NumberOption.jsx')),
      script: lazy(() => import('./options/NumberOption.js')),
      config: {
        required: false,
        minValue: null,
        maxValue: null,
        choices: []
      }
    },
    'boolean': {
      name: 'Boolean Option',
      description: 'A true/false choice parameter',
      category: 'basic',
      component: lazy(() => import('./options/BooleanOption.jsx')),
      script: lazy(() => import('./options/BooleanOption.js')),
      config: {
        required: false
      }
    },
    'user': {
      name: 'User Option',
      description: 'Select a server member',
      category: 'discord',
      component: lazy(() => import('./options/UserOption.jsx')),
      script: lazy(() => import('./options/UserOption.js')),
      config: {
        required: false
      }
    },
    'channel': {
      name: 'Channel Option',
      description: 'Select a server channel',
      category: 'discord',
      component: lazy(() => import('./options/ChannelOption.jsx')),
      script: lazy(() => import('./options/ChannelOption.js')),
      config: {
        required: false,
        channelTypes: []
      }
    },
    'role': {
      name: 'Role Option',
      description: 'Select a server role',
      category: 'discord',
      component: lazy(() => import('./options/RoleOption.jsx')),
      script: lazy(() => import('./options/RoleOption.js')),
      config: {
        required: false
      }
    },
    'mentionable': {
      name: 'Mentionable Option',
      description: 'Select a user, role, or mentionable',
      category: 'discord',
      component: lazy(() => import('./options/MentionableOption.jsx')),
      script: lazy(() => import('./options/MentionableOption.js')),
      config: {
        required: false
      }
    },
    'attachment': {
      name: 'Attachment Option',
      description: 'Upload a file',
      category: 'media',
      component: lazy(() => import('./options/AttachmentOption.jsx')),
      script: lazy(() => import('./options/AttachmentOption.js')),
      config: {
        required: false
      }
    }
  },

  // Actions (What the bot does)
  actions: {
    // Message Actions
    'send-message': {
      name: 'Send Message',
      description: 'Send a message to any channel',
      category: 'messaging',
      component: lazy(() => import('./actions/SendMessage.jsx')),
      script: lazy(() => import('./actions/SendMessage.js')),
      config: {
        content: '',
        embeds: [],
        components: [],
        ephemeral: false,
        tts: false
      }
    },
    'edit-message': {
      name: 'Edit Message',
      description: 'Edit an existing message',
      category: 'messaging',
      component: lazy(() => import('./actions/EditMessage.jsx')),
      script: lazy(() => import('./actions/EditMessage.js')),
      config: {}
    },
    'delete-message': {
      name: 'Delete Message',
      description: 'Delete a message',
      category: 'messaging',
      component: lazy(() => import('./actions/DeleteMessage.jsx')),
      script: lazy(() => import('./actions/DeleteMessage.js')),
      config: {}
    },
    'reply': {
      name: 'Reply',
      description: 'Reply to the interaction',
      category: 'messaging',
      component: lazy(() => import('./actions/Reply.jsx')),
      script: lazy(() => import('./actions/Reply.js')),
      config: {
        content: '',
        embeds: [],
        ephemeral: false
      }
    },

    // Member Management
    'add-role': {
      name: 'Add Role',
      description: 'Add roles to a member',
      category: 'moderation',
      component: lazy(() => import('./actions/AddRole.jsx')),
      script: lazy(() => import('./actions/AddRole.js')),
      config: {
        roles: [],
        reason: ''
      }
    },
    'remove-role': {
      name: 'Remove Role',
      description: 'Remove roles from a member',
      category: 'moderation',
      component: lazy(() => import('./actions/RemoveRole.jsx')),
      script: lazy(() => import('./actions/RemoveRole.js')),
      config: {
        roles: [],
        reason: ''
      }
    },
    'kick-member': {
      name: 'Kick Member',
      description: 'Kick a member from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/KickMember.jsx')),
      script: lazy(() => import('./actions/KickMember.js')),
      config: {
        reason: ''
      }
    },
    'ban-member': {
      name: 'Ban Member',
      description: 'Ban a member from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/BanMember.jsx')),
      script: lazy(() => import('./actions/BanMember.js')),
      config: {
        reason: '',
        deleteMessageDays: 1
      }
    },
    'timeout-member': {
      name: 'Timeout Member',
      description: 'Timeout a member',
      category: 'moderation',
      component: lazy(() => import('./actions/TimeoutMember.jsx')),
      script: lazy(() => import('./actions/TimeoutMember.js')),
      config: {
        duration: 300000,
        reason: ''
      }
    },

    // Channel Management
    'create-channel': {
      name: 'Create Channel',
      description: 'Create a new channel',
      category: 'management',
      component: lazy(() => import('./actions/CreateChannel.jsx')),
      script: lazy(() => import('./actions/CreateChannel.js')),
      config: {
        name: '',
        type: 0,
        parent: null
      }
    },
    'delete-channel': {
      name: 'Delete Channel',
      description: 'Delete a channel',
      category: 'management',
      component: lazy(() => import('./actions/DeleteChannel.jsx')),
      script: lazy(() => import('./actions/DeleteChannel.js')),
      config: {}
    },

    // Reactions
    'add-reaction': {
      name: 'Add Reaction',
      description: 'Add a reaction to a message',
      category: 'messaging',
      component: lazy(() => import('./actions/AddReaction.jsx')),
      script: lazy(() => import('./actions/AddReaction.js')),
      config: {
        emoji: '👍'
      }
    },

    // Voice
    'move-member': {
      name: 'Move Member',
      description: 'Move member to voice channel',
      category: 'voice',
      component: lazy(() => import('./actions/MoveMember.jsx')),
      script: lazy(() => import('./actions/MoveMember.js')),
      config: {}
    },
    'disconnect-member': {
      name: 'Disconnect Member',
      description: 'Disconnect member from voice',
      category: 'voice',
      component: lazy(() => import('./actions/DisconnectMember.jsx')),
      script: lazy(() => import('./actions/DisconnectMember.js')),
      config: {}
    },

    // Advanced
    'webhook': {
      name: 'Webhook',
      description: 'Send message via webhook',
      category: 'advanced',
      component: lazy(() => import('./actions/Webhook.jsx')),
      script: lazy(() => import('./actions/Webhook.js')),
      config: {
        webhookUrl: '',
        content: '',
        username: '',
        avatarUrl: ''
      }
    },
    'api-request': {
      name: 'API Request',
      description: 'Make HTTP API request',
      category: 'advanced',
      component: lazy(() => import('./actions/ApiRequest.jsx')),
      script: lazy(() => import('./actions/ApiRequest.js')),
      config: {
        method: 'GET',
        url: '',
        headers: {},
        body: ''
      }
    }
  },

  // Conditions (When to execute)
  conditions: {
    'user-has-permission': {
      name: 'User Has Permission',
      description: 'Check if user has specific permissions',
      category: 'permissions',
      component: lazy(() => import('./conditions/UserHasPermission.jsx')),
      script: lazy(() => import('./conditions/UserHasPermission.js')),
      config: {
        permissions: []
      }
    },
    'user-has-role': {
      name: 'User Has Role',
      description: 'Check if user has specific roles',
      category: 'roles',
      component: lazy(() => import('./conditions/UserHasRole.jsx')),
      script: lazy(() => import('./conditions/UserHasRole.js')),
      config: {
        roles: [],
        requireAll: false
      }
    },
    'channel-type': {
      name: 'Channel Type',
      description: 'Check the channel type',
      category: 'channels',
      component: lazy(() => import('./conditions/ChannelType.jsx')),
      script: lazy(() => import('./conditions/ChannelType.js')),
      config: {
        types: []
      }
    },
    'server-boost-level': {
      name: 'Server Boost Level',
      description: 'Check server boost level',
      category: 'server',
      component: lazy(() => import('./conditions/ServerBoostLevel.jsx')),
      script: lazy(() => import('./conditions/ServerBoostLevel.js')),
      config: {
        minLevel: 0
      }
    },
    'member-count': {
      name: 'Member Count',
      description: 'Check server member count',
      category: 'server',
      component: lazy(() => import('./conditions/MemberCount.jsx')),
      script: lazy(() => import('./conditions/MemberCount.js')),
      config: {
        operator: '>=',
        value: 100
      }
    },
    'time-condition': {
      name: 'Time Condition',
      description: 'Check current time/date',
      category: 'time',
      component: lazy(() => import('./conditions/TimeCondition.jsx')),
      script: lazy(() => import('./conditions/TimeCondition.js')),
      config: {
        timezone: 'UTC',
        startTime: '00:00',
        endTime: '23:59'
      }
    },
    'random-chance': {
      name: 'Random Chance',
      description: 'Random percentage chance',
      category: 'utility',
      component: lazy(() => import('./conditions/RandomChance.jsx')),
      script: lazy(() => import('./conditions/RandomChance.js')),
      config: {
        percentage: 50
      }
    },
    'cooldown': {
      name: 'Cooldown',
      description: 'Rate limiting for users',
      category: 'utility',
      component: lazy(() => import('./conditions/Cooldown.jsx')),
      script: lazy(() => import('./conditions/Cooldown.js')),
      config: {
        duration: 60000,
        scope: 'user'
      }
    }
  },

  // Event Flows (Discord Events)
  flows: {
    // Member Events
    'member-join': {
      name: 'Member Join',
      description: 'When a member joins the server',
      category: 'member',
      component: lazy(() => import('./flows/MemberJoin.jsx')),
      script: lazy(() => import('./flows/MemberJoin.js')),
      event: 'guildMemberAdd'
    },
    'member-leave': {
      name: 'Member Leave',
      description: 'When a member leaves the server',
      category: 'member',
      component: lazy(() => import('./flows/MemberLeave.jsx')),
      script: lazy(() => import('./flows/MemberLeave.js')),
      event: 'guildMemberRemove'
    },
    'member-update': {
      name: 'Member Update',
      description: 'When member info changes',
      category: 'member',
      component: lazy(() => import('./flows/MemberUpdate.jsx')),
      script: lazy(() => import('./flows/MemberUpdate.js')),
      event: 'guildMemberUpdate'
    },

    // Message Events
    'message-create': {
      name: 'Message Create',
      description: 'When a message is sent',
      category: 'message',
      component: lazy(() => import('./flows/MessageCreate.jsx')),
      script: lazy(() => import('./flows/MessageCreate.js')),
      event: 'messageCreate'
    },
    'message-delete': {
      name: 'Message Delete',
      description: 'When a message is deleted',
      category: 'message',
      component: lazy(() => import('./flows/MessageDelete.jsx')),
      script: lazy(() => import('./flows/MessageDelete.js')),
      event: 'messageDelete'
    },
    'message-update': {
      name: 'Message Update',
      description: 'When a message is edited',
      category: 'message',
      component: lazy(() => import('./flows/MessageUpdate.jsx')),
      script: lazy(() => import('./flows/MessageUpdate.js')),
      event: 'messageUpdate'
    },

    // Reaction Events  
    'reaction-add': {
      name: 'Reaction Add',
      description: 'When a reaction is added',
      category: 'reaction',
      component: lazy(() => import('./flows/ReactionAdd.jsx')),
      script: lazy(() => import('./flows/ReactionAdd.js')),
      event: 'messageReactionAdd'
    },
    'reaction-remove': {
      name: 'Reaction Remove',
      description: 'When a reaction is removed',
      category: 'reaction',
      component: lazy(() => import('./flows/ReactionRemove.jsx')),
      script: lazy(() => import('./flows/ReactionRemove.js')),
      event: 'messageReactionRemove'
    },

    // Voice Events
    'voice-state-update': {
      name: 'Voice State Update',
      description: 'When voice state changes',
      category: 'voice',
      component: lazy(() => import('./flows/VoiceStateUpdate.jsx')),
      script: lazy(() => import('./flows/VoiceStateUpdate.js')),
      event: 'voiceStateUpdate'
    },

    // Server Events
    'guild-ban-add': {
      name: 'Member Banned',
      description: 'When a member is banned',
      category: 'moderation',
      component: lazy(() => import('./flows/GuildBanAdd.jsx')),
      script: lazy(() => import('./flows/GuildBanAdd.js')),
      event: 'guildBanAdd'
    },
    'guild-ban-remove': {
      name: 'Member Unbanned',
      description: 'When a member is unbanned',
      category: 'moderation',
      component: lazy(() => import('./flows/GuildBanRemove.jsx')),
      script: lazy(() => import('./flows/GuildBanRemove.js')),
      event: 'guildBanRemove'
    },

    // Channel Events
    'channel-create': {
      name: 'Channel Create',
      description: 'When a channel is created',
      category: 'channel',
      component: lazy(() => import('./flows/ChannelCreate.jsx')),
      script: lazy(() => import('./flows/ChannelCreate.js')),
      event: 'channelCreate'
    },
    'channel-delete': {
      name: 'Channel Delete',
      description: 'When a channel is deleted',
      category: 'channel',
      component: lazy(() => import('./flows/ChannelDelete.jsx')),
      script: lazy(() => import('./flows/ChannelDelete.js')),
      event: 'channelDelete'
    },

    // Role Events
    'role-create': {
      name: 'Role Create',
      description: 'When a role is created',
      category: 'role',
      component: lazy(() => import('./flows/RoleCreate.jsx')),
      script: lazy(() => import('./flows/RoleCreate.js')),
      event: 'roleCreate'
    },
    'role-delete': {
      name: 'Role Delete',
      description: 'When a role is deleted',
      category: 'role',
      component: lazy(() => import('./flows/RoleDelete.jsx')),
      script: lazy(() => import('./flows/RoleDelete.js')),
      event: 'roleDelete'
    },

    // Interaction Events
    'button-click': {
      name: 'Button Click',
      description: 'When a button is clicked',
      category: 'interaction',
      component: lazy(() => import('./flows/ButtonClick.jsx')),
      script: lazy(() => import('./flows/ButtonClick.js')),
      event: 'interactionCreate'
    },
    'select-menu': {
      name: 'Select Menu',
      description: 'When select menu is used',
      category: 'interaction',
      component: lazy(() => import('./flows/SelectMenu.jsx')),
      script: lazy(() => import('./flows/SelectMenu.js')),
      event: 'interactionCreate'
    },
    'modal-submit': {
      name: 'Modal Submit',
      description: 'When a modal is submitted',
      category: 'interaction',
      component: lazy(() => import('./flows/ModalSubmit.jsx')),
      script: lazy(() => import('./flows/ModalSubmit.js')),
      event: 'interactionCreate'
    }
  }
};

// Helper functions
export function getBlocksByType(type) {
  return blockRegistry[type] || {};
}

export function getBlocksByCategory(type, category) {
  const blocks = getBlocksByType(type);
  return Object.entries(blocks).filter(([key, block]) => block.category === category);
}

export function getAllCategories(type) {
  const blocks = getBlocksByType(type);
  return [...new Set(Object.values(blocks).map(block => block.category))];
}

export function getBlock(type, id) {
  return blockRegistry[type]?.[id];
}

export function loadBlockComponent(type, id) {
  const block = getBlock(type, id);
  return block?.component;
}

export function loadBlockScript(type, id) {
  const block = getBlock(type, id);
  return block?.script;
}

// Get all blocks by category
export function getBlocksByCategory(category) {
  return blockRegistry[category] || {};
}

// Get all blocks for the workflow builder
export function getAllBlocks() {
  const allBlocks = [];
  
  Object.entries(blockRegistry).forEach(([category, blocks]) => {
    Object.entries(blocks).forEach(([id, block]) => {
      allBlocks.push({
        id,
        category,
        ...block,
      });
    });
  });
  
  return allBlocks;
}

// Get blocks formatted for workflow builder
export function getBlocksForBuilder() {
  return getAllBlocks().map(block => ({
    id: block.id,
    name: block.name,
    description: block.description,
    category: block.category,
    categoryInfo: {
      name: getCategoryDisplayName(block.category),
      icon: getCategoryIcon(block.category),
      color: getCategoryColor(block.category),
    },
  }));
}

// Helper functions for category display
function getCategoryDisplayName(category) {
  const categoryNames = {
    flows: 'Flow Triggers',
    actions: 'Actions',
    conditions: 'Conditions',
    options: 'Options',
  };
  return categoryNames[category] || category;
}

function getCategoryIcon(category) {
  const categoryIcons = {
    flows: '⚡',
    actions: '🎯',
    conditions: '🔀',
    options: '⚙️',
  };
  return categoryIcons[category] || '📦';
}

function getCategoryColor(category) {
  const categoryColors = {
    flows: 'blue',
    actions: 'green',
    conditions: 'yellow',
    options: 'purple',
  };
  return categoryColors[category] || 'gray';
}

export default blockRegistry;
