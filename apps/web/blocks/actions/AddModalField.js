// Action: Add Modal Field
// Adds a text input field to a modal (max 5 fields per modal)

export default {
  id: 'addModalField',
  name: 'Add Modal Field',
  description: 'Adds a text input field to a modal (max 5 fields per modal).',
  category: 'Interaction',
  inputs: ['modal'],
  outputs: ['modal'],
  config: {
    customId: {
      type: 'string',
      label: 'Field ID',
      description: 'Unique identifier for this field (variable name).',
      required: true,
    },
    label: {
      type: 'string',
      label: 'Field Label',
      description: 'The label displayed above the input field.',
      required: true,
    },
    style: {
      type: 'select',
      label: 'Input Style',
      description: 'The style of the input field.',
      options: ['Short', 'Paragraph'],
      required: true,
    },
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      description: 'Placeholder text shown in the input field.',
      required: false,
    },
    defaultValue: {
      type: 'string',
      label: 'Default Value',
      description: 'Pre-filled value for the input field.',
      required: false,
    },
    required: {
      type: 'boolean',
      label: 'Required',
      description: 'Whether this field is required to submit the modal.',
      required: false,
    },
    minLength: {
      type: 'integer',
      label: 'Minimum Length',
      description: 'Minimum number of characters required.',
      required: false,
    },
    maxLength: {
      type: 'integer',
      label: 'Maximum Length',
      description: 'Maximum number of characters allowed.',
      required: false,
    },
  },
};
