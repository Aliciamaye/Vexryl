import { useState, useEffect } from 'react';
import { useDiscordBot } from '../stores/DiscordBotStore';

export const useDiscordIntegration = () => {
  const { currentBot } = useDiscordBot();
  const [discordData, setDiscordData] = useState({
    channels: [],
    roles: [],
    users: [],
    emojis: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!currentBot?.token) {
      setDiscordData(prev => ({ ...prev, loading: false, error: 'No bot connected' }));
      return;
    }

    fetchDiscordData();
  }, [currentBot]);

  const fetchDiscordData = async () => {
    try {
      setDiscordData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch all Discord server data
      const [channelsRes, rolesRes, usersRes, emojisRes] = await Promise.all([
        fetch(`/api/discord/channels/${currentBot.serverId}`, {
          headers: { Authorization: `Bot ${currentBot.token}` }
        }),
        fetch(`/api/discord/roles/${currentBot.serverId}`, {
          headers: { Authorization: `Bot ${currentBot.token}` }
        }),
        fetch(`/api/discord/members/${currentBot.serverId}`, {
          headers: { Authorization: `Bot ${currentBot.token}` }
        }),
        fetch(`/api/discord/emojis/${currentBot.serverId}`, {
          headers: { Authorization: `Bot ${currentBot.token}` }
        }),
      ]);

      const channels = await channelsRes.json();
      const roles = await rolesRes.json();
      const users = await usersRes.json();
      const emojis = await emojisRes.json();

      // Format channels with types
      const formattedChannels = channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        type: getChannelTypeLabel(channel.type),
        category: channel.parent_id,
      }));

      // Format roles
      const formattedRoles = roles.map(role => ({
        id: role.id,
        name: role.name,
        color: `#${role.color.toString(16).padStart(6, '0')}`,
        position: role.position,
        permissions: role.permissions,
      }));

      // Format users
      const formattedUsers = users.map(member => ({
        id: member.user.id,
        username: member.user.username,
        displayName: member.nick || member.user.global_name || member.user.username,
        avatar: member.user.avatar,
        roles: member.roles,
        joinedAt: member.joined_at,
      }));

      // Format custom emojis
      const formattedEmojis = emojis.map(emoji => ({
        id: emoji.id,
        name: emoji.name,
        url: `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}`,
        formatted: `<${emoji.animated ? 'a' : ''}:${emoji.name}:${emoji.id}>`,
        animated: emoji.animated,
      }));

      setDiscordData({
        channels: formattedChannels,
        roles: formattedRoles,
        users: formattedUsers,
        emojis: formattedEmojis,
        loading: false,
        error: null,
      });

    } catch (error) {
      console.error('Failed to fetch Discord data:', error);
      setDiscordData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch server data',
      }));
    }
  };

  const getChannelTypeLabel = (type) => {
    const typeMap = {
      0: 'Text',
      2: 'Voice',
      4: 'Category',
      5: 'News',
      10: 'News Thread',
      11: 'Public Thread',
      12: 'Private Thread',
      13: 'Stage Voice',
      15: 'Forum',
    };
    return typeMap[type] || 'Unknown';
  };

  const refreshData = () => {
    fetchDiscordData();
  };

  return {
    ...discordData,
    refreshData,
  };
};
