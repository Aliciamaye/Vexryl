import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ThreadCreate = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    name: config.name || '',
    channel: config.channel || '',
    message: config.message || '',
    autoArchive: config.autoArchive || 1440, // 24 hours
    type: config.type || 'public', // 'public' or 'private'
    slowmode: config.slowmode || 0,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const textChannels = channels.filter(c => c.type === 'Text' || c.type === 'News');
  
  const autoArchiveOptions = [
    { value: 60, label: '1 hour' },
    { value: 1440, label: '24 hours' },
    { value: 4320, label: '3 days' },
    { value: 10080, label: '1 week' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Parent Channel *
        </label>
        <select
          value={formData.channel}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a channel...</option>
          {textChannels.map(channel => (
            <option key={channel.id} value={channel.id}>
              #{channel.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thread Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Discussion about..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thread Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="public">🌐 Public Thread</option>
          <option value="private">🔒 Private Thread</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Private threads require the "Manage Threads" permission and server boosts.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Initial Message
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Start the discussion with a message..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auto Archive After
        </label>
        <select
          value={formData.autoArchive}
          onChange={(e) => handleChange('autoArchive', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {autoArchiveOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Slowmode (seconds)
        </label>
        <input
          type="number"
          value={formData.slowmode}
          onChange={(e) => handleChange('slowmode', parseInt(e.target.value) || 0)}
          min="0"
          max="21600"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Requires "Create Public Threads" permission. Private threads need "Manage Threads".
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadCreate;
