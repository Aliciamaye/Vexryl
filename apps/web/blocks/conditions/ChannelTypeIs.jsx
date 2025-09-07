import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ChannelTypeIs = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    channel: config.channel || '',
    channelType: config.channelType || '',
    checkType: config.checkType || 'is', // 'is' or 'isNot'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const channelTypes = [
    { value: 'Text', label: 'Text Channel' },
    { value: 'Voice', label: 'Voice Channel' },
    { value: 'Category', label: 'Category' },
    { value: 'News', label: 'Announcement Channel' },
    { value: 'Stage', label: 'Stage Channel' },
    { value: 'Forum', label: 'Forum Channel' },
    { value: 'Thread', label: 'Thread' },
  ];

  const selectedChannel = channels.find(c => c.id === formData.channel);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Check Type *
        </label>
        <select
          value={formData.checkType}
          onChange={(e) => handleChange('checkType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="is">Channel type is</option>
          <option value="isNot">Channel type is not</option>
        </select>
      </div>

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
          <option value="trigger_channel">Trigger Channel (Channel where event occurred)</option>
          {channels.map(channel => (
            <option key={channel.id} value={channel.id}>
              {channel.type === 'Voice' ? '🔊' : channel.type === 'Category' ? '📁' : '#'} {channel.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expected Channel Type *
        </label>
        <select
          value={formData.channelType}
          onChange={(e) => handleChange('channelType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a channel type...</option>
          {channelTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {selectedChannel && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {selectedChannel.type === 'Voice' ? '🔊' : 
               selectedChannel.type === 'Category' ? '📁' : 
               selectedChannel.type === 'News' ? '📢' : 
               selectedChannel.type === 'Stage' ? '🎭' : 
               selectedChannel.type === 'Forum' ? '💬' : '#'}
            </span>
            <span className="text-sm text-blue-700">
              Current: {selectedChannel.name} ({selectedChannel.type})
            </span>
          </div>
        </div>
      )}

      {formData.channelType && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h4 className="font-medium text-gray-900 mb-2">Condition Result</h4>
          <div className="text-sm text-gray-700">
            This condition will return <strong>True</strong> if the selected channel's type{' '}
            <strong>{formData.checkType === 'is' ? 'is' : 'is not'}</strong>{' '}
            <strong>{channelTypes.find(t => t.value === formData.channelType)?.label}</strong>.
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Use this condition to create workflows that only trigger in specific types of channels, like text-only or voice-only actions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelTypeIs;
