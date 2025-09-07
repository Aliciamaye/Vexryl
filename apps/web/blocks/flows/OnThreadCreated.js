// Flow: On Thread Created
// Triggered when a thread is created

export default {
  id: 'onThreadCreated',
  name: 'On Thread Created',
  description: 'Triggered when a thread is created.',
  category: 'Thread',
  inputs: [],
  outputs: ['thread'],
  config: {
    parentChannelFilter: {
      type: 'channel',
      label: 'Parent Channel Filter',
      description: 'Only trigger for threads in this channel.',
      required: false,
    },
    threadType: {
      type: 'string',
      label: 'Thread Type',
      description: 'Only trigger for this type of thread (public, private, news).',
      required: false,
    },
  },
};
