// Action: Message Delete
// Deletes a message from a channel

export default {
  id: 'messageDelete',
  name: 'Message Delete',
  description: 'Deletes a message from a channel.',
  category: 'Message',
  inputs: ['message'],
  outputs: ['result'],
  config: {
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'The ID of the message to delete.',
      required: true,
    },
    channel: {
      type: 'channel',
      label: 'Channel',
      description: 'The channel containing the message.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for deleting the message.',
      required: false,
    },
  },
};
