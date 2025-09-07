// Flow: On User Updated
// Triggered when a user's profile is updated

export default {
  id: 'onUserUpdated',
  name: 'On User Updated',
  description: 'Triggered when a user\'s profile is updated.',
  category: 'User',
  inputs: [],
  outputs: ['oldUser', 'newUser'],
  config: {
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this specific user.',
      required: false,
    },
    trackChanges: {
      type: 'array',
      label: 'Track Changes',
      description: 'Specific changes to track (username, avatar, etc.).',
      required: false,
    },
  },
};
