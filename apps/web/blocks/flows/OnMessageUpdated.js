// Flow: On Message Updated
// Triggered when a message is edited

export default {
  id: 'onMessageUpdated',
  name: 'On Message Updated',
  description: 'Triggered when a message is edited.',
  category: 'Message',
  inputs: [],
  outputs: ['oldMessage', 'newMessage'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for messages in this channel.',
      required: false,
    },
    authorFilter: {
      type: 'user',
      label: 'Author Filter',
      description: 'Only trigger for messages by this user.',
      required: false,
    },
  },
};
