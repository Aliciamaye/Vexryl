import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserPermissionCheck = ({ config, onChange }) => {
  const { users, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    permission: config.permission || '',
    checkType: config.checkType || 'has', // 'has' or 'doesNotHave'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const permissions = [
    { value: 'ADMINISTRATOR', label: 'Administrator' },
    { value: 'MANAGE_GUILD', label: 'Manage Server' },
    { value: 'MANAGE_ROLES', label: 'Manage Roles' },
    { value: 'MANAGE_CHANNELS', label: 'Manage Channels' },
    { value: 'KICK_MEMBERS', label: 'Kick Members' },
    { value: 'BAN_MEMBERS', label: 'Ban Members' },
    { value: 'MODERATE_MEMBERS', label: 'Timeout Members' },
    { value: 'MANAGE_MESSAGES', label: 'Manage Messages' },
    { value: 'MENTION_EVERYONE', label: 'Mention Everyone' },
    { value: 'VIEW_CHANNEL', label: 'View Channel' },
    { value: 'SEND_MESSAGES', label: 'Send Messages' },
    { value: 'ATTACH_FILES', label: 'Attach Files' },
    { value: 'ADD_REACTIONS', label: 'Add Reactions' },
    { value: 'USE_EXTERNAL_EMOJIS', label: 'Use External Emojis' },
    { value: 'CONNECT', label: 'Connect to Voice' },
    { value: 'SPEAK', label: 'Speak in Voice' },
    { value: 'MUTE_MEMBERS', label: 'Mute Members' },
    { value: 'DEAFEN_MEMBERS', label: 'Deafen Members' },
    { value: 'MOVE_MEMBERS', label: 'Move Members' },
  ];

  const selectedUser = users.find(u => u.id === formData.user);
  const selectedPermission = permissions.find(p => p.value === formData.permission);

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
          <option value="has">User has permission</option>
          <option value="doesNotHave">User does not have permission</option>
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
              {user.displayName} (@{user.username})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Permission to Check *
        </label>
        <select
          value={formData.permission}
          onChange={(e) => handleChange('permission', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select a permission...</option>
          {permissions.map(permission => (
            <option key={permission.value} value={permission.value}>
              {permission.label}
            </option>
          ))}
        </select>
      </div>

      {selectedPermission && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">
              Checking for: {selectedPermission.label}
            </span>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <img 
              src={selectedUser.avatar || '/default-avatar.png'} 
              alt={selectedUser.displayName}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-blue-700">
              Checking user: {selectedUser.displayName}
            </span>
          </div>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              This checks permissions in the current channel. Users with Administrator permission automatically have all permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionCheck;
