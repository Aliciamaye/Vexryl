// Action: Voice Move
// Moves a user to a different voice channel

export default {
  id: 'voiceMove',
  name: 'Voice Move',
  description: 'Moves a user to a different voice channel.',
  category: 'Voice',
  inputs: ['user'],
  outputs: ['result'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to move.',
      required: true,
    },
    targetChannel: {
      type: 'channel',
      label: 'Target Voice Channel',
      description: 'The voice channel to move the user to.',
      required: true,
    },
    reason: {
      type: 'string',
      label: 'Reason',
      description: 'Reason for moving the user.',
      required: false,
    },
  },
};
