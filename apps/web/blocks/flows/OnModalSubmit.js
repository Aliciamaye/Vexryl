// Flow: On Modal Submit
// Triggered when a modal is submitted

export default {
  id: 'onModalSubmit',
  name: 'On Modal Submit',
  description: 'Triggered when a modal is submitted.',
  category: 'Interaction',
  inputs: [],
  outputs: ['interaction'],
  config: {
    modalId: {
      type: 'string',
      label: 'Modal ID',
      description: 'The custom ID of the modal to listen for.',
      required: true,
    },
    fieldFilters: {
      type: 'object',
      label: 'Field Filters',
      description: 'Filters for specific field values.',
      required: false,
    },
  },
};
