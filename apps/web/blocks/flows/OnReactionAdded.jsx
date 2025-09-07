import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const OnReactionAdded = ({ config, onChange }) => {
  const { channels, customEmojis, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    channels: config.channels || [],
    emojis: config.emojis || [],
    emojiType: config.emojiType || 'any', // 'any', 'unicode', 'custom', 'specific'
    ignoreBots: config.ignoreBots !== undefined ? config.ignoreBots : true,
    requireMessageAge: config.requireMessageAge || false,
    maxMessageAge: config.maxMessageAge || 24, // hours
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChannelToggle = (channelId) => {
    const currentChannels = formData.channels;
    if (currentChannels.includes(channelId)) {
      handleChange('channels', currentChannels.filter(id => id !== channelId));
    } else {
      handleChange('channels', [...currentChannels, channelId]);
    }
  };

  const handleEmojiToggle = (emoji) => {
    const currentEmojis = formData.emojis;
    if (currentEmojis.includes(emoji)) {
      handleChange('emojis', currentEmojis.filter(e => e !== emoji));
    } else {
      handleChange('emojis', [...currentEmojis, emoji]);
    }
  };

  const textChannels = channels.filter(c => c.type === 'Text' || c.type === 'News');
  const unicodeEmojis = ['👍', '👎', '❤️', '😍', '😂', '😮', '😢', '😡', '🎉', '🎊', '✅', '❌', '⭐', '🔥'];

  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium text-yellow-900">Reaction Added Trigger</h3>
            <p className="text-sm text-yellow-700">Triggers when a reaction is added to a message</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emoji Filter
        </label>
        <select
          value={formData.emojiType}
          onChange={(e) => handleChange('emojiType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        >
          <option value="any">Any emoji</option>
          <option value="unicode">Unicode emojis only</option>
          <option value="custom">Custom server emojis only</option>
          <option value="specific">Specific emojis</option>
        </select>
      </div>

      {formData.emojiType === 'specific' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Specific Emojis
          </label>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-600 mb-2">Unicode Emojis</h4>
              <div className="grid grid-cols-8 gap-2 p-3 border border-gray-300 rounded-md bg-gray-50">
                {unicodeEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => handleEmojiToggle(emoji)}
                    className={`p-2 text-xl hover:bg-yellow-100 rounded transition-colors ${
                      formData.emojis.includes(emoji) ? 'bg-yellow-200 ring-2 ring-yellow-500' : ''
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {customEmojis.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Custom Server Emojis</h4>
                <div className="max-h-32 overflow-y-auto space-y-2 p-2 border border-gray-200 rounded">
                  {customEmojis.map(emoji => (
                    <label key={emoji.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.emojis.includes(`${emoji.name}:${emoji.id}`)}
                        onChange={() => handleEmojiToggle(`${emoji.name}:${emoji.id}`)}
                        className="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700">:{emoji.name}:</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Restrictions (Optional)
        </label>
        <div className="max-h-32 overflow-y-auto space-y-2 p-2 border border-gray-200 rounded">
          {textChannels.length === 0 ? (
            <p className="text-sm text-gray-500">No text channels available</p>
          ) : (
            textChannels.map(channel => (
              <label key={channel.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.channels.includes(channel.id)}
                  onChange={() => handleChannelToggle(channel.id)}
                  className="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
                />
                <span className="text-sm text-gray-700">#{channel.name}</span>
              </label>
            ))
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to monitor all channels, or select specific channels.
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={formData.requireMessageAge}
            onChange={(e) => handleChange('requireMessageAge', e.target.checked)}
            className="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
          <span className="text-sm font-medium text-gray-700">Only recent messages</span>
        </label>

        {formData.requireMessageAge && (
          <div className="ml-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum message age (hours)
            </label>
            <input
              type="number"
              value={formData.maxMessageAge}
              onChange={(e) => handleChange('maxMessageAge', parseInt(e.target.value) || 24)}
              min="1"
              max="168"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
        )}
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.ignoreBots}
            onChange={(e) => handleChange('ignoreBots', e.target.checked)}
            className="rounded border-gray-300 text-yellow-600 shadow-sm focus:border-yellow-300 focus:ring focus:ring-yellow-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Ignore bot reactions</span>
        </label>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Available Variables</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><code className="bg-white px-2 py-1 rounded">reaction.emoji</code> - The emoji that was added</div>
          <div><code className="bg-white px-2 py-1 rounded">reaction.user</code> - User who added the reaction</div>
          <div><code className="bg-white px-2 py-1 rounded">reaction.message</code> - Message that was reacted to</div>
          <div><code className="bg-white px-2 py-1 rounded">reaction.count</code> - Total count of this reaction</div>
        </div>
      </div>
    </div>
  );
};

export default OnReactionAdded;
