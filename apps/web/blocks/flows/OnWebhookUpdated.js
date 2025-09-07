// Flow: On Webhook Updated
// Triggered when a webhook is updated

export default {
  id: 'onWebhookUpdated',
  name: 'On Webhook Updated',
  description: 'Triggered when a webhook is updated.',
  category: 'Webhook',
  inputs: [],
  outputs: ['webhook'],
  config: {
    channelFilter: {
      type: 'channel',
      label: 'Channel Filter',
      description: 'Only trigger for webhooks in this channel.',
      required: false,
    },
    logChannel: {
      type: 'channel',
      label: 'Log Channel',
      description: 'Channel to log the webhook update event.',
      required: false,
    },
  },
};
