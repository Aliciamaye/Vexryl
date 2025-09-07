// Action: User Unban
// Unbans a user from the server

export default {
  id: 'userUnban',
  name: 'User Unban',
  description: 'Unbans a user from the server.',
  category: 'Moderation',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    userId: {
      type: 'string',
      label: 'User ID',
      description: 'The ID of the user to unban.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Unban Reason',
      description: 'Reason for unbanning the user.',
      required: false,
    },
  },
};
