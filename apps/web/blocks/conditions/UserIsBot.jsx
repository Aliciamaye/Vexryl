import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserIsBot = ({ config, onChange }) => {
  const { users, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    checkType: config.checkType || 'is', // 'is' or 'isNot'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedUser = users.find(u => u.id === formData.user);

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
          <option value="is">User is a bot</option>
          <option value="isNot">User is not a bot</option>
        </select>
      </div>

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
          <option value="trigger_user">Trigger User (User who triggered the event)</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.displayName} (@{user.username}) {user.bot ? '🤖' : ''}
            </option>
          ))}
        </select>
      </div>

      {selectedUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <img 
              src={selectedUser.avatar || '/default-avatar.png'} 
              alt={selectedUser.displayName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-blue-700">
              Checking user: {selectedUser.displayName} {selectedUser.bot ? '🤖' : '👤'}
            </span>
            {selectedUser.bot && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Bot
              </span>
            )}
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Condition Result</h4>
        <div className="text-sm text-gray-700">
          This condition will return <strong>True</strong> if the selected user{' '}
          <strong>{formData.checkType === 'is' ? 'is' : 'is not'}</strong> a bot account.
        </div>
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
              Use this condition to filter out bot messages or to create bot-specific workflows. Bot accounts are marked with a 🤖 icon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIsBot;
