// Action: Role Add
// Adds a role to a user

export default {
  id: 'roleAdd',
  name: 'Role Add',
  description: 'Adds a role to a user.',
  category: 'Role',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to add the role to.',
      required: true,
    },
    role: {
      type: 'role',
      label: 'Role',
      description: 'The role to add to the user.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for adding the role.',
      required: false,
    },
  },
};
