// Flow: On Invite Deleted
// Triggered when an invite is deleted

export default {
  id: 'onInviteDeleted',
  name: 'On Invite Deleted',
  description: 'Triggered when an invite is deleted.',
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
      description: 'Channel to log the invite deletion event.',
      required: false,
    },
  },
};
