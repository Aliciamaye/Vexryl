// Action: Channel Create
// Creates a new channel

export default {
  id: 'channelCreate',
  name: 'Channel Create',
  description: 'Creates a new channel.',
  category: 'Channel',
  inputs: [],
  outputs: ['channel'],
  config: {
    name: {
      type: 'string',
      label: 'Channel Name',
      description: 'The name of the new channel.',
      required: true,
    },
    type: {
      type: 'select',
      label: 'Channel Type',
      description: 'The type of channel to create.',
      options: ['Text', 'Voice', 'Category', 'News', 'Stage'],
      required: true,
    },
    parent: {
      type: 'channel',
      label: 'Parent Category',
      description: 'The category to create the channel in.',
      required: false,
    },
    topic: {
      type: 'string',
      label: 'Channel Topic',
      description: 'The topic/description for the channel.',
      required: false,
    },
    nsfw: {
      type: 'boolean',
      label: 'NSFW',
      description: 'Whether the channel is age-restricted.',
      required: false,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for creating the channel.',
      required: false,
    },
  },
};
