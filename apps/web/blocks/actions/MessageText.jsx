import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const MessageText = ({ config, onChange }) => {
  const { channels, emojis, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    content: config.content || '',
    channel: config.channel || '',
    ephemeral: config.ephemeral || false,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const insertEmoji = (emoji) => {
    const newContent = formData.content + emoji.formatted;
    handleChange('content', newContent);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Channel *
        </label>
        <select
          value={formData.channel}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a channel...</option>
          {channels.map(channel => (
            <option key={channel.id} value={channel.id}>
              #{channel.name} ({channel.type})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Content
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter your message content..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Custom Emojis
        </label>
        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto bg-gray-50 p-2 rounded-md">
          {emojis.map(emoji => (
            <button
              key={emoji.id}
              onClick={() => insertEmoji(emoji)}
              className="text-lg hover:bg-gray-200 p-1 rounded"
              title={emoji.name}
            >
              <img src={emoji.url} alt={emoji.name} className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.ephemeral}
            onChange={(e) => handleChange('ephemeral', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Ephemeral (only visible to user)</span>
        </label>
      </div>
    </div>
  );
};

export default MessageText;
