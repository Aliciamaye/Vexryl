// Action: Message Edit
// Edits an existing message

export default {
  id: 'messageEdit',
  name: 'Message Edit',
  description: 'Edits an existing message.',
  category: 'Message',
  inputs: ['message'],
  outputs: ['message'],
  config: {
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'The ID of the message to edit.',
      required: true,
    },
    channel: {
      type: 'channel',
      label: 'Channel',
      description: 'The channel containing the message.',
      required: true,
    },
    newContent: {
      type: 'string',
      label: 'New Content',
      description: 'The new content for the message.',
      required: false,
    },
  },
};
