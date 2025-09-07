import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserBan = ({ config, onChange }) => {
  const { users, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    reason: config.reason || '',
    deleteMessageDays: config.deleteMessageDays || 0,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
          Ban Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Reason for banning this user..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delete Message Days (0-7)
        </label>
        <select
          value={formData.deleteMessageDays}
          onChange={(e) => handleChange('deleteMessageDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={0}>Don't delete any messages</option>
          <option value={1}>Delete messages from last 1 day</option>
          <option value={2}>Delete messages from last 2 days</option>
          <option value={3}>Delete messages from last 3 days</option>
          <option value={7}>Delete messages from last 7 days</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          This will delete the user's messages from the specified number of days.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              <strong>Warning:</strong> This action will permanently ban the user from the server. Make sure you have the "Ban Members" permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBan;
