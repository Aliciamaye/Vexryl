// Condition: Message Contains
// Checks if a message contains specific text

export default {
  id: 'messageContains',
  name: 'Message Contains',
  description: 'Checks if a message contains specific text.',
  category: 'Message',
  inputs: ['message'],
  outputs: ['true', 'false'],
  config: {
    text: {
      type: 'string',
      label: 'Text to Check',
      description: 'The text to search for in the message.',
      required: true,
    },
    caseSensitive: {
      type: 'boolean',
      label: 'Case Sensitive',
      description: 'Whether the search should be case sensitive.',
      required: false,
    },
  },
};
