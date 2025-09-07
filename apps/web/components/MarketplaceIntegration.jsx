import React, { useState } from 'react';
import { X, Share, Download, Upload, Star, Heart, MessageSquare, Users, Eye, Trash2, Edit } from 'lucide-react';

const MarketplaceIntegration = ({ botData, nodes, onClose }) => {
  const [activeTab, setActiveTab] = useState('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mySharedItems, setMySharedItems] = useState([]);

  // Mock marketplace data
  const marketplaceItems = [
    {
      id: 1,
      title: 'Advanced Moderation System',
      description: 'Complete moderation bot with auto-mod, warnings, and punishment system',
      author: 'ModMaster',
      category: 'moderation',
      type: 'command',
      downloads: 1250,
      rating: 4.8,
      likes: 89,
      comments: 23,
      price: 0,
      tags: ['moderation', 'auto-mod', 'warnings'],
      preview: 'https://via.placeholder.com/300x200',
      variables: {
        'moderatorRole': { type: 'role', description: 'Role that can use moderation commands' },
        'logChannel': { type: 'channel', description: 'Channel for moderation logs' },
        'warnLimit': { type: 'number', description: 'Number of warnings before punishment', default: 3 }
      },
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'Welcome System with Roles',
      description: 'Welcomes new members and automatically assigns roles based on reactions',
      author: 'WelcomeBot',
      category: 'utility',
      type: 'event',
      downloads: 890,
      rating: 4.6,
      likes: 67,
      comments: 15,
      price: 0,
      tags: ['welcome', 'auto-role', 'reactions'],
      preview: 'https://via.placeholder.com/300x200',
      variables: {
        'welcomeChannel': { type: 'channel', description: 'Channel to send welcome messages' },
        'welcomeMessage': { type: 'string', description: 'Custom welcome message', default: 'Welcome {user}!' },
        'autoRole': { type: 'role', description: 'Role to automatically assign' }
      },
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Economy System Starter',
      description: 'Basic economy system with currency, daily rewards, and shop',
      author: 'EconoMaster',
      category: 'engagement',
      type: 'module',
      downloads: 567,
      rating: 4.4,
      likes: 45,
      comments: 8,
      price: 5,
      tags: ['economy', 'currency', 'shop'],
      preview: 'https://via.placeholder.com/300x200',
      variables: {
        'currencyName': { type: 'string', description: 'Name of your currency', default: 'coins' },
        'dailyAmount': { type: 'number', description: 'Daily reward amount', default: 100 },
        'shopChannel': { type: 'channel', description: 'Channel for shop commands' }
      },
      createdAt: '2024-01-05'
    }
  ];

  const categories = {
    all: 'All Categories',
    moderation: 'Moderation',
    utility: 'Utility',
    engagement: 'Engagement',
    fun: 'Fun & Games',
    music: 'Music',
    economy: 'Economy'
  };

  const filteredItems = marketplaceItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const downloadItem = async (item) => {
    console.log('Downloading item:', item);
    alert(`Downloaded "${item.title}" to your bot!`);
  };

  const shareCurrentBot = () => {
    const sharedItem = {
      id: Date.now(),
      title: botData.name || 'My Bot',
      description: botData.description || 'Shared from Vexryl',
      author: 'You',
      category: 'utility',
      type: 'command',
      downloads: 0,
      rating: 0,
      likes: 0,
      comments: 0,
      price: 0,
      tags: ['custom', 'shared'],
      nodes: nodes,
      variables: extractVariables(nodes),
      createdAt: new Date().toISOString().split('T')[0]
    };

    setMySharedItems(prev => [...prev, sharedItem]);
    alert('Your bot has been shared to the marketplace!');
  };

  const extractVariables = (nodes) => {
    const variables = {};
    nodes.forEach(node => {
      if (node.data?.config) {
        Object.entries(node.data.config).forEach(([key, value]) => {
          if (typeof value === 'string' && value.includes('{') && value.includes('}')) {
            const varName = value.match(/\{(\w+)\}/)?.[1];
            if (varName) {
              variables[varName] = {
                type: 'string',
                description: `Variable used in ${node.data.name}`,
                default: ''
              };
            }
          }
        });
      }
    });
    return variables;
  };

  const deleteSharedItem = (itemId) => {
    if (confirm('Are you sure you want to delete this shared item?')) {
      setMySharedItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item deleted from marketplace');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Share className="w-6 h-6 text-purple-500" />
            <div>
              <h2 className="text-xl font-semibold text-white">Marketplace</h2>
              <p className="text-gray-400 text-sm">Share and discover bot components</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-700">
          <div className="flex px-6">
            {['browse', 'my-shared', 'share'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-purple-500 text-purple-500'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {activeTab === 'browse' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  {Object.entries(categories).map(([key, name]) => (
                    <option key={key} value={key}>{name}</option>
                  ))}
                </select>
              </div>

              {/* Marketplace Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <MarketplaceCard
                    key={item.id}
                    item={item}
                    onDownload={() => downloadItem(item)}
                  />
                ))}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No items found</h3>
                  <p className="text-gray-500">Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-shared' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">My Shared Items</h3>
                <button
                  onClick={() => setActiveTab('share')}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white"
                >
                  <Upload className="w-4 h-4" />
                  Share New Item
                </button>
              </div>

              {mySharedItems.length === 0 ? (
                <div className="text-center py-12">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No shared items</h3>
                  <p className="text-gray-500">Share your first bot component to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {mySharedItems.map((item) => (
                    <MarketplaceCard
                      key={item.id}
                      item={item}
                      isOwner={true}
                      onDelete={() => deleteSharedItem(item.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-white">Share Your Bot</h3>
              
              <div className="bg-gray-700 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center text-2xl">
                    🤖
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-white">{botData.name}</h4>
                    <p className="text-gray-400 mb-4">{botData.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Nodes:</span>
                        <span className="text-white ml-2">{nodes.length}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Commands:</span>
                        <span className="text-white ml-2">
                          {nodes.filter(n => n.data?.category === 'command').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Events:</span>
                        <span className="text-white ml-2">
                          {nodes.filter(n => n.data?.category === 'event').length}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Actions:</span>
                        <span className="text-white ml-2">
                          {nodes.filter(n => n.data?.category === 'action').length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-600 rounded-lg">
                  <h5 className="font-medium text-white mb-2">Custom Variables</h5>
                  <div className="space-y-2">
                    {Object.entries(extractVariables(nodes)).map(([name, config]) => (
                      <div key={name} className="flex items-center justify-between text-sm">
                        <span className="text-purple-400 font-mono">{name}</span>
                        <span className="text-gray-400">{config.description}</span>
                      </div>
                    ))}
                    {Object.keys(extractVariables(nodes)).length === 0 && (
                      <p className="text-gray-400 text-sm">No custom variables found</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={shareCurrentBot}
                  className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-white font-medium"
                >
                  <Share className="w-5 h-5" />
                  Share to Marketplace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MarketplaceCard = ({ item, onDownload, onDelete, isOwner = false }) => {
  return (
    <div className="bg-gray-700 rounded-lg overflow-hidden hover:bg-gray-650 transition-colors">
      {/* Preview Image */}
      <div className="h-32 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-4xl">
          {item.type === 'command' ? '⚡' : item.type === 'event' ? '🎯' : '📦'}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-white line-clamp-1">{item.title}</h4>
          <span className={`px-2 py-1 rounded text-xs ${
            item.price > 0 ? 'bg-yellow-600 text-yellow-100' : 'bg-green-600 text-green-100'
          }`}>
            {item.price > 0 ? `$${item.price}` : 'Free'}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{item.description}</p>

        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{item.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500" />
            <span>{item.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-500" />
            <span>{item.likes}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-600 text-gray-300 rounded text-xs">
              {tag}
            </span>
          ))}
          {item.tags.length > 2 && (
            <span className="text-xs text-gray-400">+{item.tags.length - 2} more</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">by {item.author}</span>
          
          {isOwner ? (
            <div className="flex gap-2">
              <button className="p-2 text-blue-400 hover:text-blue-300 transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="p-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onDownload}
              className="flex items-center gap-1 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-xs transition-colors text-white"
            >
              <Download className="w-3 h-3" />
              Download
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceIntegration;
