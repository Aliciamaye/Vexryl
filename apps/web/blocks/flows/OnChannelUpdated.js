// Flow: On Channel Updated
// Triggered when a channel is updated/modified

export default {
  id: 'onChannelUpdated',
  name: 'On Channel Updated',
  description: 'Triggered when a channel is updated/modified.',
  category: 'Channel',
  inputs: [],
  outputs: ['oldChannel', 'newChannel'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for this specific channel.',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the update event.',
      required: false,
    },
  },
};
