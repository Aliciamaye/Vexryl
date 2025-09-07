import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ButtonAdd = ({ config, onChange }) => {
  const { emojis, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    label: config.label || '',
    customId: config.customId || '',
    style: config.style || 'Primary',
    emoji: config.emoji || '',
    url: config.url || '',
    disabled: config.disabled || false,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const insertEmoji = (emoji) => {
    handleChange('emoji', emoji.formatted);
  };

  const buttonStyles = {
    'Primary': 'bg-blue-600 text-white',
    'Secondary': 'bg-gray-500 text-white',
    'Success': 'bg-green-600 text-white',
    'Danger': 'bg-red-600 text-white',
    'Link': 'text-blue-600 underline bg-transparent'
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Button Label *
          </label>
          <input
            type="text"
            value={formData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Click Me!"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={80}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom ID *
          </label>
          <input
            type="text"
            value={formData.customId}
            onChange={(e) => handleChange('customId', e.target.value)}
            placeholder="button_click_1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={100}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Button Style *
        </label>
        <select
          value={formData.style}
          onChange={(e) => handleChange('style', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Primary">Primary (Blue)</option>
          <option value="Secondary">Secondary (Gray)</option>
          <option value="Success">Success (Green)</option>
          <option value="Danger">Danger (Red)</option>
          <option value="Link">Link (No background)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Emoji
        </label>
        <input
          type="text"
          value={formData.emoji}
          onChange={(e) => handleChange('emoji', e.target.value)}
          placeholder="😀 or <:custom:123456>"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-2">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Server Custom Emojis
          </label>
          <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto bg-gray-50 p-2 rounded-md">
            {emojis.map(emoji => (
              <button
                key={emoji.id}
                onClick={() => insertEmoji(emoji)}
                className="text-lg hover:bg-gray-200 p-1 rounded"
                title={emoji.name}
                type="button"
              >
                <img src={emoji.url} alt={emoji.name} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {formData.style === 'Link' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL *
          </label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={formData.disabled}
            onChange={(e) => handleChange('disabled', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Disabled</span>
        </label>
      </div>

      {/* Button Preview */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${buttonStyles[formData.style]} ${
            formData.disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={formData.disabled}
        >
          {formData.emoji && <span className="mr-2">{formData.emoji}</span>}
          {formData.label || 'Button Label'}
        </button>
      </div>
    </div>
  );
};

export default ButtonAdd;
