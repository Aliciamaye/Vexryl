// Flow: On User Banned
// Triggered when a user is banned from the server

export default {
  id: 'onUserBanned',
  name: 'On User Banned',
  description: 'Triggered when a user is banned from the server.',
  category: 'Moderation',
  inputs: [],
  outputs: ['user', 'ban'],
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
      description: 'Channel to log the ban event.',
      required: false,
    },
  },
};
