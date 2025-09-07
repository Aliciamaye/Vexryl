import React, { useState, useEffect } from 'react';

const MenuSelect = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    customId: config.customId || '',
    placeholder: config.placeholder || '',
    minValues: config.minValues || 1,
    maxValues: config.maxValues || 1,
    options: config.options || [],
    disabled: config.disabled || false,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addOption = () => {
    if (formData.options.length >= 25) return; // Discord limit
    
    const newOption = {
      label: '',
      value: '',
      description: '',
      emoji: '',
      default: false,
    };
    
    handleChange('options', [...formData.options, newOption]);
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    handleChange('options', newOptions);
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    handleChange('options', newOptions);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom ID *
          </label>
          <input
            type="text"
            value={formData.customId}
            onChange={(e) => handleChange('customId', e.target.value)}
            placeholder="select_menu_1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={100}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placeholder
          </label>
          <input
            type="text"
            value={formData.placeholder}
            onChange={(e) => handleChange('placeholder', e.target.value)}
            placeholder="Choose an option..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={150}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Values
          </label>
          <input
            type="number"
            value={formData.minValues}
            onChange={(e) => handleChange('minValues', parseInt(e.target.value) || 1)}
            min="0"
            max="25"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Values
          </label>
          <input
            type="number"
            value={formData.maxValues}
            onChange={(e) => handleChange('maxValues', parseInt(e.target.value) || 1)}
            min="1"
            max="25"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

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

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Options ({formData.options.length}/25)
          </label>
          <button
            onClick={addOption}
            disabled={formData.options.length >= 25}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300"
            type="button"
          >
            Add Option
          </button>
        </div>

        {formData.options.map((option, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 mb-3 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Option {index + 1}</h4>
              <button
                onClick={() => removeOption(index)}
                className="text-red-500 hover:text-red-700 text-sm"
                type="button"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Label *
                </label>
                <input
                  type="text"
                  value={option.label}
                  onChange={(e) => updateOption(index, 'label', e.target.value)}
                  placeholder="Option label"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Value *
                </label>
                <input
                  type="text"
                  value={option.value}
                  onChange={(e) => updateOption(index, 'value', e.target.value)}
                  placeholder="option_value"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  maxLength={100}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={option.description}
                  onChange={(e) => updateOption(index, 'description', e.target.value)}
                  placeholder="Option description..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Emoji
                </label>
                <input
                  type="text"
                  value={option.emoji}
                  onChange={(e) => updateOption(index, 'emoji', e.target.value)}
                  placeholder="😀"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`default_${index}`}
                  checked={option.default}
                  onChange={(e) => updateOption(index, 'default', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`default_${index}`} className="ml-2 text-xs text-gray-600">
                  Default Selected
                </label>
              </div>
            </div>
          </div>
        ))}

        {formData.options.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
            No options added yet. Click "Add Option" to start.
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Preview</h4>
        <select 
          className={`w-full px-3 py-2 border border-gray-300 rounded-md ${
            formData.disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={formData.disabled}
        >
          <option>{formData.placeholder || 'Choose an option...'}</option>
          {formData.options.map((option, index) => (
            <option key={index} value={option.value}>
              {option.emoji && `${option.emoji} `}{option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MenuSelect;
