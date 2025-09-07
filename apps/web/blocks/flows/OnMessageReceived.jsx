import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const OnMessageReceived = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    channelFilter: config.channelFilter || '',
    messageContentFilter: config.messageContentFilter || '',
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-blue-700">
              This flow triggers whenever a message is sent in your server. Use filters to limit when this flow runs.
            </p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel Filter
        </label>
        <select
          value={formData.channelFilter}
          onChange={(e) => handleChange('channelFilter', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">All channels</option>
          {channels
            .filter(channel => channel.type === 'Text' || channel.type === 'News')
            .map(channel => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))
          }
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Leave empty to trigger on messages in any channel.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message Content Filter
        </label>
        <input
          type="text"
          value={formData.messageContentFilter}
          onChange={(e) => handleChange('messageContentFilter', e.target.value)}
          placeholder="e.g., !command, hello, etc."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Only trigger when messages contain this text (case-insensitive). Leave empty for all messages.
        </p>
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
              <strong>Performance Tip:</strong> Use filters to avoid triggering on every message. Without filters, this flow will run on every single message sent in your server.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Available Variables</h4>
        <div className="text-xs text-gray-600 space-y-1">
          <div><code className="bg-gray-200 px-1 rounded">message.content</code> - The message text</div>
          <div><code className="bg-gray-200 px-1 rounded">message.author</code> - Who sent the message</div>
          <div><code className="bg-gray-200 px-1 rounded">message.channel</code> - Where it was sent</div>
          <div><code className="bg-gray-200 px-1 rounded">message.timestamp</code> - When it was sent</div>
        </div>
      </div>
    </div>
  );
};

export default OnMessageReceived;
