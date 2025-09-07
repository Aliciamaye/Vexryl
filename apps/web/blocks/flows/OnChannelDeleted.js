// Flow: On Channel Deleted
// Triggered when a channel is deleted

export default {
  id: 'onChannelDeleted',
  name: 'On Channel Deleted',
  description: 'Triggered when a channel is deleted.',
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
      description: 'Channel to log the deletion event.',
      required: false,
    },
  },
};
