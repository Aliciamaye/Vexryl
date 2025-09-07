// Flow: On Button Click
// Triggered when a button is clicked

export default {
  id: 'onButtonClick',
  name: 'On Button Click',
  description: 'Triggered when a button is clicked.',
  category: 'Interaction',
  inputs: [],
  outputs: ['interaction'],
  config: {
    buttonId: {
      type: 'string',
      label: 'Button ID',
      description: 'The custom ID of the button to listen for.',
      required: true,
    },
    messageId: {
      type: 'string',
      label: 'Message ID',
      description: 'Only trigger for buttons on this message.',
      required: false,
    },
  },
};
