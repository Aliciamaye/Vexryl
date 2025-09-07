// Action: User Kick
// Kicks a user from the server

export default {
  id: 'userKick',
  name: 'User Kick',
  description: 'Kicks a user from the server.',
  category: 'Moderation',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to kick from the server.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Kick Reason',
      description: 'Reason for kicking the user.',
      required: false,
    },
  },
};
