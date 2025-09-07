// Condition: Message Length Check
// Checks the length of a message

export default {
  id: 'messageLengthCheck',
  name: 'Message Length Check',
  description: 'Checks the length of a message.',
  category: 'Message',
  inputs: ['message'],
  outputs: ['true', 'false'],
  config: {
    operator: {
      type: 'select',
      label: 'Operator',
      description: 'The comparison operator.',
      options: ['Greater than', 'Less than', 'Equal to', 'Greater than or equal', 'Less than or equal'],
      required: true,
    },
    length: {
      type: 'integer',
      label: 'Length',
      description: 'The length to compare against.',
      required: true,
      min: 0,
    },
  },
};
