import React, { useState, useEffect } from 'react';

const VariableGet = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    variableName: config.variableName || '',
    defaultValue: config.defaultValue || '',
    scope: config.scope || 'global',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const scopeOptions = [
    { value: 'global', label: 'Global', description: 'Available across all servers' },
    { value: 'server', label: 'Server', description: 'Specific to this server' },
    { value: 'user', label: 'User', description: 'Specific to the user' },
    { value: 'channel', label: 'Channel', description: 'Specific to the channel' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h3 className="font-medium text-purple-900">Get Variable</h3>
            <p className="text-sm text-purple-700">Retrieve a stored variable value</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variable Name *
        </label>
        <input
          type="text"
          value={formData.variableName}
          onChange={(e) => handleChange('variableName', e.target.value)}
          placeholder="myVariable"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Use alphanumeric characters and underscores only.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Variable Scope *
        </label>
        <select
          value={formData.scope}
          onChange={(e) => handleChange('scope', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {scopeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Value
        </label>
        <input
          type="text"
          value={formData.defaultValue}
          onChange={(e) => handleChange('defaultValue', e.target.value)}
          placeholder="Value to use if variable doesn't exist"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Optional. Leave empty to return null if variable doesn't exist.
        </p>
      </div>

      {formData.variableName && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h4 className="font-medium text-gray-900 mb-2">Variable Reference</h4>
          <code className="text-sm bg-white px-2 py-1 rounded border">
            {`{variable:${formData.scope}:${formData.variableName}${formData.defaultValue ? `:${formData.defaultValue}` : ''}}`}
          </code>
          <p className="text-xs text-gray-600 mt-2">
            This reference can be used in other blocks to access the variable value.
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              Variables are persistent and will remember their values between bot restarts and workflow runs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableGet;
