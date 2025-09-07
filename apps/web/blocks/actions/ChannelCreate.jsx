import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ChannelCreate = ({ config, onChange }) => {
  const { channels, roles, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    name: config.name || '',
    type: config.type || 'Text',
    topic: config.topic || '',
    category: config.category || '',
    nsfw: config.nsfw || false,
    slowmode: config.slowmode || 0,
    permissions: config.permissions || [],
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const channelTypes = [
    { value: 'Text', label: 'Text Channel', icon: '#' },
    { value: 'Voice', label: 'Voice Channel', icon: '🔊' },
    { value: 'Category', label: 'Category', icon: '📁' },
    { value: 'News', label: 'Announcement Channel', icon: '📢' },
    { value: 'Stage', label: 'Stage Channel', icon: '🎭' },
    { value: 'Forum', label: 'Forum Channel', icon: '💬' },
  ];

  const categories = channels.filter(c => c.type === 'Category');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-'))}
          placeholder="my-new-channel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Channel names are automatically converted to lowercase and spaces become dashes.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Type *
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {channelTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>

      {(formData.type === 'Text' || formData.type === 'News') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Channel Topic
          </label>
          <textarea
            value={formData.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            placeholder="Describe what this channel is for..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category (Optional)
        </label>
        <select
          value={formData.category}
          onChange={(e) => handleChange('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">No category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              📁 {category.name}
            </option>
          ))}
        </select>
      </div>

      {formData.type === 'Text' && (
        <>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.nsfw}
                onChange={(e) => handleChange('nsfw', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
              <span className="text-sm text-gray-700">Mark as NSFW</span>
            </label>
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
            <p className="text-xs text-gray-500 mt-1">
              0 = no slowmode. Maximum is 6 hours (21600 seconds).
            </p>
          </div>
        </>
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
              Your bot needs the "Manage Channels" permission to create new channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCreate;
