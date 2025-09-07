// Flow: On Typing Started
// Triggered when a user starts typing

export default {
  id: 'onTypingStarted',
  name: 'On Typing Started',
  description: 'Triggered when a user starts typing.',
  category: 'User',
  inputs: [],
  outputs: ['user', 'channel'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for typing in this channel.',
      required: false,
    },
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this specific user.',
      required: false,
    },
  },
};
