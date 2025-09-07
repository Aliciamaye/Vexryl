// Flow: On Role Removed
// Triggered when a role is removed from a user

export default {
  id: 'onRoleRemoved',
  name: 'On Role Removed',
  description: 'Triggered when a role is removed from a user.',
  category: 'Role',
  inputs: [],
  outputs: ['user', 'role'],
  config: {
    roleFilter: {
      type: 'role',
      label: 'Role Filter',
      description: 'Only trigger for this specific role.',
      required: false,
    },
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this specific user.',
      required: false,
    },
  },
};
