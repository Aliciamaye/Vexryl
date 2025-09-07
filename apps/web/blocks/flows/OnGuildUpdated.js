// Flow: On Guild Updated
// Triggered when the server/guild settings are updated

export default {
  id: 'onGuildUpdated',
  name: 'On Guild Updated',
  description: 'Triggered when the server/guild settings are updated.',
  category: 'Server',
  inputs: [],
  outputs: ['oldGuild', 'newGuild'],
  config: {
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the server update event.',
      required: false,
    },
    trackChanges: {
      type: 'array',
      label: 'Track Changes',
      description: 'Specific changes to track (name, icon, banner, etc.).',
      required: false,
    },
  },
};
