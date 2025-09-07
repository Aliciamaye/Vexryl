// Condition: User Join Date
// Checks when a user joined the server

export default {
  id: 'userJoinDate',
  name: 'User Join Date',
  description: 'Checks when a user joined the server.',
  category: 'User',
  inputs: ['user'],
  outputs: ['true', 'false'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to check.',
      required: true,
    },
    operator: {
      type: 'select',
      label: 'Operator',
      description: 'The comparison operator.',
      options: ['Before', 'After', 'On', 'Within last'],
      required: true,
    },
    date: {
      type: 'date',
      label: 'Date',
      description: 'The date to compare against.',
      required: true,
    },
    timeUnit: {
      type: 'select',
      label: 'Time Unit',
      description: 'Time unit for "Within last" option.',
      options: ['Days', 'Weeks', 'Months', 'Years'],
      required: false,
    },
  },
};
