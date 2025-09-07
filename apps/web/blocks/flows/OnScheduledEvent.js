// Flow: On Scheduled Event
// Triggered at a specific time or interval

export default {
  id: 'onScheduledEvent',
  name: 'On Scheduled Event',
  description: 'Triggered at a specific time or interval.',
  category: 'Time',
  inputs: [],
  outputs: ['event'],
  config: {
    date: {
      type: 'date',
      label: 'Date',
      description: 'The date to trigger the event.',
      required: true,
    },
    time: {
      type: 'time',
      label: 'Time',
      description: 'The time to trigger the event.',
      required: true,
    },
    recurrence: {
      type: 'string',
      label: 'Recurrence',
      description: 'The recurrence pattern (e.g., daily, weekly).',
      required: false,
    },
  },
};
