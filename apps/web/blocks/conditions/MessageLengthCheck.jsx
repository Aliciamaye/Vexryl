import React, { useState, useEffect } from 'react';

const MessageLengthCheck = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    length: config.length || 0,
    operator: config.operator || 'greaterThan', // 'greaterThan', 'lessThan', 'equalTo', 'greaterThanOrEqualTo', 'lessThanOrEqualTo'
    countType: config.countType || 'characters', // 'characters', 'words'
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const operators = [
    { value: 'greaterThan', label: 'Greater than', symbol: '>' },
    { value: 'lessThan', label: 'Less than', symbol: '<' },
    { value: 'equalTo', label: 'Equal to', symbol: '=' },
    { value: 'greaterThanOrEqualTo', label: 'Greater than or equal to', symbol: '≥' },
    { value: 'lessThanOrEqualTo', label: 'Less than or equal to', symbol: '≤' },
  ];

  const countTypes = [
    { value: 'characters', label: 'Characters' },
    { value: 'words', label: 'Words' },
  ];

  const selectedOperator = operators.find(op => op.value === formData.operator);
  const selectedCountType = countTypes.find(ct => ct.value === formData.countType);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Count Type *
        </label>
        <select
          value={formData.countType}
          onChange={(e) => handleChange('countType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {countTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Comparison Operator *
        </label>
        <select
          value={formData.operator}
          onChange={(e) => handleChange('operator', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {operators.map(operator => (
            <option key={operator.value} value={operator.value}>
              {operator.label} ({operator.symbol})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Length *
        </label>
        <input
          type="number"
          value={formData.length}
          onChange={(e) => handleChange('length', parseInt(e.target.value) || 0)}
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The number of {formData.countType} to compare against.
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Condition Preview</h4>
        <div className="text-sm text-gray-700">
          This condition will return <strong>True</strong> if the message length in{' '}
          <strong>{selectedCountType?.label.toLowerCase()}</strong> is{' '}
          <strong>{selectedOperator?.label.toLowerCase()}</strong>{' '}
          <strong>{formData.length}</strong>.
        </div>
        <div className="mt-2 text-xs text-gray-600 font-mono bg-white p-2 rounded border">
          message.{formData.countType}.length {selectedOperator?.symbol} {formData.length}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <h5 className="font-medium text-green-800 mb-1">Example: Short Messages</h5>
          <p className="text-xs text-green-700">
            Use "Less than 10 words" to catch brief responses
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <h5 className="font-medium text-blue-800 mb-1">Example: Long Messages</h5>
          <p className="text-xs text-blue-700">
            Use "Greater than 500 characters" for detailed posts
          </p>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              Word counting splits by spaces and excludes empty words. Character counting includes all characters including spaces and emojis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageLengthCheck;
