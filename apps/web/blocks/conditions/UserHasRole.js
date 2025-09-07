// Condition: User Has Role
// Checks if a user has a specific role

export default {
  id: 'userHasRole',
  name: 'User Has Role',
  description: 'Checks if a user has a specific role.',
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
    role: {
      type: 'role',
      label: 'Required Role',
      description: 'The role to check for.',
      required: true,
    },
  },
};
