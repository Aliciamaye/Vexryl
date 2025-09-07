// Flow: On Message Deleted
// Triggered when a message is deleted

export default {
  id: 'onMessageDeleted',
  name: 'On Message Deleted',
  description: 'Triggered when a message is deleted.',
  category: 'Message',
  inputs: [],
  outputs: ['message'],
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
