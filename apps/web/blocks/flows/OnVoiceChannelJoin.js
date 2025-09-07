// Flow: On Voice Channel Join
// Triggered when a user joins a voice channel

export default {
  id: 'onVoiceChannelJoin',
  name: 'On Voice Channel Join',
  description: 'Triggered when a user joins a voice channel.',
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
