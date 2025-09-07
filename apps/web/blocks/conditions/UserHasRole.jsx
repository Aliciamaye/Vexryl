import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const UserHasRole = ({ config, onChange }) => {
  const { users, roles, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    user: config.user || '',
    role: config.role || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedRole = roles.find(r => r.id === formData.role);

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
          Required Role *
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a role...</option>
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
      </div>

      {selectedRole && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: selectedRole.color !== '#000000' ? selectedRole.color : '#99AAB5' }}
            ></div>
            <span className="text-sm font-medium">{selectedRole.name}</span>
          </div>
        </div>
      )}

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              This condition will check if the user has the specified role and continue with the "True" path if they do, or "False" path if they don't.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHasRole;
