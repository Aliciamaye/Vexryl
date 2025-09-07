// Action: User Ban
// Bans a user from the server

export default {
  id: 'userBan',
  name: 'User Ban',
  description: 'Bans a user from the server.',
  category: 'Moderation',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to ban from the server.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Ban Reason',
      description: 'Reason for banning the user.',
      required: false,
    },
    deleteMessageDays: {
      type: 'integer',
      label: 'Delete Message Days',
      description: 'Number of days of messages to delete (0-7).',
      required: false,
      min: 0,
      max: 7,
    },
  },
};
