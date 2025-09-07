// Flow: On Presence Updated
// Triggered when a user's presence (status) is updated

export default {
  id: 'onPresenceUpdated',
  name: 'On Presence Updated',
  description: 'Triggered when a user\'s presence (status) is updated.',
  category: 'User',
  inputs: [],
  outputs: ['oldPresence', 'newPresence'],
  config: {
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this specific user.',
      required: false,
    },
    statusFilter: {
      type: 'string',
      label: 'Status Filter',
      description: 'Only trigger for specific status changes (online, offline, idle, dnd).',
      required: false,
    },
  },
};
