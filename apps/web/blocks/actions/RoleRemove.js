// Action: Role Remove
// Removes a role from a user

export default {
  id: 'roleRemove',
  name: 'Role Remove',
  description: 'Removes a role from a user.',
  category: 'Role',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to remove the role from.',
      required: true,
    },
    role: {
      type: 'role',
      label: 'Role',
      description: 'The role to remove from the user.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for removing the role.',
      required: false,
    },
  },
};
