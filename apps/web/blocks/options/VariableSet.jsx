import React, { useState, useEffect } from 'react';

const VariableSet = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    variableName: config.variableName || '',
    value: config.value || '',
    scope: config.scope || 'global',
    operation: config.operation || 'set',
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

  const operationOptions = [
    { value: 'set', label: 'Set', description: 'Replace the variable value' },
    { value: 'add', label: 'Add', description: 'Add to the current value (numbers)' },
    { value: 'subtract', label: 'Subtract', description: 'Subtract from current value (numbers)' },
    { value: 'multiply', label: 'Multiply', description: 'Multiply the current value (numbers)' },
    { value: 'divide', label: 'Divide', description: 'Divide the current value (numbers)' },
    { value: 'append', label: 'Append', description: 'Add to the end of the value (text)' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div>
            <h3 className="font-medium text-green-900">Set Variable</h3>
            <p className="text-sm text-green-700">Store a value in a variable</p>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
          Operation *
        </label>
        <select
          value={formData.operation}
          onChange={(e) => handleChange('operation', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {operationOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label} - {option.description}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value *
        </label>
        <textarea
          value={formData.value}
          onChange={(e) => handleChange('value', e.target.value)}
          placeholder="Value to store..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />
        <p className="text-xs text-gray-500 mt-1">
          You can use variables, user mentions, and other dynamic values here.
        </p>
      </div>

      {formData.variableName && formData.value && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h4 className="font-medium text-gray-900 mb-2">Operation Preview</h4>
          <div className="text-sm text-gray-700">
            This will <strong>{operationOptions.find(op => op.value === formData.operation)?.label.toLowerCase()}</strong>{' '}
            the {formData.scope} variable "<strong>{formData.variableName}</strong>"{' '}
            {formData.operation === 'set' ? 'to' : 'with'} the value: "<em>{formData.value}</em>"
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <h5 className="font-medium text-yellow-800 mb-1">Number Operations</h5>
          <p className="text-xs text-yellow-700">
            Add, subtract, multiply, and divide work with numbers only.
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h5 className="font-medium text-blue-800 mb-1">Text Operations</h5>
          <p className="text-xs text-blue-700">
            Set and append work with any text or value type.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VariableSet;
