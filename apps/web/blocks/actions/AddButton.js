// Action: Add Button
// Adds a button to a message

export default {
  id: 'addButton',
  name: 'Add Button',
  description: 'Adds a button to a message.',
  category: 'Interaction',
  inputs: ['message'],
  outputs: ['message'],
  config: {
    label: {
      type: 'string',
      label: 'Button Label',
      description: 'The text displayed on the button.',
      required: true,
    },
    customId: {
      type: 'string',
      label: 'Custom ID',
      description: 'Unique identifier for the button.',
      required: true,
    },
    style: {
      type: 'select',
      label: 'Button Style',
      description: 'The style of the button.',
      options: ['Primary', 'Secondary', 'Success', 'Danger', 'Link'],
      required: true,
    },
    emoji: {
      type: 'string',
      label: 'Emoji',
      description: 'Emoji to display on the button.',
      required: false,
    },
    url: {
      type: 'string',
      label: 'URL',
      description: 'URL for link-style buttons.',
      required: false,
    },
    disabled: {
      type: 'boolean',
      label: 'Disabled',
      description: 'Whether the button is disabled.',
      required: false,
    },
  },
};
