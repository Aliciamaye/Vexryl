import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ChannelNameContains = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    channel: config.channel || '',
    text: config.text || '',
    caseSensitive: config.caseSensitive || false,
    checkType: config.checkType || 'contains', // 'contains', 'startsWith', 'endsWith', 'equals', 'notContains'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const checkTypeOptions = [
    { value: 'contains', label: 'Contains text' },
    { value: 'startsWith', label: 'Starts with text' },
    { value: 'endsWith', label: 'Ends with text' },
    { value: 'equals', label: 'Equals text exactly' },
    { value: 'notContains', label: 'Does not contain text' },
  ];

  const selectedChannel = channels.find(c => c.id === formData.channel);

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
          Check Type *
        </label>
        <select
          value={formData.checkType}
          onChange={(e) => handleChange('checkType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {checkTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Text to Check *
        </label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter the text to check for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.caseSensitive}
            onChange={(e) => handleChange('caseSensitive', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Case sensitive</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, "General" and "general" will be treated as different text.
        </p>
      </div>

      {selectedChannel && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {selectedChannel.type === 'Voice' ? '🔊' : 
               selectedChannel.type === 'Category' ? '📁' : '#'}
            </span>
            <span className="text-sm text-blue-700">
              Selected: {selectedChannel.name}
            </span>
          </div>
        </div>
      )}

      {formData.text && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
          <div className="text-sm text-gray-700">
            This condition will check if the channel name{' '}
            <strong>{checkTypeOptions.find(c => c.value === formData.checkType)?.label.toLowerCase()}</strong>{' '}
            "<em>{formData.text}</em>"
            {formData.caseSensitive && (
              <span className="text-orange-600"> (case sensitive)</span>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <h5 className="font-medium text-green-800 mb-1">Example Use Cases</h5>
          <ul className="text-xs text-green-700 space-y-1">
            <li>• Contains "bot" - for bot channels</li>
            <li>• Starts with "mod" - for moderation channels</li>
            <li>• Ends with "logs" - for logging channels</li>
          </ul>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
          <h5 className="font-medium text-orange-800 mb-1">Tips</h5>
          <ul className="text-xs text-orange-700 space-y-1">
            <li>• Use lowercase for better matching</li>
            <li>• Consider word boundaries</li>
            <li>• Test with existing channel names</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ChannelNameContains;
