// Action: Reaction Add
// Adds a reaction to a message

export default {
  id: 'reactionAdd',
  name: 'Reaction Add',
  description: 'Adds a reaction to a message.',
  category: 'Reaction',
  inputs: ['message'],
  outputs: ['result'],
  config: {
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'The ID of the message to react to.',
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
      description: 'The emoji to react with.',
      required: true,
    },
  },
};
