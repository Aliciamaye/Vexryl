// Condition: Channel Type Is
// Checks if a channel is of a specific type

export default {
  id: 'channelTypeIs',
  name: 'Channel Type Is',
  description: 'Checks if a channel is of a specific type.',
  category: 'Channel',
  inputs: ['channel'],
  outputs: ['true', 'false'],
  config: {
    channel: {
      type: 'channel',
      label: 'Target Channel',
      description: 'The channel to check.',
      required: true,
    },
    type: {
      type: 'select',
      label: 'Channel Type',
      description: 'The channel type to check for.',
      options: ['Text', 'Voice', 'Category', 'News', 'Stage', 'Thread'],
      required: true,
    },
  },
};
