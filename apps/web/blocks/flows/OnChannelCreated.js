// Flow: On Channel Created
// Triggered when a channel is created

export default {
  id: 'onChannelCreated',
  name: 'On Channel Created',
  description: 'Triggered when a channel is created.',
  category: 'Channel',
  inputs: [],
  outputs: ['channel'],
  config: {
    channelType: {
      type: 'string',
      label: 'Channel Type',
      description: 'Only trigger for this type of channel (text, voice, category).',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the creation event.',
      required: false,
    },
  },
};
