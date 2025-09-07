// Flow: On User Joined
// Triggered when a user joins the server

export default {
  id: 'onUserJoined',
  name: 'On User Joined',
  description: 'Triggered when a user joins the server.',
  category: 'User',
  inputs: [],
  outputs: ['user'],
  config: {
    welcomeMessage: {
      type: 'string',
      label: 'Welcome Message',
      description: 'Message to send when a user joins.',
      required: false,
    },
    assignRole: {
      type: 'role',
      label: 'Assign Role',
      description: 'Role to assign to the user.',
      required: false,
    },
  },
};
