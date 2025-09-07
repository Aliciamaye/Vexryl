import React, { useState } from 'react';
import { X, Plus, Trash2, Edit2, Copy, Variable } from 'lucide-react';

const VariableManager = ({ variables, onVariablesChange, onClose }) => {
  const [newVariable, setNewVariable] = useState({
    name: '',
    value: '',
    type: 'string',
    scope: 'bot',
    description: ''
  });
  const [editingVariable, setEditingVariable] = useState(null);

  const variableTypes = {
    string: { name: 'String', icon: '📝', color: 'text-blue-400' },
    number: { name: 'Number', icon: '🔢', color: 'text-green-400' },
    boolean: { name: 'Boolean', icon: '✓', color: 'text-purple-400' },
    array: { name: 'Array', icon: '📋', color: 'text-yellow-400' },
    object: { name: 'Object', icon: '📦', color: 'text-red-400' },
    user: { name: 'User ID', icon: '👤', color: 'text-indigo-400' },
    channel: { name: 'Channel ID', icon: '#️⃣', color: 'text-cyan-400' },
    role: { name: 'Role ID', icon: '👑', color: 'text-pink-400' }
  };

  const scopes = {
    bot: { name: 'Bot-wide', description: 'Available across all servers' },
    guild: { name: 'Server-specific', description: 'Unique per server' },
    user: { name: 'User-specific', description: 'Unique per user' },
    channel: { name: 'Channel-specific', description: 'Unique per channel' }
  };

  const predefinedVariables = {
    '{user}': 'The user who triggered the command',
    '{user.id}': 'User ID',
    '{user.username}': 'Username',
    '{user.displayName}': 'Display name in server',
    '{user.mention}': 'User mention (@user)',
    '{user.avatar}': 'User avatar URL',
    '{server}': 'Server name',
    '{server.id}': 'Server ID',
    '{server.memberCount}': 'Total member count',
    '{server.owner}': 'Server owner',
    '{channel}': 'Current channel name',
    '{channel.id}': 'Current channel ID',
    '{channel.mention}': 'Channel mention (#channel)',
    '{date}': 'Current date',
    '{time}': 'Current time',
    '{timestamp}': 'Unix timestamp',
    '{random}': 'Random number (0-100)',
    '{args}': 'Command arguments',
    '{args[0]}': 'First argument',
    '{args[1]}': 'Second argument'
  };

  const addVariable = () => {
    if (!newVariable.name.trim()) return;

    const variable = {
      ...newVariable,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    onVariablesChange({
      ...variables,
      [newVariable.name]: variable
    });

    setNewVariable({
      name: '',
      value: '',
      type: 'string',
      scope: 'bot',
      description: ''
    });
  };

  const updateVariable = (name, updatedVariable) => {
    const newVariables = { ...variables };
    delete newVariables[name];
    newVariables[updatedVariable.name] = updatedVariable;
    onVariablesChange(newVariables);
    setEditingVariable(null);
  };

  const deleteVariable = (name) => {
    if (confirm(`Are you sure you want to delete variable "${name}"?`)) {
      const newVariables = { ...variables };
      delete newVariables[name];
      onVariablesChange(newVariables);
    }
  };

  const insertVariable = (varName) => {
    navigator.clipboard.writeText(varName);
    alert(`Copied "${varName}" to clipboard!`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Variable className="w-6 h-6 text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Variable Manager</h2>
              <p className="text-gray-400 text-sm">Manage dynamic variables for your bot</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-96">
          {/* Left Panel - Custom Variables */}
          <div className="w-1/2 border-r border-gray-700 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-white">Custom Variables</h3>
              <span className="text-sm text-gray-400">
                {Object.keys(variables).length} variables
              </span>
            </div>

            {/* Add New Variable */}
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-white mb-3">Add New Variable</h4>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Name</label>
                    <input
                      type="text"
                      value={newVariable.name}
                      onChange={(e) => setNewVariable({ ...newVariable, name: e.target.value })}
                      placeholder="variableName"
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">Type</label>
                    <select
                      value={newVariable.type}
                      onChange={(e) => setNewVariable({ ...newVariable, type: e.target.value })}
                      className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                    >
                      {Object.entries(variableTypes).map(([key, type]) => (
                        <option key={key} value={key}>
                          {type.icon} {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Default Value</label>
                  <input
                    type="text"
                    value={newVariable.value}
                    onChange={(e) => setNewVariable({ ...newVariable, value: e.target.value })}
                    placeholder="Default value..."
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Scope</label>
                  <select
                    value={newVariable.scope}
                    onChange={(e) => setNewVariable({ ...newVariable, scope: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                  >
                    {Object.entries(scopes).map(([key, scope]) => (
                      <option key={key} value={key}>
                        {scope.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <input
                    type="text"
                    value={newVariable.description}
                    onChange={(e) => setNewVariable({ ...newVariable, description: e.target.value })}
                    placeholder="What this variable is used for..."
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={addVariable}
                  disabled={!newVariable.name.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded transition-colors text-white"
                >
                  <Plus className="w-4 h-4" />
                  Add Variable
                </button>
              </div>
            </div>

            {/* Custom Variables List */}
            <div className="space-y-3">
              {Object.entries(variables).map(([name, variable]) => (
                <VariableCard
                  key={name}
                  name={name}
                  variable={variable}
                  variableTypes={variableTypes}
                  scopes={scopes}
                  onEdit={() => setEditingVariable({ name, ...variable })}
                  onDelete={() => deleteVariable(name)}
                  onCopy={() => insertVariable(`{${name}}`)}
                />
              ))}
              
              {Object.keys(variables).length === 0 && (
                <div className="text-center py-8">
                  <Variable className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No custom variables yet</p>
                  <p className="text-gray-500 text-sm">Create your first variable above</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Predefined Variables */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">Built-in Variables</h3>
            <p className="text-sm text-gray-400 mb-6">
              These variables are automatically available in all your bot commands and actions.
            </p>

            <div className="space-y-2">
              {Object.entries(predefinedVariables).map(([varName, description]) => (
                <div
                  key={varName}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-650 transition-colors"
                >
                  <div>
                    <code className="text-blue-400 font-mono text-sm">{varName}</code>
                    <p className="text-gray-400 text-xs mt-1">{description}</p>
                  </div>
                  <button
                    onClick={() => insertVariable(varName)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Variable Modal */}
        {editingVariable && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-700 rounded-lg p-6 w-96">
              <h4 className="text-lg font-medium text-white mb-4">Edit Variable</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Name</label>
                  <input
                    type="text"
                    value={editingVariable.name}
                    onChange={(e) => setEditingVariable({ ...editingVariable, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Type</label>
                  <select
                    value={editingVariable.type}
                    onChange={(e) => setEditingVariable({ ...editingVariable, type: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                  >
                    {Object.entries(variableTypes).map(([key, type]) => (
                      <option key={key} value={key}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Value</label>
                  <input
                    type="text"
                    value={editingVariable.value}
                    onChange={(e) => setEditingVariable({ ...editingVariable, value: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">Description</label>
                  <input
                    type="text"
                    value={editingVariable.description}
                    onChange={(e) => setEditingVariable({ ...editingVariable, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => updateVariable(editingVariable.name, editingVariable)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-white"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditingVariable(null)}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition-colors text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const VariableCard = ({ name, variable, variableTypes, scopes, onEdit, onDelete, onCopy }) => {
  const typeInfo = variableTypes[variable.type] || variableTypes.string;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`text-lg ${typeInfo.color}`}>{typeInfo.icon}</span>
          <code className="text-blue-400 font-mono">{`{${name}}`}</code>
        </div>
        <div className="flex gap-1">
          <button
            onClick={onCopy}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
            title="Copy variable"
          >
            <Copy className="w-3 h-3" />
          </button>
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
            title="Edit variable"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
            title="Delete variable"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {variable.description && (
        <p className="text-gray-400 text-sm mb-2">{variable.description}</p>
      )}

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className={typeInfo.color}>{typeInfo.name}</span>
          <span className="text-gray-500">{scopes[variable.scope]?.name}</span>
        </div>
        {variable.value && (
          <span className="text-gray-400 font-mono bg-gray-600 px-2 py-1 rounded">
            {variable.value.length > 20 ? variable.value.substring(0, 20) + '...' : variable.value}
          </span>
        )}
      </div>
    </div>
  );
};

export default VariableManager;
