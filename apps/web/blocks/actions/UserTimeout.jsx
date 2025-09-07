import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserTimeout = ({ config, onChange }) => {
  const { users, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    duration: config.duration || '5 minutes',
    reason: config.reason || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const durationOptions = [
    { value: '60 seconds', label: '60 seconds' },
    { value: '5 minutes', label: '5 minutes' },
    { value: '10 minutes', label: '10 minutes' },
    { value: '1 hour', label: '1 hour' },
    { value: '1 day', label: '1 day' },
    { value: '1 week', label: '1 week' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target User *
        </label>
        <select
          value={formData.user}
          onChange={(e) => handleChange('user', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a user...</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName} (@{user.username})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout Duration *
        </label>
        <select
          value={formData.duration}
          onChange={(e) => handleChange('duration', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {durationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          The user will be unable to send messages, react, or join voice channels during the timeout.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Timeout Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Reason for timing out this user..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
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
              This will temporarily restrict the user's ability to interact in the server. Make sure you have the "Moderate Members" permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTimeout;
