import React, { useState } from 'react';
import { X, Download, Star, User, Calendar, Tag, ArrowRight, Eye, ExternalLink } from 'lucide-react';

const MarketplaceDetail = ({ item, onClose, onImport, getTypeIcon }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const { name, description, type, downloads, rating, tags, user, created_at, data } = item;
  
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full">
              {getTypeIcon(type)}
            </div>
            <h2 className="text-xl font-bold text-white">{name}</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'preview'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`px-6 py-3 text-sm font-medium ${
              activeTab === 'blocks'
                ? 'text-white border-b-2 border-blue-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Blocks
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Description</h3>
                <p className="text-gray-300 whitespace-pre-line">{description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User size={16} className="text-gray-400" />
                      <span>Created by {user?.username || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} className="text-gray-400" />
                      <span>Published on {formatDate(created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Download size={16} className="text-gray-400" />
                      <span>{downloads || 0} downloads</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Star size={16} className="text-yellow-400" />
                      <span>{rating || '0.0'} rating</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags && tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                    {(!tags || tags.length === 0) && (
                      <span className="text-gray-500">No tags</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Requirements or compatibility */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Requirements</h3>
                <ul className="list-disc list-inside text-gray-300 space-y-1">
                  <li>Discord.js v14 or higher</li>
                  <li>Node.js v16 or higher</li>
                  {type === 'event' && <li>Proper Discord gateway intents enabled</li>}
                </ul>
              </div>
            </div>
          )}
          
          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <div className="animate-fade-in">
              {type === 'command' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Command Preview</h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm mb-1">Command Name</div>
                      <div className="text-white font-mono bg-gray-800 px-3 py-1 rounded">/{data.name}</div>
                    </div>
                    
                    {data.options && data.options.length > 0 && (
                      <div className="mb-4">
                        <div className="text-gray-400 text-sm mb-1">Options</div>
                        <div className="space-y-2">
                          {data.options.map((option, i) => (
                            <div key={i} className="text-white font-mono bg-gray-800 px-3 py-1 rounded flex items-center gap-2">
                              <span className="text-blue-400">{option.name}</span>
                              <span className="text-gray-500">({option.type})</span>
                              {option.required && <span className="text-red-400 text-xs">required</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Description</div>
                      <div className="text-white bg-gray-800 px-3 py-1 rounded">
                        {data.description}
                      </div>
                    </div>
                  </div>
                  
                  {data.response && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium text-white mb-3">Response Preview</h3>
                      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                        {data.response.content && (
                          <div className="bg-gray-800 px-4 py-3 rounded mb-3">
                            {data.response.content}
                          </div>
                        )}
                        {data.response.embeds && data.response.embeds.length > 0 && (
                          <div className="border-l-4 border-blue-500 bg-gray-800 px-4 py-3 rounded">
                            {data.response.embeds[0].title && (
                              <div className="font-bold text-white">{data.response.embeds[0].title}</div>
                            )}
                            {data.response.embeds[0].description && (
                              <div className="text-gray-300 text-sm">{data.response.embeds[0].description}</div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {type === 'event' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Event Preview</h3>
                  <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                    <div className="mb-4">
                      <div className="text-gray-400 text-sm mb-1">Event Type</div>
                      <div className="text-white font-mono bg-gray-800 px-3 py-1 rounded">
                        {data.trigger_type || 'messageCreate'}
                      </div>
                    </div>
                    
                    {data.conditions && data.conditions.length > 0 && (
                      <div className="mb-4">
                        <div className="text-gray-400 text-sm mb-1">Conditions</div>
                        <div className="space-y-2">
                          {data.conditions.map((condition, i) => (
                            <div key={i} className="text-white font-mono bg-gray-800 px-3 py-1 rounded">
                              {condition.type}: {condition.value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {data.actions && data.actions.length > 0 && (
                      <div>
                        <div className="text-gray-400 text-sm mb-1">Actions</div>
                        <div className="space-y-2">
                          {data.actions.map((action, i) => (
                            <div key={i} className="text-white font-mono bg-gray-800 px-3 py-1 rounded flex items-center gap-2">
                              <span>{action.type}</span>
                              {action.target && <ArrowRight size={12} className="text-gray-500" />}
                              {action.target && <span className="text-blue-400">{action.target}</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {type === 'flow' && (
                <div>
                  <h3 className="text-lg font-medium text-white mb-3">Flow Preview</h3>
                  <div className="bg-gray-900 rounded-lg p-6 border border-gray-700 flex items-center justify-center">
                    {data.nodes && data.edges ? (
                      <div className="text-center">
                        <div className="text-gray-300 mb-4">This flow contains {data.nodes.length} nodes and {data.edges.length} connections</div>
                        <div className="bg-gray-800 p-4 rounded inline-block mb-4">
                          <Eye size={48} className="text-blue-400 mx-auto mb-2" />
                          <div className="text-white">Import to view the full workflow</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-500">No preview available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Blocks Tab */}
          {activeTab === 'blocks' && (
            <div className="animate-fade-in">
              <h3 className="text-lg font-medium text-white mb-3">Block Structure</h3>
              
              {type === 'command' && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <pre className="text-gray-300 text-sm overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(data, null, 2)}
                  </pre>
                </div>
              )}
              
              {type === 'event' && (
                <div className="space-y-4">
                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <h4 className="text-blue-400 font-medium mb-2">Trigger</h4>
                    <div className="bg-gray-900 rounded p-3">
                      <pre className="text-gray-300 text-sm overflow-x-auto">
                        {JSON.stringify(data.trigger_type, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  {data.conditions && data.conditions.length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                      <h4 className="text-yellow-400 font-medium mb-2">Conditions</h4>
                      <div className="bg-gray-900 rounded p-3">
                        <pre className="text-gray-300 text-sm overflow-x-auto">
                          {JSON.stringify(data.conditions, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                  
                  {data.actions && data.actions.length > 0 && (
                    <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                      <h4 className="text-green-400 font-medium mb-2">Actions</h4>
                      <div className="bg-gray-900 rounded p-3">
                        <pre className="text-gray-300 text-sm overflow-x-auto">
                          {JSON.stringify(data.actions, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {type === 'flow' && (
                <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
                  <div className="mb-4 bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                    <h4 className="text-purple-400 font-medium mb-2">Nodes</h4>
                    <div className="bg-gray-900 rounded p-3">
                      <pre className="text-gray-300 text-sm overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(data.nodes, null, 2)}
                      </pre>
                    </div>
                  </div>
                  
                  <div className="bg-cyan-900/20 border border-cyan-800 rounded-lg p-4">
                    <h4 className="text-cyan-400 font-medium mb-2">Connections</h4>
                    <div className="bg-gray-900 rounded p-3">
                      <pre className="text-gray-300 text-sm overflow-x-auto max-h-64 overflow-y-auto">
                        {JSON.stringify(data.edges, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">Ready to use this in your bot?</h4>
                  <button
                    onClick={onImport}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Download size={16} />
                    Import Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400">
              <Star size={16} />
              <span>{rating || '0.0'}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-400">
              <Download size={16} />
              <span>{downloads || 0} downloads</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={onImport}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-colors"
            >
              <Download size={16} />
              Import
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplaceDetail;
