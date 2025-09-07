// Action: User Nickname
// Changes a user's nickname

export default {
  id: 'userNickname',
  name: 'User Nickname',
  description: 'Changes a user\'s nickname.',
  category: 'User',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to change nickname for.',
      required: true,
    },
    nickname: {
      type: 'string',
      label: 'New Nickname',
      description: 'The new nickname for the user (leave empty to remove).',
      required: false,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for changing the nickname.',
      required: false,
    },
  },
};
