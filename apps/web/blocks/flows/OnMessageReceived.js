// Flow: On Message Received
// Triggered when a message is sent in a channel

export default {
  id: 'onMessageReceived',
  name: 'On Message Received',
  description: 'Triggered when a message is sent in a channel.',
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
    messageContentFilter: {
      type: 'string',
      label: 'Message Content Filter',
      description: 'Only trigger for messages containing this text.',
      required: false,
    },
  },
};
