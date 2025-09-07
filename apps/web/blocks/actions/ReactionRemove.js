// Action: Reaction Remove
// Removes a reaction from a message

export default {
  id: 'reactionRemove',
  name: 'Reaction Remove',
  description: 'Removes a reaction from a message.',
  category: 'Reaction',
  inputs: ['message'],
  outputs: ['result'],
  config: {
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'The ID of the message to remove reaction from.',
      required: true,
    },
    channel: {
      type: 'channel',
      label: 'Channel',
      description: 'The channel containing the message.',
      required: true,
    },
    emoji: {
      type: 'string',
      label: 'Emoji',
      description: 'The emoji to remove.',
      required: true,
    },
    user: {
      type: 'user',
      label: 'User',
      description: 'The user whose reaction to remove (optional).',
      required: false,
    },
  },
};
