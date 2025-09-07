// Flow: On User Left
// Triggered when a user leaves the server

export default {
  id: 'onUserLeft',
  name: 'On User Left',
  description: 'Triggered when a user leaves the server.',
  category: 'User',
  inputs: [],
  outputs: ['user'],
  config: {
    farewellMessage: {
      type: 'string',
      label: 'Farewell Message',
      description: 'Message to send when a user leaves.',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the event.',
      required: false,
    },
  },
};
