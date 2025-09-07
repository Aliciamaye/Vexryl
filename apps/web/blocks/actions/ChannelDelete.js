// Action: Channel Delete
// Deletes a channel

export default {
  id: 'channelDelete',
  name: 'Channel Delete',
  description: 'Deletes a channel.',
  category: 'Channel',
  inputs: ['channel'],
  outputs: ['result'],
  config: {
    channel: {
      type: 'channel',
      label: 'Target Channel',
      description: 'The channel to delete.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for deleting the channel.',
      required: false,
    },
  },
};
