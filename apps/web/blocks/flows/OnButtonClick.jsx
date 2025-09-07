import React, { useState, useEffect } from 'react';

const OnButtonClick = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    customId: config.customId || '',
    matchType: config.matchType || 'exact', // 'exact', 'startsWith', 'contains'
    allowedUsers: config.allowedUsers || [],
    allowedRoles: config.allowedRoles || [],
    cooldown: config.cooldown || 0,
    onlyFromBot: config.onlyFromBot !== undefined ? config.onlyFromBot : true,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const matchTypes = [
    { value: 'exact', label: 'Exact match', description: 'Button ID must match exactly' },
    { value: 'startsWith', label: 'Starts with', description: 'Button ID starts with the specified text' },
    { value: 'contains', label: 'Contains', description: 'Button ID contains the specified text' },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-md p-4">
        <div className="flex items-center space-x-2">
          <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
          </svg>
          <div>
            <h3 className="font-medium text-purple-900">Button Click Trigger</h3>
            <p className="text-sm text-purple-700">Triggers when a user clicks a button component</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Custom ID *
        </label>
        <input
          type="text"
          value={formData.customId}
          onChange={(e) => handleChange('customId', e.target.value)}
          placeholder="button_confirm, delete_message, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          The custom ID that was set when creating the button component.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Match Type *
        </label>
        <select
          value={formData.matchType}
          onChange={(e) => handleChange('matchType', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {matchTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {matchTypes.find(t => t.value === formData.matchType)?.description}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cooldown (seconds)
        </label>
        <input
          type="number"
          value={formData.cooldown}
          onChange={(e) => handleChange('cooldown', parseInt(e.target.value) || 0)}
          min="0"
          max="3600"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Minimum time between clicks for the same user (0 = no cooldown).
        </p>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.onlyFromBot}
            onChange={(e) => handleChange('onlyFromBot', e.target.checked)}
            className="rounded border-gray-300 text-purple-600 shadow-sm focus:border-purple-300 focus:ring focus:ring-purple-200 focus:ring-opacity-50"
          />
          <span className="text-sm text-gray-700">Only buttons from this bot</span>
        </label>
        <p className="text-xs text-gray-500 mt-1">
          When enabled, only responds to buttons created by this bot.
        </p>
      </div>

      {formData.customId && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
          <h4 className="font-medium text-gray-900 mb-2">Button ID Preview</h4>
          <div className="text-sm text-gray-700">
            This trigger will activate when a button with custom ID that{' '}
            <strong>{matchTypes.find(t => t.value === formData.matchType)?.label.toLowerCase()}</strong>{' '}
            "<code className="bg-white px-2 py-1 rounded">{formData.customId}</code>" is clicked.
          </div>
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Available Variables</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><code className="bg-white px-2 py-1 rounded">interaction.user</code> - User who clicked the button</div>
          <div><code className="bg-white px-2 py-1 rounded">interaction.customId</code> - The button's custom ID</div>
          <div><code className="bg-white px-2 py-1 rounded">interaction.message</code> - Message containing the button</div>
          <div><code className="bg-white px-2 py-1 rounded">interaction.channel</code> - Channel where button was clicked</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Remember to respond to button interactions within 3 seconds to prevent "This interaction failed" errors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnButtonClick;
