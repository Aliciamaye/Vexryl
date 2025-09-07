// Condition: Channel Name Contains
// Checks if a channel name contains specific text

export default {
  id: 'channelNameContains',
  name: 'Channel Name Contains',
  description: 'Checks if a channel name contains specific text.',
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
    text: {
      type: 'string',
      label: 'Text to Check',
      description: 'The text to search for in the channel name.',
      required: true,
    },
    caseSensitive: {
      type: 'boolean',
      label: 'Case Sensitive',
      description: 'Whether the search should be case sensitive.',
      required: false,
    },
  },
};
