import React, { useState } from 'react';
import { ChevronDown, Hash, Type, User, MessageSquare } from 'lucide-react';

/**
 * Variable Picker Component
 * Allows users to insert Discord variables and custom variables into text fields
 */
export default function VariablePicker({ onSelect, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('discord');

  // Built-in Discord variables
  const discordVariables = [
    { name: '{user}', description: 'User who triggered the command', category: 'User', icon: User },
    { name: '{user.id}', description: 'User ID', category: 'User', icon: Hash },
    { name: '{user.username}', description: 'Username', category: 'User', icon: Type },
    { name: '{user.discriminator}', description: 'User discriminator', category: 'User', icon: Hash },
    { name: '{user.avatar}', description: 'User avatar URL', category: 'User', icon: User },
    { name: '{guild}', description: 'Current server/guild', category: 'Guild', icon: MessageSquare },
    { name: '{guild.id}', description: 'Guild ID', category: 'Guild', icon: Hash },
    { name: '{guild.name}', description: 'Guild name', category: 'Guild', icon: Type },
    { name: '{guild.memberCount}', description: 'Number of members', category: 'Guild', icon: Hash },
    { name: '{channel}', description: 'Current channel', category: 'Channel', icon: MessageSquare },
    { name: '{channel.id}', description: 'Channel ID', category: 'Channel', icon: Hash },
    { name: '{channel.name}', description: 'Channel name', category: 'Channel', icon: Type },
    { name: '{message}', description: 'Triggered message', category: 'Message', icon: MessageSquare },
    { name: '{message.content}', description: 'Message content', category: 'Message', icon: Type },
    { name: '{message.author}', description: 'Message author', category: 'Message', icon: User },
    { name: '{args[0]}', description: 'First command argument', category: 'Arguments', icon: Type },
    { name: '{args[1]}', description: 'Second command argument', category: 'Arguments', icon: Type },
    { name: '{args.length}', description: 'Number of arguments', category: 'Arguments', icon: Hash },
    { name: '{timestamp}', description: 'Current timestamp', category: 'Utility', icon: Hash },
    { name: '{random}', description: 'Random number 0-100', category: 'Utility', icon: Hash }
  ];

  // Custom variables (would be loaded from the bot's variable manager)
  const customVariables = [
    { name: '{coins}', description: 'User coins', category: 'Economy', icon: Hash },
    { name: '{level}', description: 'User level', category: 'Leveling', icon: Hash },
    { name: '{prefix}', description: 'Bot prefix', category: 'Settings', icon: Type }
  ];

  const categories = {
    discord: {
      name: 'Discord Variables',
      variables: discordVariables,
      color: 'blue'
    },
    custom: {
      name: 'Custom Variables',
      variables: customVariables,
      color: 'purple'
    }
  };

  const handleVariableSelect = (variable) => {
    onSelect(variable.name);
    setIsOpen(false);
  };

  const getCategoryVariables = () => {
    return categories[activeCategory]?.variables || [];
  };

  const groupedVariables = getCategoryVariables().reduce((acc, variable) => {
    if (!acc[variable.category]) {
      acc[variable.category] = [];
    }
    acc[variable.category].push(variable);
    return acc;
  }, {});

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
        type="button"
      >
        <Hash className="w-4 h-4" />
        Variables
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
          {/* Category Tabs */}
          <div className="flex border-b border-gray-600">
            {Object.entries(categories).map(([key, category]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeCategory === key
                    ? `bg-${category.color}-600 text-white`
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Variables List */}
          <div className="max-h-64 overflow-y-auto">
            {Object.entries(groupedVariables).map(([categoryName, variables]) => (
              <div key={categoryName} className="p-2">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">
                  {categoryName}
                </h4>
                <div className="space-y-1">
                  {variables.map((variable) => (
                    <button
                      key={variable.name}
                      onClick={() => handleVariableSelect(variable)}
                      className="w-full flex items-start gap-3 px-2 py-2 text-left hover:bg-gray-700 rounded text-sm text-white transition-colors"
                    >
                      <variable.icon className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-blue-300">{variable.name}</div>
                        <div className="text-xs text-gray-400 truncate">{variable.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-600 p-3 text-xs text-gray-400">
            Click a variable to insert it into your text
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
