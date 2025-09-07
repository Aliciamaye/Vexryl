// Condition: User Status Check
// Checks a user's online status

export default {
  id: 'userStatusCheck',
  name: 'User Status Check',
  description: 'Checks a user\'s online status.',
  category: 'User',
  inputs: ['user'],
  outputs: ['true', 'false'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to check status for.',
      required: true,
    },
    status: {
      type: 'select',
      label: 'Status',
      description: 'The status to check for.',
      options: ['Online', 'Idle', 'Do Not Disturb', 'Offline'],
      required: true,
    },
  },
};
