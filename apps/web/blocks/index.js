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
      component: lazy(() => import('./actions/MessageText.jsx')),
      script: lazy(() => import('./actions/MessageText.js')),
      config: {
        content: '',
        channel: '',
        ephemeral: false
      }
    },
    'edit-message': {
      name: 'Edit Message',
      description: 'Edit an existing message',
      category: 'messaging',
      component: lazy(() => import('./actions/MessageEdit.jsx')),
      script: lazy(() => import('./actions/MessageEdit.js')),
      config: {}
    },

    // Member Management
    'add-role': {
      name: 'Add Role',
      description: 'Add roles to a member',
      category: 'moderation',
      component: lazy(() => import('./actions/RoleAdd.jsx')),
      script: lazy(() => import('./actions/RoleAdd.js')),
      config: {
        roles: [],
        reason: ''
      }
    },
    'remove-role': {
      name: 'Remove Role',
      description: 'Remove roles from a member',
      category: 'moderation',
      component: lazy(() => import('./actions/RoleRemove.jsx')),
      script: lazy(() => import('./actions/RoleRemove.js')),
      config: {
        roles: [],
        reason: ''
      }
    },
    'kick-member': {
      name: 'Kick Member',
      description: 'Kick a member from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/UserKick.jsx')),
      script: lazy(() => import('./actions/UserKick.js')),
      config: {
        reason: ''
      }
    },
    'ban-member': {
      name: 'Ban Member',
      description: 'Ban a member from the server',
      category: 'moderation',
      component: lazy(() => import('./actions/UserBan.jsx')),
      script: lazy(() => import('./actions/UserBan.js')),
      config: {
        reason: '',
        deleteMessageDays: 1
      }
    },
    'timeout-member': {
      name: 'Timeout Member',
      description: 'Timeout a member',
      category: 'moderation',
      component: lazy(() => import('./actions/UserTimeout.jsx')),
      script: lazy(() => import('./actions/UserTimeout.js')),
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
      component: lazy(() => import('./actions/ChannelCreate.jsx')),
      script: lazy(() => import('./actions/ChannelCreate.js')),
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
      component: lazy(() => import('./actions/ChannelDelete.jsx')),
      script: lazy(() => import('./actions/ChannelDelete.js')),
      config: {}
    },

    // Reactions
    'add-reaction': {
      name: 'Add Reaction',
      description: 'Add a reaction to a message',
      category: 'messaging',
      component: lazy(() => import('./actions/ReactionAdd.jsx')),
      script: lazy(() => import('./actions/ReactionAdd.js')),
      config: {
        emoji: '👍'
      }
    },

    // Voice
    'move-member': {
      name: 'Move Member',
      description: 'Move member to voice channel',
      category: 'voice',
      component: lazy(() => import('./actions/VoiceMove.jsx')),
      script: lazy(() => import('./actions/VoiceMove.js')),
      config: {}
    },
    'disconnect-member': {
      name: 'Disconnect Member',
      description: 'Disconnect member from voice',
      category: 'voice',
      component: lazy(() => import('./actions/VoiceMove.jsx')),
      script: lazy(() => import('./actions/VoiceMove.js')),
      config: {}
    },
  // (Advanced actions temporarily removed: webhook, api-request - missing implementation files)
  },

  // Conditions (When to execute) - Only existing files
  conditions: {
    'user-has-permission': {
      name: 'User Has Permission',
      description: 'Check if user has specific permissions',
      category: 'permissions',
      component: lazy(() => import('./conditions/UserPermissionCheck.jsx')),
      script: lazy(() => import('./conditions/UserPermissionCheck.js')),
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
      component: lazy(() => import('./conditions/ChannelTypeIs.jsx')),
      script: lazy(() => import('./conditions/ChannelTypeIs.js')),
      config: {
        types: []
      }
    },
    'message-contains': {
      name: 'Message Contains',
      description: 'Check if message contains specific text',
      category: 'message',
      component: lazy(() => import('./conditions/MessageContains.jsx')),
      script: lazy(() => import('./conditions/MessageContains.js')),
      config: {
        text: '',
        caseSensitive: false
      }
    },
    'user-is-bot': {
      name: 'User Is Bot',
      description: 'Check if user is a bot',
      category: 'user',
      component: lazy(() => import('./conditions/UserIsBot.jsx')),
      script: lazy(() => import('./conditions/UserIsBot.js')),
      config: {}
    },
    'message-has-attachment': {
      name: 'Message Has Attachment',
      description: 'Check if message has attachments',
      category: 'message',
      component: lazy(() => import('./conditions/MessageHasAttachment.jsx')),
      script: lazy(() => import('./conditions/MessageHasAttachment.js')),
      config: {}
    }
  },  // Event Flows (Discord Events) - Only existing files
  flows: {
    // Message Events
    'message-received': {
      name: 'Message Received',
      description: 'When a message is received',
      category: 'message',
      component: lazy(() => import('./flows/OnMessageReceived.jsx')),
      script: lazy(() => import('./flows/OnMessageReceived.js')),
      event: 'messageCreate'
    },
    'reaction-added': {
      name: 'Reaction Added',
      description: 'When a reaction is added',
      category: 'reaction',
      component: lazy(() => import('./flows/OnReactionAdded.jsx')),
      script: lazy(() => import('./flows/OnReactionAdded.js')),
      event: 'messageReactionAdd'
    },
    'user-joined': {
      name: 'User Joined',
      description: 'When a user joins the server',
      category: 'member',
      component: lazy(() => import('./flows/OnUserJoined.jsx')),
      script: lazy(() => import('./flows/OnUserJoined.js')),
      event: 'guildMemberAdd'
    },
    'button-clicked': {
      name: 'Button Clicked',
      description: 'When a button is clicked',
      category: 'interaction',
      component: lazy(() => import('./flows/OnButtonClick.jsx')),
      script: lazy(() => import('./flows/OnButtonClick.js')),
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
