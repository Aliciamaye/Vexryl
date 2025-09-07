// Condition: User Is Bot
// Checks if a user is a bot

export default {
  id: 'userIsBot',
  name: 'User Is Bot',
  description: 'Checks if a user is a bot.',
  category: 'User',
  inputs: ['user'],
  outputs: ['true', 'false'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to check.',
      required: true,
    },
  },
};
