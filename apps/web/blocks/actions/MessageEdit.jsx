import React, { useState, useEffect } from 'react';
import { useDiscordIntegration } from '../../hooks/useDiscordIntegration';

const MessageEdit = ({ config, onChange }) => {
  const { channels, loading } = useDiscordIntegration();
  const [formData, setFormData] = useState({
    messageId: config.messageId || '',
    channel: config.channel || '',
    newContent: config.newContent || '',
    newEmbed: config.newEmbed || null,
  });

  useEffect(() => {
    onChange(formData);
  }, [formData, onChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const [showEmbedBuilder, setShowEmbedBuilder] = useState(false);

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Channel *
        </label>
        <select
          value={formData.channel}
          onChange={(e) => handleChange('channel', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          <option value="">Select a channel...</option>
          {channels
            .filter(channel => channel.type === 'Text' || channel.type === 'News')
            .map(channel => (
              <option key={channel.id} value={channel.id}>
                #{channel.name}
              </option>
            ))
          }
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message ID *
        </label>
        <input
          type="text"
          value={formData.messageId}
          onChange={(e) => handleChange('messageId', e.target.value)}
          placeholder="123456789012345678"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Right-click on a message and select "Copy ID" to get the message ID.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          New Message Content
        </label>
        <textarea
          value={formData.newContent}
          onChange={(e) => handleChange('newContent', e.target.value)}
          placeholder="Enter the new message content..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
        <p className="text-xs text-gray-500 mt-1">
          Leave empty if you only want to edit the embed. At least one field (content or embed) must be provided.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowEmbedBuilder(!showEmbedBuilder)}
          className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>{showEmbedBuilder ? 'Hide' : 'Add'} Embed</span>
        </button>
      </div>

      {showEmbedBuilder && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-3">
          <h4 className="font-medium text-gray-900">Edit Embed</h4>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.newEmbed?.title || ''}
              onChange={(e) => handleChange('newEmbed', {
                ...formData.newEmbed,
                title: e.target.value
              })}
              placeholder="Embed title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.newEmbed?.description || ''}
              onChange={(e) => handleChange('newEmbed', {
                ...formData.newEmbed,
                description: e.target.value
              })}
              placeholder="Embed description..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="color"
              value={formData.newEmbed?.color || '#5865F2'}
              onChange={(e) => handleChange('newEmbed', {
                ...formData.newEmbed,
                color: e.target.value
              })}
              className="w-16 h-10 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-200 rounded-md p-3">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-orange-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-orange-700">
              You can only edit messages sent by your bot. Make sure your bot has the "Send Messages" permission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageEdit;
