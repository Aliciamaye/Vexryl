import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const VoiceMove = ({ config, onChange }) => {
  const { users, channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    targetChannel: config.targetChannel || '',
    reason: config.reason || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const voiceChannels = channels.filter(c => c.type === 'Voice' || c.type === 'Stage');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          User to Move *
        </label>
        <select
          value={formData.user}
          onChange={(e) => handleChange('user', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a user...</option>
          <option value="trigger_user">Trigger User</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName} (@{user.username})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Voice Channel *
        </label>
        <select
          value={formData.targetChannel}
          onChange={(e) => handleChange('targetChannel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a voice channel...</option>
          <option value="disconnect">Disconnect from voice</option>
          {voiceChannels.map(channel => (
            <option key={channel.id} value={channel.id}>
              🔊 {channel.name}
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
          placeholder="Reason for moving user..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
        />
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              The user must be connected to a voice channel to be moved. Requires "Move Members" permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceMove;
