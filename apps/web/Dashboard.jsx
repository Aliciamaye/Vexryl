import React, { useState, useEffect } from "react";
import BuilderSelector from "./components/BuilderSelector.jsx";
import { commandsAPI, eventsAPI, auth, subscriptions } from "./services/database.js";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState('overview');
  const [userCommands, setUserCommands] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [collaborationMode, setCollaborationMode] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Load user's commands and events from database
  useEffect(() => {
    const loadUserCreations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check authentication
        const currentUser = await auth.getCurrentUser();
        if (!currentUser) {
          setError('Please sign in to view your creations');
          setLoading(false);
          return;
        }

        setUser(currentUser);

        // Load commands and events from database
        const [commandsData, eventsData] = await Promise.all([
          commandsAPI.getAll(),
          eventsAPI.getAll()
        ]);

        // Transform database format to match existing component expectations
        const transformedCommands = commandsData.map(cmd => ({
          ...cmd.data, // Spread the full command configuration
          id: cmd.id,
          databaseId: cmd.id, // Keep reference to database ID
          enabled: cmd.enabled,
          collaborators: cmd.collaborators,
          executions: cmd.executions,
          createdAt: cmd.created_at,
          updatedAt: cmd.updated_at
        }));

        const transformedEvents = eventsData.map(evt => ({
          ...evt.data, // Spread the full workflow configuration
          id: evt.id,
          databaseId: evt.id, // Keep reference to database ID
          enabled: evt.enabled,
          collaborators: evt.collaborators,
          executions: evt.executions,
          createdAt: evt.created_at,
          updatedAt: evt.updated_at
        }));

        setUserCommands(transformedCommands);
        setUserEvents(transformedEvents);

      } catch (error) {
        console.error('Error loading user creations:', error);
        setError(error.message);
        setUserCommands([]);
        setUserEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserCreations();

    // Set up real-time subscriptions
    let commandsSubscription, eventsSubscription;
    
    auth.getCurrentUser().then(currentUser => {
      if (currentUser) {
        // Subscribe to real-time changes
        commandsSubscription = subscriptions.subscribeToCommands(
          currentUser.id,
          () => loadUserCreations() // Reload data on changes
        );
        
        eventsSubscription = subscriptions.subscribeToEvents(
          currentUser.id,
          () => loadUserCreations() // Reload data on changes
        );
      }
    });
    
    return () => {
      // Cleanup subscriptions
      if (commandsSubscription) subscriptions.unsubscribe(commandsSubscription);
      if (eventsSubscription) subscriptions.unsubscribe(eventsSubscription);
    };
  }, []);

  // Filter and sort items
  const getFilteredItems = () => {
    let items = [];
    
    if (filterType === 'all' || filterType === 'commands') {
      items = [...items, ...userCommands.map(cmd => ({ ...cmd, type: 'command' }))];
    }
    if (filterType === 'all' || filterType === 'events') {
      items = [...items, ...userEvents.map(evt => ({ ...evt, type: 'event' }))];
    }
    
    // Apply search filter
    if (searchQuery) {
      items = items.filter(item => 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'recent':
        items.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
        break;
      case 'alphabetical':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'type':
        items.sort((a, b) => a.type.localeCompare(b.type));
        break;
    }
    
    return items;
  };

  const handleExport = () => {
    const exportData = {
      commands: selectedItems.filter(id => userCommands.some(cmd => cmd.id === id)),
      events: selectedItems.filter(id => userEvents.some(evt => evt.id === id)),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vexryl-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowExportModal(false);
    setSelectedItems([]);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target.result);
        
        if (importData.commands) {
          const newCommands = [...userCommands, ...importData.commands];
          localStorage.setItem('vexryl_commands', JSON.stringify(newCommands));
          setUserCommands(newCommands);
        }
        
        if (importData.events) {
          const newEvents = [...userEvents, ...importData.events];
          localStorage.setItem('vexryl_events', JSON.stringify(newEvents));
          setUserEvents(newEvents);
        }
        
        // Trigger update event
        window.dispatchEvent(new CustomEvent('vexryl-update'));
      } catch (error) {
        console.error('Error importing data:', error);
        alert('Error importing file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const duplicateItem = async (item) => {
    try {
      const newItem = {
        ...item,
        name: `${item.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (item.type === 'command') {
        await commandsAPI.create(newItem);
      } else {
        await eventsAPI.create(newItem);
      }
      
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error duplicating item:', error);
      alert('Error duplicating item. Please try again.');
    }
  };

  const deleteItem = async (item) => {
    if (!confirm(`Are you sure you want to delete "${item.name}"?`)) return;
    
    try {
      if (item.type === 'command') {
        await commandsAPI.delete(item.databaseId);
      } else {
        await eventsAPI.delete(item.databaseId);
      }
      
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Error deleting item. Please try again.');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingScreen />;
    }

    if (error) {
      return <ErrorScreen error={error} onRetry={() => window.location.reload()} />;
    }

    if (!user) {
      return <AuthScreen />;
    }

    switch(currentView) {
      case 'builders':
        return <BuilderSelector />;
      case 'commands':
        return <CommandsList 
          commands={userCommands} 
          onViewChange={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onDuplicate={duplicateItem}
          onDelete={deleteItem}
          getFilteredItems={getFilteredItems}
        />;
      case 'events': 
        return <EventsList 
          events={userEvents} 
          onViewChange={setCurrentView}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterType={filterType}
          setFilterType={setFilterType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onDuplicate={duplicateItem}
          onDelete={deleteItem}
          getFilteredItems={getFilteredItems}
        />;
      default:
        return <OverviewContent 
          commands={userCommands} 
          events={userEvents} 
          onViewChange={setCurrentView}
          getFilteredItems={getFilteredItems}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">Vexryl Bot Builder</h1>
              <p className="text-sm text-gray-400">Create Discord commands and events collaboratively</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-300">Online</span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Export/Import */}
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
              >
                📤 Export
              </button>
              
              <label className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors cursor-pointer">
                📥 Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              
              {/* Collaboration Toggle */}
              <button
                onClick={() => setCollaborationMode(!collaborationMode)}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  collaborationMode 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                👥 {collaborationMode ? 'Live' : 'Solo'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
          <nav className="p-4 space-y-2">
            <NavItem 
              icon="📊" 
              label="Overview" 
              active={currentView === 'overview'} 
              onClick={() => setCurrentView('overview')} 
            />
            <NavItem 
              icon="🏗️" 
              label="Create New" 
              active={currentView === 'builders'} 
              onClick={() => setCurrentView('builders')} 
            />
            <NavItem 
              icon="⚡" 
              label="My Commands" 
              badge={userCommands.length}
              active={currentView === 'commands'} 
              onClick={() => setCurrentView('commands')} 
            />
            <NavItem 
              icon="🎯" 
              label="My Events" 
              badge={userEvents.length}
              active={currentView === 'events'} 
              onClick={() => setCurrentView('events')} 
            />
            
            <div className="border-t border-gray-700 pt-4 mt-4">
              <NavItem icon="👥" label="Shared with Me" />
              <NavItem icon="🔗" label="Collaboration" />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
      
      {/* Export Modal */}
      {showExportModal && (
        <ExportModal 
          onClose={() => setShowExportModal(false)}
          onExport={handleExport}
          commands={userCommands}
          events={userEvents}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}
    </div>
  );
}

function NavItem({ icon, label, badge, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
        active 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className={`px-2 py-1 text-xs rounded-full ${
          active ? 'bg-blue-500' : 'bg-gray-600'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function LoadingScreen() {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-400">Loading your creations...</p>
      </div>
    </div>
  );
}

function ErrorScreen({ error, onRetry }) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-xl font-semibold text-white mb-2">Something went wrong</h3>
        <p className="text-gray-400 mb-6">{error}</p>
        <button 
          onClick={onRetry}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isSignUp) {
        await auth.signUp(email, password, username);
        alert('Check your email for verification link!');
      } else {
        await auth.signIn(email, password);
        window.location.reload(); // Refresh to load user data
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[600px] p-8">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md border border-gray-700">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">V</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? 'Join Vexryl' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400">
            {isSignUp 
              ? 'Create your account to start building Discord bots' 
              : 'Sign in to access your bot creations'
            }
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                required
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function OverviewContent({ commands, events, onViewChange, getFilteredItems }) {
  const totalCollaborators = commands.reduce((acc, cmd) => acc + (cmd.collaborators || 0), 0) +
                            events.reduce((acc, evt) => acc + (evt.collaborators || 0), 0);
  const recentItems = getFilteredItems().slice(0, 5);
  const totalExecutions = commands.reduce((acc, cmd) => acc + (cmd.executions || 0), 0) +
                          events.reduce((acc, evt) => acc + (evt.executions || 0), 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
        <p className="text-gray-400">Here's what you've been building</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Commands Created" 
          value={commands.length} 
          icon="⚡" 
          color="blue"
          subtitle={`${commands.filter(c => c.enabled).length} active`}
        />
        <StatCard 
          title="Events Created" 
          value={events.length} 
          icon="🎯" 
          color="green"
          subtitle={`${events.filter(e => e.enabled).length} active`}
        />
        <StatCard 
          title="Total Executions" 
          value={totalExecutions} 
          icon="🚀" 
          color="purple"
          subtitle="This month"
        />
        <StatCard 
          title="Collaborators" 
          value={totalCollaborators} 
          icon="👥" 
          color="orange"
          subtitle="Working together"
        />
      </div>

      {/* Activity Chart Placeholder */}
      <div className="mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <div className="h-32 bg-gray-700 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">📊 Usage analytics coming soon</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard 
            title="Create Slash Command"
            description="Build interactive commands for your Discord server"
            icon="⚡"
            onClick={() => onViewChange('builders')}
          />
          <QuickActionCard 
            title="Create Event Listener"
            description="Set up automated responses to Discord events"
            icon="🎯"
            onClick={() => onViewChange('builders')}
          />
          <QuickActionCard 
            title="Deploy to Server"
            description="Push your commands and events live"
            icon="🚀"
            onClick={() => alert('Deployment coming soon!')}
          />
        </div>
      </div>

      {/* Recent Creations or Empty State */}
      {recentItems.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentItems.map((item, index) => (
              <RecentItem key={index} item={item} />
            ))}
          </div>
        </div>
      ) : (
        <EmptyState onViewChange={onViewChange} />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color, subtitle }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600', 
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1 group-hover:scale-105 transition-transform">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClasses[color]} flex items-center justify-center text-xl group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-colors text-left group w-full"
    >
      <div className="flex items-start space-x-4">
        <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-xl group-hover:bg-blue-500 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </button>
  );
}

function RecentItem({ item }) {
  const isCommand = item.name?.startsWith('/') || item.type === 'command';
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
          isCommand ? 'bg-blue-600' : 'bg-green-600'
        }`}>
          {isCommand ? '⚡' : '🎯'}
        </div>
        <div>
          <h4 className="font-medium text-white">{item.name}</h4>
          <p className="text-gray-400 text-sm">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2 text-xs text-gray-400">
        {item.collaborators > 0 && (
          <>
            <span className="flex items-center space-x-1">
              <span>👥</span>
              <span>{item.collaborators}</span>
            </span>
            <span>•</span>
          </>
        )}
        <span>{new Date(item.updatedAt || item.createdAt).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function EmptyState({ onViewChange }) {
  return (
    <div className="text-center py-12">
      <div className="text-6xl mb-4">🏗️</div>
      <h3 className="text-xl font-semibold text-white mb-2">Start building!</h3>
      <p className="text-gray-400 mb-6">Create your first command or event to get started</p>
      <button 
        onClick={() => onViewChange('builders')}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
      >
        Open Builders
      </button>
    </div>
  );
}

function CommandsList({ commands, onViewChange, searchQuery, setSearchQuery, filterType, setFilterType, sortBy, setSortBy, onDuplicate, onDelete, getFilteredItems }) {
  const filteredCommands = getFilteredItems().filter(item => item.type === 'command');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Commands</h2>
        <button 
          onClick={() => onViewChange('builders')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>⚡</span>
          <span>New Command</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search commands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="alphabetical">A-Z</option>
          <option value="type">By Type</option>
        </select>
      </div>
      
      {filteredCommands.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">⚡</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No commands found' : 'No commands yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? `No commands match "${searchQuery}"`
              : 'Create your first slash command to get started'
            }
          </p>
          {!searchQuery && (
            <button 
              onClick={() => onViewChange('builders')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Create Command
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCommands.map((command, index) => (
            <CommandCard 
              key={index} 
              command={command} 
              onDuplicate={() => onDuplicate(command)}
              onDelete={() => onDelete(command)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EventsList({ events, onViewChange, searchQuery, setSearchQuery, filterType, setFilterType, sortBy, setSortBy, onDuplicate, onDelete, getFilteredItems }) {
  const filteredEvents = getFilteredItems().filter(item => item.type === 'event');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">My Events</h2>
        <button 
          onClick={() => onViewChange('builders')}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
        >
          <span>🎯</span>
          <span>New Event</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none"
          />
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-green-500 focus:outline-none"
        >
          <option value="recent">Most Recent</option>
          <option value="alphabetical">A-Z</option>
          <option value="type">By Type</option>
        </select>
      </div>
      
      {filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">
            {searchQuery ? 'No events found' : 'No events yet'}
          </h3>
          <p className="text-gray-400 mb-6">
            {searchQuery 
              ? `No events match "${searchQuery}"`
              : 'Create your first event listener to get started'
            }
          </p>
          {!searchQuery && (
            <button 
              onClick={() => onViewChange('builders')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Create Event
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredEvents.map((event, index) => (
            <EventCard 
              key={index} 
              event={event}
              onDuplicate={() => onDuplicate(event)}
              onDelete={() => onDelete(event)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CommandCard({ command, onDuplicate, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{command.name}</h3>
            <p className="text-gray-400 text-sm">{command.description}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          {command.collaborators > 0 && (
            <span className="flex items-center space-x-1 text-sm text-gray-400">
              <span>👥</span>
              <span>{command.collaborators}</span>
            </span>
          )}
          
          <div className="flex space-x-1">
            <button 
              onClick={onDuplicate}
              className="text-gray-400 hover:text-blue-300 p-2 rounded bg-blue-600/10 hover:bg-blue-600/20 transition-colors"
              title="Duplicate"
            >
              📋
            </button>
            <button className="text-blue-400 hover:text-blue-300 p-2 rounded bg-blue-600/10 hover:bg-blue-600/20 transition-colors">
              ✏️
            </button>
            <button 
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 p-2 rounded bg-red-600/10 hover:bg-red-600/20 transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Updated {new Date(command.updatedAt || command.createdAt).toLocaleDateString()}</span>
          {command.executions > 0 && (
            <span className="flex items-center space-x-1">
              <span>🚀</span>
              <span>{command.executions} runs</span>
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          command.enabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
        }`}>
          {command.enabled ? 'Active' : 'Disabled'}
        </span>
      </div>
    </div>
  );
}

function EventCard({ event, onDuplicate, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div 
      className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all group"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
            <span className="text-lg">🎯</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{event.name}</h3>
            <p className="text-gray-400 text-sm">{event.description}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 transition-opacity ${showActions ? 'opacity-100' : 'opacity-0'}`}>
          {event.collaborators > 0 && (
            <span className="flex items-center space-x-1 text-sm text-gray-400">
              <span>👥</span>
              <span>{event.collaborators}</span>
            </span>
          )}
          
          <div className="flex space-x-1">
            <button 
              onClick={onDuplicate}
              className="text-gray-400 hover:text-green-300 p-2 rounded bg-green-600/10 hover:bg-green-600/20 transition-colors"
              title="Duplicate"
            >
              📋
            </button>
            <button className="text-green-400 hover:text-green-300 p-2 rounded bg-green-600/10 hover:bg-green-600/20 transition-colors">
              ✏️
            </button>
            <button 
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 p-2 rounded bg-red-600/10 hover:bg-red-600/20 transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <span>Updated {new Date(event.updatedAt || event.createdAt).toLocaleDateString()}</span>
          {event.executions > 0 && (
            <span className="flex items-center space-x-1">
              <span>🚀</span>
              <span>{event.executions} runs</span>
            </span>
          )}
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          event.enabled ? 'bg-green-600/20 text-green-400' : 'bg-gray-600/20 text-gray-400'
        }`}>
          {event.enabled ? 'Active' : 'Disabled'}
        </span>
      </div>
    </div>
  );
}

function ExportModal({ onClose, onExport, commands, events, selectedItems, setSelectedItems }) {
  const allItems = [
    ...commands.map(cmd => ({ ...cmd, type: 'command' })),
    ...events.map(evt => ({ ...evt, type: 'event' }))
  ];

  const toggleItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(allItems.map(item => item.id));
  };

  const selectNone = () => {
    setSelectedItems([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Export Your Creations</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-300">Select items to export:</p>
            <div className="flex space-x-2">
              <button 
                onClick={selectAll}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                Select All
              </button>
              <button 
                onClick={selectNone}
                className="text-gray-400 hover:text-gray-300 text-sm"
              >
                Select None
              </button>
            </div>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {allItems.map((item) => (
              <label 
                key={item.id} 
                className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600"
              >
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => toggleItem(item.id)}
                  className="text-blue-500"
                />
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  item.type === 'command' ? 'bg-blue-600' : 'bg-green-600'
                }`}>
                  {item.type === 'command' ? '⚡' : '🎯'}
                </div>
                <div>
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-gray-400 text-sm">{item.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-sm">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex space-x-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onExport}
              disabled={selectedItems.length === 0}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              Export Selected
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
