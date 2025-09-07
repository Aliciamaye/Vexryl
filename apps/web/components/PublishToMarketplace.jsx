import React, { useState } from 'react';
import { X, Upload, Eye, Star, Tag, ArrowRight, CheckCircle } from 'lucide-react';

const PublishToMarketplace = ({ item, type, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const [formData, setFormData] = useState({
    name: item?.name || '',
    description: item?.description || '',
    tags: [],
    isPublic: true,
    currentTag: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const addTag = () => {
    if (formData.currentTag.trim() && !formData.tags.includes(formData.currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.currentTag.trim()],
        currentTag: ''
      }));
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const handlePublish = async () => {
    setIsPublishing(true);
    
    try {
      const payload = {
        type: type.toLowerCase(), // 'command' or 'event'
        name: formData.name,
        description: formData.description,
        tags: formData.tags,
        is_public: formData.isPublic,
        data: item.data // The actual command/event configuration
      };
      
      const response = await fetch('/api/marketplace', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        throw new Error('Failed to publish item');
      }
      
      setStep(3); // Success step
      onSuccess?.();
    } catch (error) {
      console.error('Error publishing to marketplace:', error);
      // Display error message
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-xl animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            Publish {type} to Marketplace
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Step indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map(num => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= num
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-full h-1 mx-1 ${
                    step > num ? 'bg-blue-600' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Give your item a clear, descriptive name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe what your item does and how it can be used"
                />
              </div>
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.name || !formData.description}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Tags and Visibility */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Tags
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    name="currentTag"
                    value={formData.currentTag}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add tags (press Enter)"
                  />
                  <button
                    onClick={addTag}
                    disabled={!formData.currentTag.trim()}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Tag size={16} />
                  </button>
                </div>
                
                {/* Tags display */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="flex items-center gap-1 px-2 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm"
                    >
                      <span>{tag}</span>
                      <button 
                        onClick={() => removeTag(tag)}
                        className="text-blue-300 hover:text-white transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Preview
                </label>
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="text-lg font-bold text-white mb-2">{formData.name}</div>
                  <div className="text-gray-400 text-sm mb-3">{formData.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-blue-600/30 text-blue-300 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                    {formData.tags.length === 0 && (
                      <span className="text-gray-500 text-xs">No tags added</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 flex justify-between">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Back
                </button>
                
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isPublishing ? 'Publishing...' : 'Publish'}
                  <Upload size={16} />
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Success */}
          {step === 3 && (
            <div className="flex flex-col items-center py-8">
              <div className="text-green-400 mb-4">
                <CheckCircle size={64} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Successfully Published!
              </h3>
              <p className="text-gray-400 text-center mb-6">
                Your {type.toLowerCase()} has been published to the marketplace and is now available to the community.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublishToMarketplace;
