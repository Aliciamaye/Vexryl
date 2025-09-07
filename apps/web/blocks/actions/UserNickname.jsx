import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserNickname = ({ config, onChange }) => {
  const { users, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    nickname: config.nickname || '',
    reason: config.reason || '',
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
          New Nickname
        </label>
        <input
          type="text"
          value={formData.nickname}
          onChange={(e) => handleChange('nickname', e.target.value)}
          placeholder="New nickname (leave empty to remove)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          maxLength={32}
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to remove the user's nickname and use their original username.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reason
        </label>
        <textarea
          value={formData.reason}
          onChange={(e) => handleChange('reason', e.target.value)}
          placeholder="Reason for changing the nickname..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
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
              This will change how the user's name appears in this server. Make sure you have the "Manage Nicknames" permission and your role is higher than theirs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNickname;
