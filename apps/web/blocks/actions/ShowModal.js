// Action: Create Modal
// Creates a modal dialog with input fields

export default {
  id: 'createModal',
  name: 'Create Modal',
  description: 'Creates a modal dialog with input fields.',
  category: 'Interaction',
  inputs: ['interaction'],
  outputs: ['modal'],
  config: {
    customId: {
      type: 'string',
      label: 'Custom ID',
      description: 'Unique identifier for the modal.',
      required: true,
    },
    title: {
      type: 'string',
      label: 'Modal Title',
      description: 'The title displayed on the modal.',
      required: true,
    },
    fields: {
      type: 'array',
      label: 'Input Fields',
      description: 'Text input fields for the modal (max 5).',
      required: true,
      maxItems: 5,
      items: {
        type: 'object',
        properties: {
          customId: { type: 'string', label: 'Field Variable Name', required: true },
          label: { type: 'string', label: 'Field Label', required: true },
          style: { type: 'select', options: ['Short', 'Paragraph'], required: true },
          placeholder: { type: 'string', label: 'Placeholder' },
          defaultValue: { type: 'string', label: 'Default Value' },
          required: { type: 'boolean', label: 'Required' },
          minLength: { type: 'integer', label: 'Min Length' },
          maxLength: { type: 'integer', label: 'Max Length' },
        }
      }
    },
  },
};
