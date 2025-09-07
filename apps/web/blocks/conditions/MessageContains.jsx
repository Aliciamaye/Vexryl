import React, { useState, useEffect } from 'react';

const MessageContains = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    text: config.text || '',
    caseSensitive: config.caseSensitive || false,
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
          Text to Check *
        </label>
        <input
          type="text"
          value={formData.text}
          onChange={(e) => handleChange('text', e.target.value)}
          placeholder="Enter text to search for..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.caseSensitive}
            onChange={(e) => handleChange('caseSensitive', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Case Sensitive</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, "Hello" and "hello" will be treated as different words.
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Examples:</p>
              <ul className="text-xs space-y-1">
                <li>• "hello" matches "hello world"</li>
                <li>• "ban" matches "banana" (partial match)</li>
                <li>• Use quotes for exact phrases: "hello world"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              This condition will check if the message contains the specified text and continue with the "True" path if it does, or "False" path if it doesn't.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageContains;
