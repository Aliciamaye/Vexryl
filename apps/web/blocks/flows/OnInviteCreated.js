// Flow: On Invite Created
// Triggered when an invite is created

export default {
  id: 'onInviteCreated',
  name: 'On Invite Created',
  description: 'Triggered when an invite is created.',
  category: 'Invite',
  inputs: [],
  outputs: ['invite'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for invites to this channel.',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the invite creation event.',
      required: false,
    },
  },
};
