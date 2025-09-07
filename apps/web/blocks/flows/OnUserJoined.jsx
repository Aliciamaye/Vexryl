import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const OnUserJoined = ({ config, onChange }) => {
  const { channels, roles, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    welcomeMessage: config.welcomeMessage || '',
    assignRole: config.assignRole || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedRole = roles.find(r => r.id === formData.assignRole);

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              This flow triggers whenever a new user joins your server. Perfect for welcome messages and auto-role assignment.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Welcome Message
        </label>
        <textarea
          value={formData.welcomeMessage}
          onChange={(e) => handleChange('welcomeMessage', e.target.value)}
          placeholder="Welcome to the server, {user.mention}! Please read #rules."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          Use variables like <code>{'{user.mention}'}</code>, <code>{'{user.name}'}</code>, <code>{'{server.name}'}</code>
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Auto-Assign Role
        </label>
        <select
          value={formData.assignRole}
          onChange={(e) => handleChange('assignRole', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Don't assign any role</option>
          {roles
            .filter(role => role.name !== '@everyone')
            .sort((a, b) => b.position - a.position)
            .map(role => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))
          }
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Automatically assign this role to new members.
        </p>
      </div>

      {selectedRole && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: selectedRole.color !== '#000000' ? selectedRole.color : '#99AAB5' }}
            ></div>
            <span className="text-sm font-medium">Auto-assigning: {selectedRole.name}</span>
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Variables</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><code className="bg-gray-200 px-1 rounded">user.mention</code> - @username mention</div>
          <div><code className="bg-gray-200 px-1 rounded">user.name</code> - Username without @</div>
          <div><code className="bg-gray-200 px-1 rounded">user.id</code> - User ID</div>
          <div><code className="bg-gray-200 px-1 rounded">server.name</code> - Server name</div>
          <div><code className="bg-gray-200 px-1 rounded">server.memberCount</code> - Total members</div>
        </div>
      </div>
    </div>
  );
};

export default OnUserJoined;
