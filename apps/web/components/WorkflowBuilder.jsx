import React, { useState, useCallback } from 'react';
import { getBlocksForBuilder } from './blocks/index.js';
import { BlockConfigWrapper } from './blocks/components.jsx';

const EventWorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState({
    id: '',
    name: 'New Event Workflow',
    description: '',
    type: 'event_workflow',
    blocks: [],
    connections: [],
  });
  
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [draggedBlockType, setDraggedBlockType] = useState(null);
  const [availableBlocks] = useState(getBlocksForBuilder());

  // Add a new block to the workflow
  const addBlock = useCallback((blockType, position = { x: 100, y: 100 }) => {
    // Validate: Only one trigger block per workflow
    if (blockType.category === 'flows') {
      const existingTrigger = workflow.blocks.find(block => block.category === 'flows');
      if (existingTrigger) {
        alert('Only one trigger block is allowed per workflow. Create a new workflow for additional triggers.');
        return;
      }
    }
    
    const newBlock = {
      id: `${blockType.id}_${Date.now()}`,
      type: blockType.id,
      category: blockType.category,
      name: blockType.name,
      description: blockType.description,
      position,
      config: {},
    };
    
    setWorkflow(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    
    setSelectedBlock(newBlock);
  }, [workflow.blocks]);

  // Update block configuration
  const updateBlockConfig = useCallback((blockId, config) => {
    setWorkflow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === blockId ? { ...block, config } : block
      ),
    }));
  }, []);

  // Remove a block from the workflow
  const removeBlock = useCallback((blockId) => {
    setWorkflow(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId),
      connections: prev.connections.filter(
        conn => conn.from !== blockId && conn.to !== blockId
      ),
    }));
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Connect two blocks
  const connectBlocks = useCallback((fromBlockId, toBlockId) => {
    const connection = {
      id: `${fromBlockId}_to_${toBlockId}`,
      from: fromBlockId,
      to: toBlockId,
    };
    
    setWorkflow(prev => ({
      ...prev,
      connections: [...prev.connections, connection],
    }));
  }, []);

  // Export workflow to JSON
  const exportWorkflow = useCallback(() => {
    const exportData = {
      ...workflow,
      version: '1.0',
      createdAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [workflow]);

  // Import workflow from JSON
  const importWorkflow = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedWorkflow = JSON.parse(e.target.result);
        setWorkflow(importedWorkflow);
        setSelectedBlock(null);
      } catch (error) {
        alert('Error importing workflow: Invalid JSON file');
      }
    };
    reader.readAsText(file);
  }, []);

  const blocksByCategory = availableBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {});

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Block Palette */}
      <div className="w-80 bg-white shadow-lg overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Event Blocks</h2>
          <p className="text-sm text-gray-600">Drag blocks to create event-driven workflows</p>
        </div>
        
        {Object.entries(blocksByCategory).map(([category, blocks]) => (
          <div key={category} className="p-4 border-b">
            <h3 className="font-medium text-gray-800 mb-3 flex items-center">
              <span className="mr-2">{blocks[0]?.categoryInfo?.icon}</span>
              {blocks[0]?.categoryInfo?.name}
            </h3>
            <div className="space-y-2">
              {blocks.map(block => (
                <div
                  key={block.id}
                  draggable
                  onDragStart={() => setDraggedBlockType(block)}
                  className="p-3 bg-gray-50 rounded-md cursor-move hover:bg-gray-100 transition-colors"
                >
                  <div className="font-medium text-sm text-gray-900">{block.name}</div>
                  <div className="text-xs text-gray-600">{block.description}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white shadow-sm border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={workflow.name}
              onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
              className="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
            />
            
            {/* Workflow Status */}
            <div className="flex items-center space-x-2">
              {workflow.blocks.find(block => block.category === 'flows') ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                  Has Trigger
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></span>
                  Needs Trigger
                </span>
              )}
              <span className="text-sm text-gray-500">
                {workflow.blocks.length} blocks
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={exportWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
            <label className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={importWorkflow}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          className="flex-1 relative bg-gray-50 overflow-auto"
          onDrop={(e) => {
            e.preventDefault();
            if (draggedBlockType) {
              const rect = e.currentTarget.getBoundingClientRect();
              const position = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
              };
              addBlock(draggedBlockType, position);
              setDraggedBlockType(null);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(#e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Workflow Blocks */}
          {workflow.blocks.map(block => (
            <div
              key={block.id}
              className={`absolute p-4 bg-white rounded-lg shadow-md border-2 cursor-move ${
                selectedBlock?.id === block.id 
                  ? 'border-blue-500 ring-2 ring-blue-200' 
                  : 'border-gray-200'
              }`}
              style={{
                left: block.position.x,
                top: block.position.y,
                minWidth: '200px',
              }}
              onClick={() => setSelectedBlock(block)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm text-gray-900">{block.name}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeBlock(block.id);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-gray-600">{block.description}</div>
              <div className={`mt-2 px-2 py-1 text-xs rounded-full inline-block ${
                block.category === 'flows' ? 'bg-blue-100 text-blue-800' :
                block.category === 'actions' ? 'bg-green-100 text-green-800' :
                block.category === 'conditions' ? 'bg-yellow-100 text-yellow-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {block.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedBlock && (
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Configure Block</h3>
          </div>
          
          <BlockConfigWrapper
            block={selectedBlock}
            config={selectedBlock.config}
            onChange={(config) => updateBlockConfig(selectedBlock.id, config)}
          />
        </div>
      )}
    </div>
  );
};

export default EventWorkflowBuilder;
