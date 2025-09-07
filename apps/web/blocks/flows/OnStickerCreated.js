// Flow: On Sticker Created
// Triggered when a sticker is created

export default {
  id: 'onStickerCreated',
  name: 'On Sticker Created',
  description: 'Triggered when a sticker is created.',
  category: 'Sticker',
  inputs: [],
  outputs: ['sticker'],
  config: {
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the sticker creation event.',
      required: false,
    },
    announceChannel: {
      type: 'channel',
      label: 'Announce Channel',
      description: 'Channel to announce the new sticker.',
      required: false,
    },
  },
};
