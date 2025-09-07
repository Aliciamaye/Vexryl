// Flow: On Emoji Deleted
// Triggered when an emoji is deleted

export default {
  id: 'onEmojiDeleted',
  name: 'On Emoji Deleted',
  description: 'Triggered when an emoji is deleted.',
  category: 'Emoji',
  inputs: [],
  outputs: ['emoji'],
  config: {
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the emoji deletion event.',
      required: false,
    },
  },
};
