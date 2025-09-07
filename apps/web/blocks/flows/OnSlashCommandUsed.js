// Flow: On Slash Command Used
// Triggered when a specific slash command is used

export default {
  id: 'onSlashCommandUsed',
  name: 'On Slash Command Used',
  description: 'Triggered when a specific slash command is used.',
  category: 'Command',
  inputs: [],
  outputs: ['command'],
  config: {
    commandName: {
      type: 'string',
      label: 'Command Name',
      description: 'The name of the slash command to trigger this flow.',
      required: true,
    },
    parameters: {
      type: 'object',
      label: 'Parameters',
      description: 'Parameters to match for the command.',
      required: false,
    },
  },
};
