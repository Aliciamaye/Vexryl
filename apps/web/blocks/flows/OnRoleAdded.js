// Flow: On Role Added
// Triggered when a role is added to a user

export default {
  id: 'onRoleAdded',
  name: 'On Role Added',
  description: 'Triggered when a role is added to a user.',
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
