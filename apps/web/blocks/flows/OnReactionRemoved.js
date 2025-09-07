// Flow: On Reaction Removed
// Triggered when a reaction is removed from a message

export default {
  id: 'onReactionRemoved',
  name: 'On Reaction Removed',
  description: 'Triggered when a reaction is removed from a message.',
  category: 'Reaction',
  inputs: [],
  outputs: ['reaction'],
  config: {
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'Only trigger for reactions on this message.',
      required: false,
    },
    emojiFilter: {
      type: 'string',
      label: 'Emoji Filter',
      description: 'Only trigger for this emoji.',
      required: false,
    },
  },
};
