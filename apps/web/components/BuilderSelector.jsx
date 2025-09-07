import React, { useState } from 'react';
import ImprovedEventWorkflowBuilder from './ImprovedEventWorkflowBuilder.jsx';
import CommandBuilder from './CommandBuilder.jsx';

const BuilderSelector = () => {
  const [activeBuilder, setActiveBuilder] = useState('events');

  return (
    <div className="h-screen flex flex-col">
      {/* Builder Type Selector */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex items-center justify-center">
          <div className="flex bg-gray-100 rounded-lg p-1 m-4">
            <button
              onClick={() => setActiveBuilder('events')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeBuilder === 'events'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ⚡ Event Workflows
            </button>
            <button
              onClick={() => setActiveBuilder('commands')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                activeBuilder === 'commands'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🎮 Slash Commands
            </button>
          </div>
        </div>
        
        {/* Builder Description */}
        <div className="text-center pb-4">
          {activeBuilder === 'events' ? (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Create automated workflows that respond to Discord events
              </p>
              <p className="text-xs text-gray-500">
                Examples: Welcome messages, auto-moderation, reaction roles
              </p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-2">
                Build interactive slash commands with user input options
              </p>
              <p className="text-xs text-gray-500">
                Examples: /ban @user reason, /say #channel message, /poll question
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Active Builder */}
      <div className="flex-1">
        {activeBuilder === 'events' ? (
          <ImprovedEventWorkflowBuilder />
        ) : (
          <CommandBuilder />
        )}
      </div>
    </div>
  );
};

export default BuilderSelector;
