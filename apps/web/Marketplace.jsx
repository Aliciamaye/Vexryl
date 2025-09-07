import React, { useState, useEffect } from "react";
import { useAuth } from "./hooks/useAuth";
import { useToast } from "./stores/ToastStore";
import { useNavigate } from "react-router-dom";
import { Search, Download, Star, Clock, Filter, SortDesc, Upload, Eye, Code, Zap, Bot } from "lucide-react";
import MarketplaceDetail from "./components/MarketplaceDetail";
import LoadingSpinner from "./components/LoadingSpinner";

export default function Marketplace() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("popular");
  const [selectedItem, setSelectedItem] = useState(null);
  
  useEffect(() => {
    fetchMarketplaceItems();
  }, [filter, sort]);
  
  const fetchMarketplaceItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/marketplace?filter=${filter}&sort=${sort}`);
      if (!response.ok) {
        throw new Error('Failed to fetch marketplace items');
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      console.error('Error fetching marketplace items:', err);
      error('Failed to load marketplace items');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleImport = async (item) => {
    try {
      if (item.type === 'command') {
        // Navigate to command builder with imported data
        navigate('/dashboard', { 
          state: { 
            view: 'commands', 
            importData: item.data 
          } 
        });
      } else if (item.type === 'event') {
        // Navigate to event builder with imported data
        navigate('/dashboard', { 
          state: { 
            view: 'events', 
            importData: item.data 
          } 
        });
      } else if (item.type === 'flow') {
        // Navigate to visual builder with imported data
        navigate('/dashboard', { 
          state: { 
            view: 'visual-builder', 
            importData: item.data 
          } 
        });
      }
      
      success(`Successfully imported ${item.name}`);
    } catch (err) {
      console.error('Error importing item:', err);
      error('Failed to import item');
    }
  };
  
  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.description.toLowerCase().includes(search.toLowerCase()) ||
    (i.tags && i.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())))
  );

  const getTypeIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'command': return <Code className="h-4 w-4" />;
      case 'event': return <Zap className="h-4 w-4" />;
      case 'flow': return <Eye className="h-4 w-4" />;
      case 'module': return <Bot className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
    }
  };

  return (
    <div className="marketplace-bg min-h-screen p-8 flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search marketplace..."
              className="marketplace-search pl-10 px-4 py-2 rounded-lg bg-neutral-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <select 
              className="px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="command">Commands</option>
              <option value="event">Events</option>
              <option value="flow">Flows</option>
              <option value="module">Modules</option>
            </select>
            
            <select 
              className="px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400"
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              <option value="popular">Most Popular</option>
              <option value="recent">Most Recent</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </header>
      
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 animate-fade-in">
          <div className="text-2xl font-bold text-gray-400 mb-4">No items found</div>
          <div className="text-gray-500 mb-6">
            {search ? 'Try a different search term or filter.' : 'Marketplace is empty. Be the first to upload and share your build!'}
          </div>
          <button 
            className="btn-primary flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-all shadow-lg hover:shadow-xl"
            onClick={() => navigate('/dashboard')}
          >
            <Upload className="h-5 w-5" />
            Create & Share Your Build
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
          {filtered.map((item) => (
            <MarketplaceItem 
              key={item.id} 
              item={item} 
              onView={() => setSelectedItem(item)}
              onImport={() => handleImport(item)}
              getTypeIcon={getTypeIcon}
            />
          ))}
        </div>
      )}
      
      {/* Item detail modal */}
      {selectedItem && (
        <MarketplaceDetail 
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onImport={() => {
            handleImport(selectedItem);
            setSelectedItem(null);
          }}
          getTypeIcon={getTypeIcon}
        />
      )}
    </div>
  );
}

function MarketplaceItem({ item, onView, onImport, getTypeIcon }) {
  const { name, description, type, downloads, rating, tags, user, featured, created_at } = item;
  
  // Calculate time ago for display
  const getTimeAgo = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} day${days !== 1 ? 's' : ''} ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
  };
  
  const isNew = new Date(created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days
  
  return (
    <div className="marketplace-item bg-neutral-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-3 shadow-lg hover:shadow-xl transition relative card-hover animate-scale-in">
      <div className="absolute top-4 right-4 flex items-center gap-1">
        {featured && <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full">Featured</span>}
        {isNew && <span className="px-2 py-0.5 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full">New</span>}
      </div>
      
      <div className="flex items-center justify-center h-14 w-14 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-full mb-2">
        {getTypeIcon(type)}
      </div>
      
      <div className="text-lg font-bold text-white">{name}</div>
      
      <div className="text-gray-300 text-center text-sm line-clamp-2 h-10 mb-1">
        {description}
      </div>
      
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-400" />
          <span>{rating || '0.0'}</span>
        </div>
        <div className="flex items-center gap-1">
          <Download className="h-3 w-3" />
          <span>{downloads || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span>{getTimeAgo(created_at)}</span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1 justify-center">
        {tags && tags.slice(0, 3).map((tag, i) => (
          <span key={i} className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-full">{tag}</span>
        ))}
        {tags && tags.length > 3 && (
          <span className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded-full">+{tags.length - 3}</span>
        )}
      </div>
      
      <div className="text-xs flex items-center gap-1 text-cyan-400 font-semibold mt-2">
        {getTypeIcon(type)}
        <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
      </div>
      
      <div className="flex gap-2 mt-3 w-full">
        <button 
          onClick={onView}
          className="flex-1 py-2 px-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button 
          onClick={onImport}
          className="flex-1 py-2 px-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
        >
          <Download className="h-4 w-4" />
          Import
        </button>
      </div>
    </div>
  );
}
