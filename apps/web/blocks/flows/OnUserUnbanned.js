// Flow: On User Unbanned
// Triggered when a user is unbanned from the server

export default {
  id: 'onUserUnbanned',
  name: 'On User Unbanned',
  description: 'Triggered when a user is unbanned from the server.',
  category: 'Moderation',
  inputs: [],
  outputs: ['user'],
  config: {
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this specific user.',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the unban event.',
      required: false,
    },
  },
};
