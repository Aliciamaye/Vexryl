// Flow: On Select Menu Used
// Triggered when a select menu option is chosen

export default {
  id: 'onSelectMenuUsed',
  name: 'On Select Menu Used',
  description: 'Triggered when a select menu option is chosen.',
  category: 'Interaction',
  inputs: [],
  outputs: ['interaction'],
  config: {
    selectMenuId: {
      type: 'string',
      label: 'Select Menu ID',
      description: 'The custom ID of the select menu to listen for.',
      required: true,
    },
    selectedValue: {
      type: 'string',
      label: 'Selected Value',
      description: 'Only trigger for this specific selected value.',
      required: false,
    },
  },
};
