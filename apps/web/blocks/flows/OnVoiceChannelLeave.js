// Flow: On Voice Channel Leave
// Triggered when a user leaves a voice channel

export default {
  id: 'onVoiceChannelLeave',
  name: 'On Voice Channel Leave',
  description: 'Triggered when a user leaves a voice channel.',
  category: 'Voice',
  inputs: [],
  outputs: ['user'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for this voice channel.',
      required: false,
    },
    userFilter: {
      type: 'user',
      label: 'User Filter',
      description: 'Only trigger for this user.',
      required: false,
    },
  },
};
