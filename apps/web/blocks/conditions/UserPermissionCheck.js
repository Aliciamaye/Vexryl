// Condition: User Permission Check
// Checks if a user has specific permissions

export default {
  id: 'userPermissionCheck',
  name: 'User Permission Check',
  description: 'Checks if a user has specific permissions.',
  category: 'User',
  inputs: ['user'],
  outputs: ['true', 'false'],
  config: {
    user: {
      type: 'user',
      label: 'Target User',
      description: 'The user to check permissions for.',
      required: true,
    },
    permission: {
      type: 'select',
      label: 'Permission',
      description: 'The permission to check for.',
      options: ['Administrator', 'ManageGuild', 'ManageRoles', 'ManageChannels', 'KickMembers', 'BanMembers', 'ManageMessages', 'MentionEveryone', 'ViewAuditLog'],
      required: true,
    },
    channel: {
      type: 'channel',
      label: 'Channel Context',
      description: 'Check permissions in this specific channel (optional).',
      required: false,
    },
  },
};
