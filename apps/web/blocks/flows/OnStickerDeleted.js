// Flow: On Sticker Deleted
// Triggered when a sticker is deleted

export default {
  id: 'onStickerDeleted',
  name: 'On Sticker Deleted',
  description: 'Triggered when a sticker is deleted.',
  category: 'Sticker',
  inputs: [],
  outputs: ['sticker'],
  config: {
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the sticker deletion event.',
      required: false,
    },
  },
};
