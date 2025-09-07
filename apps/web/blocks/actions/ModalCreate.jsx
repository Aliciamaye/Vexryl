import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const ModalCreate = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    customId: config.customId || '',
    title: config.title || '',
    fields: config.fields || [],
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addField = () => {
    if (formData.fields.length >= 5) return; // Discord limit
    
    const newField = {
      customId: `field_${Date.now()}`,
      label: '',
      style: 'Short',
      placeholder: '',
      defaultValue: '',
      required: false,
      minLength: '',
      maxLength: '',
    };
    
    handleChange('fields', [...formData.fields, newField]);
  };

  const updateField = (index, field, value) => {
    const newFields = [...formData.fields];
    newFields[index] = { ...newFields[index], [field]: value };
    handleChange('fields', newFields);
  };

  const removeField = (index) => {
    const newFields = formData.fields.filter((_, i) => i !== index);
    handleChange('fields', newFields);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modal ID *
        </label>
        <input
          type="text"
          value={formData.customId}
          onChange={(e) => handleChange('customId', e.target.value)}
          placeholder="unique_modal_id"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Modal Title *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter modal title..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Input Fields ({formData.fields.length}/5)
          </label>
          <button
            onClick={addField}
            disabled={formData.fields.length >= 5}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:bg-gray-300"
          >
            Add Field
          </button>
        </div>

        {formData.fields.map((field, index) => (
          <div key={index} className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-gray-700">Field {index + 1}</h4>
              <button
                onClick={() => removeField(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Variable Name *
                </label>
                <input
                  type="text"
                  value={field.customId}
                  onChange={(e) => updateField(index, 'customId', e.target.value)}
                  placeholder="field_variable"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Field Label *
                </label>
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(index, 'label', e.target.value)}
                  placeholder="Field label"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Style
                </label>
                <select
                  value={field.style}
                  onChange={(e) => updateField(index, 'style', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="Short">Short</option>
                  <option value="Paragraph">Paragraph</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Placeholder
                </label>
                <input
                  type="text"
                  value={field.placeholder}
                  onChange={(e) => updateField(index, 'placeholder', e.target.value)}
                  placeholder="Placeholder text..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Default Value
                </label>
                <input
                  type="text"
                  value={field.defaultValue}
                  onChange={(e) => updateField(index, 'defaultValue', e.target.value)}
                  placeholder="Default value..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id={`required_${index}`}
                  checked={field.required}
                  onChange={(e) => updateField(index, 'required', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor={`required_${index}`} className="ml-2 text-xs text-gray-600">
                  Required
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Min Length
                  </label>
                  <input
                    type="number"
                    value={field.minLength}
                    onChange={(e) => updateField(index, 'minLength', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Max Length
                  </label>
                  <input
                    type="number"
                    value={field.maxLength}
                    onChange={(e) => updateField(index, 'maxLength', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    min="1"
                    max="4000"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {formData.fields.length === 0 && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-md">
            No fields added yet. Click "Add Field" to start.
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalCreate;
