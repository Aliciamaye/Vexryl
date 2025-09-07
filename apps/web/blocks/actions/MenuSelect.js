// Action: Add Select Menu
// Adds a select menu to a message

export default {
  id: 'addSelectMenu',
  name: 'Add Select Menu',
  description: 'Adds a select menu to a message.',
  category: 'Interaction',
  inputs: ['message'],
  outputs: ['message'],
  config: {
    customId: {
      type: 'string',
      label: 'Custom ID',
      description: 'Unique identifier for the select menu.',
      required: true,
    },
    placeholder: {
      type: 'string',
      label: 'Placeholder',
      description: 'Placeholder text when no option is selected.',
      required: false,
    },
    minValues: {
      type: 'integer',
      label: 'Minimum Values',
      description: 'Minimum number of options that must be selected.',
      required: false,
    },
    maxValues: {
      type: 'integer',
      label: 'Maximum Values',
      description: 'Maximum number of options that can be selected.',
      required: false,
    },
    options: {
      type: 'array',
      label: 'Options',
      description: 'Array of options for the select menu.',
      required: true,
    },
    disabled: {
      type: 'boolean',
      label: 'Disabled',
      description: 'Whether the select menu is disabled.',
      required: false,
    },
  },
};
