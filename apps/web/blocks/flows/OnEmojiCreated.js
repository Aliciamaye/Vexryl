// Flow: On Emoji Created
// Triggered when an emoji is created

export default {
  id: 'onEmojiCreated',
  name: 'On Emoji Created',
  description: 'Triggered when an emoji is created.',
  category: 'Emoji',
  inputs: [],
  outputs: ['emoji'],
  config: {
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the emoji creation event.',
      required: false,
    },
    announceChannel: {
      type: 'channel',
      label: 'Announce Channel',
      description: 'Channel to announce the new emoji.',
      required: false,
    },
  },
};
