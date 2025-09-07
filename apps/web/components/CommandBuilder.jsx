import React, { useState, useCallback } from 'react';
import { commandsAPI } from '../services/database.js';

const CommandBuilder = () => {
  const [command, setCommand] = useState({
    name: '',
    description: '',
    options: [],
    logic: {
      conditions: [],
      actions: []
    },
    response: {
      type: 'message',
      content: ''
    }
  });

  const [selectedOption, setSelectedOption] = useState(null);
  const [activeStep, setActiveStep] = useState('basic'); // basic, options, logic, response

  // Available option types for slash commands
  const optionTypes = [
    { id: 'STRING', name: 'Text', description: 'Text input from user' },
    { id: 'INTEGER', name: 'Number', description: 'Whole number input' },
    { id: 'NUMBER', name: 'Decimal', description: 'Decimal number input' },
    { id: 'BOOLEAN', name: 'True/False', description: 'Yes/No choice' },
    { id: 'USER', name: 'User', description: 'Select a server member' },
    { id: 'CHANNEL', name: 'Channel', description: 'Select a channel' },
    { id: 'ROLE', name: 'Role', description: 'Select a server role' },
    { id: 'MENTIONABLE', name: 'Mention', description: 'User or role mention' },
    { id: 'ATTACHMENT', name: 'File', description: 'File upload' },
  ];

  // Add a new option to the command
  const addOption = useCallback((optionType) => {
    const newOption = {
      id: `option_${Date.now()}`,
      name: '',
      description: '',
      type: optionType.id,
      required: false,
      choices: [], // For STRING/INTEGER/NUMBER types
      minValue: null, // For INTEGER/NUMBER types
      maxValue: null, // For INTEGER/NUMBER types
      minLength: null, // For STRING type
      maxLength: null, // For STRING type
    };
    
    setCommand(prev => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
    
    setSelectedOption(newOption);
  }, []);

  // Update option configuration
  const updateOption = useCallback((optionId, updates) => {
    setCommand(prev => ({
      ...prev,
      options: prev.options.map(option =>
        option.id === optionId ? { ...option, ...updates } : option
      ),
    }));
  }, []);

  // Remove an option
  const removeOption = useCallback((optionId) => {
    setCommand(prev => ({
      ...prev,
      options: prev.options.filter(option => option.id !== optionId),
    }));
    setSelectedOption(null);
  }, []);

  // Save command to database
  const saveCommand = useCallback(async () => {
    if (!command.name.trim()) {
      alert('Please enter a command name before saving.');
      return;
    }
    
    setLoading(true);
    
    try {
      const commandData = {
        ...command,
        name: command.name.startsWith('/') ? command.name : `/${command.name}`,
        updatedAt: new Date().toISOString(),
        enabled: true,
        collaborators: 0,
        executions: 0
      };
      
      if (command.databaseId) {
        // Update existing command
        await commandsAPI.update(command.databaseId, commandData);
      } else {
        // Create new command
        const response = await commandsAPI.create(commandData);
        setCommand(prev => ({ 
          ...prev, 
          databaseId: response.id,
          createdAt: response.created_at 
        }));
      }
      
      setHasUnsavedChanges(false);
      alert('Command saved successfully!');
    } catch (error) {
      console.error('Error saving command:', error);
      alert('Error saving command. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [command]);

  // Auto-save state management
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (command.name || command.description || command.options.length > 0) {
      setHasUnsavedChanges(true);
    }
  }, [command.name, command.description, command.options, command.logic, command.response]);

  // Export command configuration
  const exportCommand = useCallback(() => {
    const exportData = {
      ...command,
      type: 'slash_command',
      version: '1.0',
      createdAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${command.name || 'command'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [command]);

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Step Navigation */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Build Command</h2>
          <p className="text-sm text-gray-600">Step-by-step command creation</p>
        </div>
        
        <div className="p-2">
          {[
            { id: 'basic', name: 'Basic Info', icon: '📝', desc: 'Name & description' },
            { id: 'options', name: 'Options', icon: '⚙️', desc: 'User input parameters' },
            { id: 'logic', name: 'Logic', icon: '🔧', desc: 'What the command does' },
            { id: 'response', name: 'Response', icon: '💬', desc: 'Command feedback' }
          ].map((step, index) => (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`p-3 rounded-md cursor-pointer transition-colors mb-2 ${
                activeStep === step.id
                  ? 'bg-blue-50 border-blue-200 border'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{step.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium text-sm ${
                    activeStep === step.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {index + 1}. {step.name}
                  </div>
                  <div className="text-xs text-gray-600">{step.desc}</div>
                </div>
              </div>
              {activeStep === step.id && (
                <div className="ml-8 mt-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Command Preview */}
        <div className="p-4 border-t bg-gray-50">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
          <div className="bg-gray-800 text-white p-2 rounded text-xs font-mono">
            /{command.name || 'command'}
            {command.options.map(option => (
              <span key={option.id} className="ml-1 text-yellow-300">
                {option.required ? '<' : '['}
                {option.name || 'option'}
                {option.required ? '>' : ']'}
              </span>
            ))}
          </div>
          <div className="text-xs text-gray-600 mt-1">
            {command.options.length} options • {command.logic.actions.length} actions
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {activeStep === 'basic' && 'Command Basic Info'}
              {activeStep === 'options' && 'Command Options'}
              {activeStep === 'logic' && 'Command Logic'}
              {activeStep === 'response' && 'Command Response'}
            </h1>
            <p className="text-sm text-gray-600">
              {activeStep === 'basic' && 'Set the command name and description'}
              {activeStep === 'options' && 'Define what users can input'}
              {activeStep === 'logic' && 'Configure what the command does'}
              {activeStep === 'response' && 'Set how the bot responds'}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Save Status Indicator */}
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-600 font-medium">
                Unsaved changes
              </span>
            )}
            
            <button
              onClick={saveCommand}
              className={`px-4 py-2 rounded-md transition-colors flex items-center space-x-2 ${
                hasUnsavedChanges 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              <span>💾</span>
              <span>Save</span>
            </button>
            
            <button
              onClick={exportCommand}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export Command
            </button>
          </div>
        </div>

        {/* Step Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeStep === 'basic' && (
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Command Name *
                  </label>
                  <input
                    type="text"
                    value={command.name}
                    onChange={(e) => setCommand(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                    placeholder="ban, kick, say, poll..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lowercase letters, numbers, underscores and dashes only
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={command.description}
                    onChange={(e) => setCommand(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="What does this command do? Be clear and concise."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This will appear in Discord's command list
                  </p>
                </div>

                {/* Next Step Button */}
                <div className="pt-4">
                  <button
                    onClick={() => setActiveStep('options')}
                    disabled={!command.name || !command.description}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next: Add Options →
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeStep === 'options' && (
            <div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Add Option Types */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Add Option Types</h3>
                  <div className="space-y-2">
                    {optionTypes.map(optionType => (
                      <div
                        key={optionType.id}
                        onClick={() => addOption(optionType)}
                        className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{optionType.name}</div>
                        <div className="text-sm text-gray-600">{optionType.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Options */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Command Options ({command.options.length})
                  </h3>
                  
                  {command.options.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <div className="text-4xl mb-4">⚙️</div>
                      <p>No options yet</p>
                      <p className="text-sm">Click an option type to add it</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {command.options.map((option, index) => (
                        <div
                          key={option.id}
                          onClick={() => setSelectedOption(option)}
                          className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedOption?.id === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <span className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                                {option.type}
                              </span>
                              <div>
                                <div className="font-medium">
                                  {option.name || `Option ${index + 1}`}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {option.description || 'No description'}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {option.required && (
                                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                  Required
                                </span>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeOption(option.id);
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Option Configuration Panel */}
              {selectedOption && (
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Configure: {selectedOption.type} Option
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Option Name *
                      </label>
                      <input
                        type="text"
                        value={selectedOption.name}
                        onChange={(e) => updateOption(selectedOption.id, { name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
                        placeholder="user, reason, channel..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={selectedOption.description}
                        onChange={(e) => updateOption(selectedOption.id, { description: e.target.value })}
                        placeholder="What is this option for?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedOption.required}
                          onChange={(e) => updateOption(selectedOption.id, { required: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Required Option (users must provide this)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between items-center pt-8 border-t">
                <button
                  onClick={() => setActiveStep('basic')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Basic Info
                </button>
                <button
                  onClick={() => setActiveStep('logic')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Add Logic →
                </button>
              </div>
            </div>
          )}

          {activeStep === 'logic' && (
            <div className="max-w-4xl">
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-4">🔧</div>
                <h3 className="text-lg font-medium mb-2">Command Logic Builder</h3>
                <p>This will integrate with your existing action blocks</p>
                <p className="text-sm">Actions like UserBan, MessageText, RoleAdd, etc.</p>
              </div>
              
              <div className="flex justify-between items-center pt-8 border-t">
                <button
                  onClick={() => setActiveStep('options')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Options
                </button>
                <button
                  onClick={() => setActiveStep('response')}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Next: Set Response →
                </button>
              </div>
            </div>
          )}

          {activeStep === 'response' && (
            <div className="max-w-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Type
                  </label>
                  <select
                    value={command.response.type}
                    onChange={(e) => setCommand(prev => ({
                      ...prev,
                      response: { ...prev.response, type: e.target.value }
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="message">Send Message</option>
                    <option value="embed">Send Embed</option>
                    <option value="ephemeral">Private Response (only user sees)</option>
                    <option value="deferred">Processing... (for slow commands)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Content
                  </label>
                  <textarea
                    value={command.response.content}
                    onChange={(e) => setCommand(prev => ({
                      ...prev,
                      response: { ...prev.response, content: e.target.value }
                    }))}
                    placeholder="Command executed successfully! You can use {option_name} to reference user inputs."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use {`{option_name}`} to reference option values
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-8 border-t">
                <button
                  onClick={() => setActiveStep('logic')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Logic
                </button>
                <button
                  onClick={exportCommand}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  ✅ Finish Command
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandBuilder;
