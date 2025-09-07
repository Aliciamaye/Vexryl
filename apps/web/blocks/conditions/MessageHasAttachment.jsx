import React, { useState, useEffect } from 'react';

const MessageHasAttachment = ({ config, onChange }) => {
  const [formData, setFormData] = useState({
    hasAttachment: config.hasAttachment !== undefined ? config.hasAttachment : true,
    attachmentType: config.attachmentType || 'any', // 'any', 'image', 'video', 'audio', 'document'
    minCount: config.minCount || 1,
    maxCount: config.maxCount || null,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const attachmentTypes = [
    { value: 'any', label: 'Any file type' },
    { value: 'image', label: 'Images only (jpg, png, gif, webp)' },
    { value: 'video', label: 'Videos only (mp4, mov, avi, webm)' },
    { value: 'audio', label: 'Audio only (mp3, wav, ogg, m4a)' },
    { value: 'document', label: 'Documents only (pdf, doc, txt, etc.)' },
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attachment Check *
        </label>
        <select
          value={formData.hasAttachment}
          onChange={(e) => handleChange('hasAttachment', e.target.value === 'true')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="true">Message has attachments</option>
          <option value="false">Message has no attachments</option>
        </select>
      </div>

      {formData.hasAttachment && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachment Type
            </label>
            <select
              value={formData.attachmentType}
              onChange={(e) => handleChange('attachmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {attachmentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Count
              </label>
              <input
                type="number"
                value={formData.minCount}
                onChange={(e) => handleChange('minCount', parseInt(e.target.value) || 1)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Count (Optional)
              </label>
              <input
                type="number"
                value={formData.maxCount || ''}
                onChange={(e) => handleChange('maxCount', e.target.value ? parseInt(e.target.value) : null)}
                min="1"
                placeholder="No limit"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="font-medium text-gray-900 mb-2">Condition Summary</h4>
        <div className="text-sm text-gray-700">
          {formData.hasAttachment ? (
            <>
              This condition will return <strong>True</strong> if the message has{' '}
              <strong>
                {formData.minCount === 1 && !formData.maxCount ? 'at least 1' : 
                 formData.maxCount ? `${formData.minCount}-${formData.maxCount}` : 
                 `at least ${formData.minCount}`}
              </strong>{' '}
              attachment(s) of type <strong>{attachmentTypes.find(t => t.value === formData.attachmentType)?.label.toLowerCase()}</strong>.
            </>
          ) : (
            <>
              This condition will return <strong>True</strong> if the message has <strong>no attachments</strong>.
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-sm font-medium text-green-700">Supported Files</span>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Images, videos, audio, documents, and more
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-blue-700">File Detection</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Based on file extension and MIME type
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageHasAttachment;
