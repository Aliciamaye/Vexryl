// Condition: Message Has Attachment
// Checks if a message has attachments

export default {
  id: 'messageHasAttachment',
  name: 'Message Has Attachment',
  description: 'Checks if a message has attachments.',
  category: 'Message',
  inputs: ['message'],
  outputs: ['true', 'false'],
  config: {
    attachmentType: {
      type: 'select',
      label: 'Attachment Type',
      description: 'The type of attachment to check for.',
      options: ['Any', 'Image', 'Video', 'Audio', 'Document'],
      required: false,
    },
    minCount: {
      type: 'integer',
      label: 'Minimum Count',
      description: 'Minimum number of attachments required.',
      required: false,
      min: 1,
    },
  },
};
