import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  X, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronRight,
  Palette,
  Image,
  Link,
  Type,
  ToggleLeft,
  ToggleRight,
  Hash,
  MessageSquare,
  Users,
  Crown,
  Clock,
  Zap
} from 'lucide-react';

import VariablePicker from './VariablePicker';
import ColorPicker from './ColorPicker';
import EmbedBuilder from './EmbedBuilder';

const BlockConfigPanel = ({ node, onConfigChange, onClose }) => {
  const [config, setConfig] = useState(node?.data?.config || {});
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    advanced: false,
    permissions: false,
    embed: false
  });

  useEffect(() => {
    setConfig(node?.data?.config || {});
  }, [node]);

  const updateConfig = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const updateNestedConfig = (path, value) => {
    const keys = path.split('.');
    const newConfig = { ...config };
    let current = newConfig;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const renderBasicConfig = () => {
    switch (node?.data?.type) {
      case 'slash-command':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Command Name</label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => updateConfig('name', e.target.value)}
                placeholder="mycommand"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Lowercase, no spaces. Use hyphens or underscores.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Description</label>
              <textarea
                value={config.description || ''}
                onChange={(e) => updateConfig('description', e.target.value)}
                placeholder="What does this command do?"
                rows={3}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Guild Only</label>
              <button
                onClick={() => updateConfig('guildOnly', !config.guildOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.guildOnly ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.guildOnly ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Owner Only</label>
              <button
                onClick={() => updateConfig('ownerOnly', !config.ownerOnly)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.ownerOnly ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.ownerOnly ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      case 'send-message':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Message Content</label>
              <textarea
                value={config.content || ''}
                onChange={(e) => updateConfig('content', e.target.value)}
                placeholder="Type your message here..."
                rows={4}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none resize-none"
              />
              <div className="flex gap-2 mt-2">
                <VariablePicker onSelect={(variable) => updateConfig('content', (config.content || '') + variable)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Channel</label>
              <select
                value={config.channel || 'current'}
                onChange={(e) => updateConfig('channel', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="current">Current Channel</option>
                <option value="dm">Direct Message</option>
                <option value="custom">Custom Channel</option>
              </select>
            </div>

            {config.channel === 'custom' && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">Channel ID</label>
                <input
                  type="text"
                  value={config.channelId || ''}
                  onChange={(e) => updateConfig('channelId', e.target.value)}
                  placeholder="Channel ID or mention"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Use Embed</label>
              <button
                onClick={() => updateConfig('embed', !config.embed)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.embed ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.embed ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Ephemeral (Only user can see)</label>
              <button
                onClick={() => updateConfig('ephemeral', !config.ephemeral)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.ephemeral ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.ephemeral ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      case 'user-has-permission':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Required Permission</label>
              <select
                value={config.permission || 'ADMINISTRATOR'}
                onChange={(e) => updateConfig('permission', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="ADMINISTRATOR">Administrator</option>
                <option value="MANAGE_GUILD">Manage Server</option>
                <option value="MANAGE_CHANNELS">Manage Channels</option>
                <option value="MANAGE_ROLES">Manage Roles</option>
                <option value="MANAGE_MESSAGES">Manage Messages</option>
                <option value="KICK_MEMBERS">Kick Members</option>
                <option value="BAN_MEMBERS">Ban Members</option>
                <option value="MODERATE_MEMBERS">Timeout Members</option>
                <option value="SEND_MESSAGES">Send Messages</option>
                <option value="VIEW_CHANNEL">View Channel</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Check Channel Permissions</label>
              <button
                onClick={() => updateConfig('checkChannel', !config.checkChannel)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.checkChannel ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.checkChannel ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Allow Bot Owner</label>
              <button
                onClick={() => updateConfig('allowOwner', !config.allowOwner)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.allowOwner ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.allowOwner ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      case 'user-has-role':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Role ID</label>
              <input
                type="text"
                value={config.roleId || ''}
                onChange={(e) => updateConfig('roleId', e.target.value)}
                placeholder="Role ID or @role mention"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Role Name (Alternative)</label>
              <input
                type="text"
                value={config.roleName || ''}
                onChange={(e) => updateConfig('roleName', e.target.value)}
                placeholder="Role name"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Allow Higher Roles</label>
              <button
                onClick={() => updateConfig('allowHigher', !config.allowHigher)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.allowHigher ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.allowHigher ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">Configuration options for this block will appear here.</p>
          </div>
        );
    }
  };

  const renderEmbedConfig = () => {
    if (!config.embed) return null;

    return (
      <div className="space-y-4">
        <EmbedBuilder
          embedData={config.embedData || {}}
          onChange={(embedData) => updateConfig('embedData', embedData)}
        />
      </div>
    );
  };

  const renderAdvancedConfig = () => {
    switch (node?.data?.type) {
      case 'send-message':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Delete After (seconds)</label>
              <input
                type="number"
                value={config.deleteAfter || 0}
                onChange={(e) => updateConfig('deleteAfter', parseInt(e.target.value) || 0)}
                min="0"
                placeholder="0 (never delete)"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white">Text-to-Speech</label>
              <button
                onClick={() => updateConfig('tts', !config.tts)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  config.tts ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.tts ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        );

      case 'cooldown':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Duration (milliseconds)</label>
              <input
                type="number"
                value={config.duration || 5000}
                onChange={(e) => updateConfig('duration', parseInt(e.target.value) || 5000)}
                min="100"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Scope</label>
              <select
                value={config.scope || 'user'}
                onChange={(e) => updateConfig('scope', e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="user">Per User</option>
                <option value="guild">Per Server</option>
                <option value="channel">Per Channel</option>
                <option value="global">Global</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Cooldown Message</label>
              <input
                type="text"
                value={config.message || ''}
                onChange={(e) => updateConfig('message', e.target.value)}
                placeholder="Please wait {remaining} seconds"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
              />
              <p className="text-xs text-gray-400 mt-1">Use {`{remaining}`} for remaining time</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!node) return null;

  return (
    <div className="h-full bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded flex items-center justify-center text-sm"
            style={{ backgroundColor: node.data.color + '20', color: node.data.color }}
          >
            {node.data.icon}
          </div>
          <div>
            <h3 className="font-medium text-white">{node.data.name}</h3>
            <p className="text-xs text-gray-400">{node.data.type}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Configuration Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Basic Configuration */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection('basic')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-white">Basic Configuration</span>
            {expandedSections.basic ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSections.basic && (
            <div className="px-4 pb-4">
              {renderBasicConfig()}
            </div>
          )}
        </div>

        {/* Embed Configuration */}
        {config.embed && (
          <div className="border-b border-gray-700">
            <button
              onClick={() => toggleSection('embed')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-white">Embed Configuration</span>
              {expandedSections.embed ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {expandedSections.embed && (
              <div className="px-4 pb-4">
                {renderEmbedConfig()}
              </div>
            )}
          </div>
        )}

        {/* Advanced Configuration */}
        {renderAdvancedConfig() && (
          <div className="border-b border-gray-700">
            <button
              onClick={() => toggleSection('advanced')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
            >
              <span className="font-medium text-white">Advanced Configuration</span>
              {expandedSections.advanced ? (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {expandedSections.advanced && (
              <div className="px-4 pb-4">
                {renderAdvancedConfig()}
              </div>
            )}
          </div>
        )}

        {/* Permissions Configuration */}
        <div className="border-b border-gray-700">
          <button
            onClick={() => toggleSection('permissions')}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-white">Permissions & Access</span>
            {expandedSections.permissions ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          {expandedSections.permissions && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Required Permissions</label>
                <select
                  multiple
                  value={config.permissions || []}
                  onChange={(e) => updateConfig('permissions', Array.from(e.target.selectedOptions, option => option.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  size={3}
                >
                  <option value="ADMINISTRATOR">Administrator</option>
                  <option value="MANAGE_GUILD">Manage Server</option>
                  <option value="MANAGE_CHANNELS">Manage Channels</option>
                  <option value="MANAGE_ROLES">Manage Roles</option>
                  <option value="SEND_MESSAGES">Send Messages</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <div>Block ID: {node.id}</div>
          <div>Type: {node.data.type}</div>
          <div>Category: {node.data.category}</div>
        </div>
      </div>
    </div>
  );
};

export default BlockConfigPanel;
