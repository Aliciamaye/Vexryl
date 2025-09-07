// Flow: On Reaction Added
// Triggered when a reaction is added to a message

export default {
  id: 'onReactionAdded',
  name: 'On Reaction Added',
  description: 'Triggered when a reaction is added to a message.',
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
