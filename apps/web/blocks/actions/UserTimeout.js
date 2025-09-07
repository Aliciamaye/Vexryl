// Action: User Timeout
// Times out a user (mute for specified duration)

export default {
  id: 'userTimeout',
  name: 'User Timeout',
  description: 'Times out a user (mute for specified duration).',
  category: 'Moderation',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to timeout.',
      required: true,
    },
    duration: {
      type: 'select',
      label: 'Timeout Duration',
      description: 'How long to timeout the user.',
      options: ['60 seconds', '5 minutes', '10 minutes', '1 hour', '1 day', '1 week'],
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for timing out the user.',
      required: false,
    },
  },
};
