import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ChannelDelete = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    channel: config.channel || '',
    reason: config.reason || '',
    confirmDelete: config.confirmDelete || false,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedChannel = channels.find(c => c.id === formData.channel);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel to Delete *
        </label>
        <select
          value={formData.channel}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          disabled={loading}
        >
          <option value="">Select a channel...</option>
          {channels.map(channel => (
            <option key={channel.id} value={channel.id}>
              {channel.type === 'Voice' ? '🔊' : channel.type === 'Category' ? '📁' : '#'} {channel.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Reason for deleting this channel..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          rows={2}
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.confirmDelete}
            onChange={(e) => handleChange('confirmDelete', e.target.checked)}
            className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">I understand this action cannot be undone</span>
        </label>
      </div>

      {selectedChannel && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg">
              {selectedChannel.type === 'Voice' ? '🔊' : 
               selectedChannel.type === 'Category' ? '📁' : '#'}
            </span>
            <span className="text-sm font-medium">
              Will delete: {selectedChannel.name}
            </span>
          </div>
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
              <strong>Warning:</strong> Deleting a channel permanently removes all messages and cannot be undone. Requires "Manage Channels" permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelDelete;
