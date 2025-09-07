import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ReactionRemove = ({ config, onChange }) => {
  const { channels, customEmojis, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    messageId: config.messageId || '',
    channel: config.channel || '',
    emoji: config.emoji || '',
    emojiType: config.emojiType || 'unicode', // 'unicode' or 'custom'
    removeType: config.removeType || 'all', // 'all', 'user', 'bot'
    targetUser: config.targetUser || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const unicodeEmojis = [
    '👍', '👎', '❤️', '😍', '😂', '😮', '😢', '😡',
    '🎉', '🎊', '✅', '❌', '⭐', '🔥', '💯', '👀'
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel *
        </label>
        <select
          value={formData.channel}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a channel...</option>
          {channels
            .filter(channel => channel.type === 'Text' || channel.type === 'News')
            .map(channel => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))
          }
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message ID *
        </label>
        <input
          type="text"
          value={formData.messageId}
          onChange={(e) => handleChange('messageId', e.target.value)}
          placeholder="123456789012345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Remove Type *
        </label>
        <select
          value={formData.removeType}
          onChange={(e) => handleChange('removeType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Remove all reactions of this emoji</option>
          <option value="user">Remove from specific user</option>
          <option value="bot">Remove only bot reactions</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emoji Type *
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="emojiType"
              value="unicode"
              checked={formData.emojiType === 'unicode'}
              onChange={(e) => handleChange('emojiType', e.target.value)}
              className="mr-2"
            />
            Unicode Emoji
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="emojiType"
              value="custom"
              checked={formData.emojiType === 'custom'}
              onChange={(e) => handleChange('emojiType', e.target.value)}
              className="mr-2"
            />
            Custom Emoji
          </label>
        </div>
      </div>

      {formData.emojiType === 'unicode' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Emoji *
          </label>
          <div className="grid grid-cols-8 gap-2 p-3 border border-gray-300 rounded-md bg-gray-50 max-h-32 overflow-y-auto">
            {unicodeEmojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => handleChange('emoji', emoji)}
                className={`p-2 text-xl hover:bg-red-100 rounded transition-colors ${
                  formData.emoji === emoji ? 'bg-red-200 ring-2 ring-red-500' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {formData.emojiType === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Emoji *
          </label>
          <select
            value={formData.emoji}
            onChange={(e) => handleChange('emoji', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          >
            <option value="">Select a custom emoji...</option>
            {customEmojis.map(emoji => (
              <option key={emoji.id} value={`${emoji.name}:${emoji.id}`}>
                :{emoji.name}:
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Your bot needs the "Manage Messages" permission to remove reactions from other users.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionRemove;
