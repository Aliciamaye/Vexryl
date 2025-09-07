// Flow: On Thread Deleted
// Triggered when a thread is deleted

export default {
  id: 'onThreadDeleted',
  name: 'On Thread Deleted',
  description: 'Triggered when a thread is deleted.',
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
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the deletion event.',
      required: false,
    },
  },
};
