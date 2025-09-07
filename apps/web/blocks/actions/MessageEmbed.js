// Action: Send Embed
// Sends an embed message to a Discord channel

export default {
  id: 'sendEmbed',
  name: 'Send Embed',
  description: 'Sends an embed message to a Discord channel.',
  category: 'Message',
  inputs: ['channel'],
  outputs: ['message'],
  config: {
    title: {
      type: 'string',
      label: 'Embed Title',
      description: 'The title of the embed.',
      required: false,
    },
    description: {
      type: 'string',
      label: 'Embed Description',
      description: 'The description of the embed.',
      required: false,
    },
    color: {
      type: 'color',
      label: 'Embed Color',
      description: 'The color of the embed.',
      required: false,
    },
    thumbnail: {
      type: 'string',
      label: 'Thumbnail URL',
      description: 'URL for the thumbnail image.',
      required: false,
    },
    image: {
      type: 'string',
      label: 'Image URL',
      description: 'URL for the main image.',
      required: false,
    },
    footer: {
      type: 'string',
      label: 'Footer Text',
      description: 'Text for the footer.',
      required: false,
    },
    channel: {
      type: 'channel',
      label: 'Target Channel',
      description: 'The channel to send the embed to.',
      required: true,
    },
  },
};
