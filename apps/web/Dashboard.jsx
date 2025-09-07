import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useDiscordBot } from "./stores/DiscordBotStore";
import { useToast } from "./stores/ToastStore";
import { useLocation } from "react-router-dom";
import LoadingSpinner from "./components/LoadingSpinner";
import BotSetupWizard from "./components/BotSetupWizard";
import VisualBlockBuilder from "./components/VisualBlockBuilder";
import BotSwitcher from "./components/BotSwitcher";
import PublishToMarketplace from "./components/PublishToMarketplace";
import { 
  Bot, 
  Settings, 
  Activity, 
  Code, 
  Users, 
  LogOut,
  Plus,
  Server,
  Zap,
  Eye,
  GitBranch,
  Upload,
  Download,
  Package,
  Trash
} from "lucide-react";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { currentBot, bots, isConnected } = useDiscordBot();
  const { success, error } = useToast();
  const location = useLocation();
  const [currentView, setCurrentView] = useState('overview');
  const [loading, setLoading] = useState(false);
  const [userCommands, setUserCommands] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [showBotSetup, setShowBotSetup] = useState(false);
  const [currentWorkflow, setCurrentWorkflow] = useState(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [itemToPublish, setItemToPublish] = useState(null);
  const [publishType, setPublishType] = useState(null);

  // Check for imported data from marketplace
  useEffect(() => {
    if (location.state?.view && location.state?.importData) {
      setCurrentView(location.state.view);
      // Handle the imported data based on view type
      if (location.state.view === 'commands') {
        // Set command data
      } else if (location.state.view === 'events') {
        // Set event data
      } else if (location.state.view === 'visual-builder') {
        setCurrentWorkflow(location.state.importData);
      }
      
      // Clear the location state to prevent re-applying on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  const handlePublishItem = (item, type) => {
    setItemToPublish(item);
    setPublishType(type);
    setShowPublishModal(true);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'overview':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Commands</h3>
                <p className="text-3xl font-bold text-blue-400">{userCommands.length}</p>
                <p className="text-gray-400">Created commands</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Events</h3>
                <p className="text-3xl font-bold text-green-400">{userEvents.length}</p>
                <p className="text-gray-400">Active workflows</p>
              </div>
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">Status</h3>
                <p className={`text-3xl font-bold ${isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                  {isConnected ? 'Connected' : 'Offline'}
                </p>
                <p className="text-gray-400">Bot status</p>
              </div>
            </div>
          </div>
        );
      case 'commands':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Commands</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Your Discord commands will appear here.</p>
              <button 
                onClick={() => setCurrentView('builder')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
              >
                Create First Command
              </button>
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Events</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400">Your Discord event workflows will appear here.</p>
              <button 
                onClick={() => setCurrentView('builder')}
                className="mt-4 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition-colors"
              >
                Create First Event
              </button>
            </div>
          </div>
        );
      case 'builder':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Bot Builder</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-400 mb-4">Visual bot builder coming soon!</p>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => setCurrentView('commands')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg transition-colors text-left"
                >
                  <Code className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold">Slash Commands</h3>
                  <p className="text-sm text-gray-300">Create interactive commands</p>
                </button>
                <button 
                  onClick={() => setCurrentView('events')}
                  className="bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg transition-colors text-left"
                >
                  <Bot className="w-8 h-8 mb-2" />
                  <h3 className="font-semibold">Event Workflows</h3>
                  <p className="text-sm text-gray-300">Automate bot responses</p>
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Settings</h2>
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Bot Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Bot Token</label>
                  <input 
                    type="password" 
                    placeholder="Enter your Discord bot token..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Server ID</label>
                  <input 
                    type="text" 
                    placeholder="Enter your Discord server ID..."
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        );
      case 'visual-builder':
        return (
          <div className="h-screen">
            <VisualBlockBuilder 
              workflow={currentWorkflow}
              onSave={async (workflowData) => {
                try {
                  const response = await fetch('/api/workflows', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(workflowData)
                  });
                  
                  if (response.ok) {
                    success('Workflow saved successfully!');
                  } else {
                    error('Failed to save workflow');
                  }
                } catch (err) {
                  error('Error saving workflow: ' + err.message);
                }
              }}
            />
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
            <p className="text-gray-400">The requested view could not be found.</p>
          </div>
        );
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
              <h1 className="text-xl font-bold">Vexryl Dashboard</h1>
              <p className="text-sm text-gray-400">Welcome back, {user?.email || 'User'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Bot Switcher */}
            <BotSwitcher onAddBot={() => setShowBotSetup(true)} />
            
            {/* User Actions */}
            <button
              onClick={signOut}
              className="flex items-center space-x-1 px-3 py-1 text-gray-300 hover:text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setCurrentView('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span>Overview</span>
            </button>
            
            {/* Bot Setup */}
            {!currentBot && (
              <button
                onClick={() => setShowBotSetup(true)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-5 h-5" />
                <span>Setup Bot</span>
              </button>
            )}
            
            <button
              onClick={() => setCurrentView('commands')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'commands' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Code className="w-5 h-5" />
              <span>Commands</span>
              <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">
                {userCommands.length}
              </span>
            </button>
            
            <button
              onClick={() => setCurrentView('events')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'events' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Bot className="w-5 h-5" />
              <span>Events</span>
              <span className="ml-auto bg-gray-600 text-xs px-2 py-1 rounded-full">
                {userEvents.length}
              </span>
            </button>
            
            <button
              onClick={() => setCurrentView('visual-builder')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'visual-builder' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Zap className="w-5 h-5" />
              <span>Visual Builder</span>
            </button>
            
            <button
              onClick={() => setCurrentView('builder')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'builder' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Plus className="w-5 h-5" />
              <span>Create New</span>
            </button>
            
            <button
              onClick={() => setCurrentView('settings')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'settings' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
            
            <button
              onClick={() => window.location.href = '/marketplace'}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <Package className="w-5 h-5" />
              <span>Marketplace</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {renderCurrentView()}
        </main>
      </div>

      {/* Bot Setup Modal */}
      {showBotSetup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Set Up Your Discord Bot</h2>
                <button 
                  onClick={() => setShowBotSetup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6">
              <BotSetupWizard 
                onComplete={(bot) => {
                  setShowBotSetup(false);
                  success(`Bot ${bot.name} connected successfully!`);
                  // Refresh the page or update state
                  window.location.reload();
                }}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Publish to Marketplace Modal */}
      {showPublishModal && (
        <PublishToMarketplace
          item={itemToPublish}
          type={publishType}
          onClose={() => {
            setShowPublishModal(false);
            setItemToPublish(null);
            setPublishType(null);
          }}
          onSuccess={() => {
            success(`Successfully published to the marketplace!`);
          }}
        />
      )}
    </div>
  );
}
