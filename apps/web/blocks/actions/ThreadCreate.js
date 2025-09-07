// Action: Thread Create
// Creates a new thread

export default {
  id: 'threadCreate',
  name: 'Thread Create',
  description: 'Creates a new thread.',
  category: 'Thread',
  inputs: ['channel'],
  outputs: ['thread'],
  config: {
    channel: {
      type: 'channel',
      label: 'Parent Channel',
      description: 'The channel to create the thread in.',
      required: true,
    },
    name: {
      type: 'string',
      label: 'Thread Name',
      description: 'The name of the new thread.',
      required: true,
    },
    type: {
      type: 'select',
      label: 'Thread Type',
      description: 'The type of thread to create.',
      options: ['Public', 'Private', 'News'],
      required: true,
    },
    autoArchiveDuration: {
      type: 'select',
      label: 'Auto Archive Duration',
      description: 'How long before the thread auto-archives.',
      options: ['1 hour', '24 hours', '3 days', '1 week'],
      required: false,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for creating the thread.',
      required: false,
    },
  },
};
