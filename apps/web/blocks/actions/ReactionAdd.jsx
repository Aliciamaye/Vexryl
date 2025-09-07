import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ReactionAdd = ({ config, onChange }) => {
  const { channels, customEmojis, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    messageId: config.messageId || '',
    channel: config.channel || '',
    emoji: config.emoji || '',
    emojiType: config.emojiType || 'unicode', // 'unicode' or 'custom'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const unicodeEmojis = [
    '👍', '👎', '❤️', '😍', '😂', '😮', '😢', '😡',
    '🎉', '🎊', '✅', '❌', '⭐', '🔥', '💯', '👀',
    '🤔', '🙄', '😎', '🤝', '👏', '🚀', '💡', '⚡'
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
        <p className="text-xs text-gray-500 mt-1">
          Right-click on a message and select "Copy ID" to get the message ID.
        </p>
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
                className={`p-2 text-xl hover:bg-blue-100 rounded transition-colors ${
                  formData.emoji === emoji ? 'bg-blue-200 ring-2 ring-blue-500' : ''
                }`}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <input
              type="text"
              value={formData.emoji}
              onChange={(e) => handleChange('emoji', e.target.value)}
              placeholder="Or type a custom unicode emoji..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
          {customEmojis.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">
              No custom emojis found in this server.
            </p>
          )}
        </div>
      )}

      {formData.emoji && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{formData.emojiType === 'unicode' ? formData.emoji : '🎨'}</span>
            <span className="text-sm text-green-700">
              Selected emoji: {formData.emojiType === 'unicode' ? formData.emoji : `:${formData.emoji.split(':')[0]}:`}
            </span>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Your bot needs the "Add Reactions" permission. For custom emojis, the bot must be in the server where the emoji is from.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReactionAdd;
