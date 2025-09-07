import React, { useState, useCallback, useRef } from 'react';
import { getBlocksForBuilder } from '../blocks/index.js';
import { BlockConfigWrapper } from '../blocks/components.jsx';
import { eventsAPI } from '../services/database.js';

const ImprovedEventWorkflowBuilder = () => {
  const [workflow, setWorkflow] = useState({
    id: '',
    name: 'New Event Workflow',
    description: '',
    type: 'event_workflow',
    blocks: [],
    connections: [],
    executionOrder: []
  });
  
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [draggedBlockType, setDraggedBlockType] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [connecting, setConnecting] = useState(null);
  const [availableBlocks] = useState(getBlocksForBuilder());
  const canvasRef = useRef(null);

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
      inputs: blockType.category !== 'flows' ? ['input'] : [],
      outputs: ['output']
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
      executionOrder: prev.executionOrder.filter(id => id !== blockId)
    }));
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);

  // Start connecting blocks
  const startConnection = useCallback((blockId) => {
    setConnecting(blockId);
  }, []);

  // Complete connection
  const completeConnection = useCallback((toBlockId) => {
    if (connecting && connecting !== toBlockId) {
      const fromBlock = workflow.blocks.find(b => b.id === connecting);
      const toBlock = workflow.blocks.find(b => b.id === toBlockId);
      
      // Validate connection logic
      if (fromBlock.category === 'flows' && (toBlock.category === 'conditions' || toBlock.category === 'actions')) {
        // Trigger can connect to conditions or actions
      } else if (fromBlock.category === 'conditions' && toBlock.category === 'actions') {
        // Conditions can connect to actions
      } else if (fromBlock.category === 'actions' && toBlock.category === 'actions') {
        // Actions can chain to other actions
      } else {
        alert('Invalid connection! Flow should be: Trigger → Conditions → Actions');
        setConnecting(null);
        return;
      }
      
      const newConnection = {
        id: `${connecting}_to_${toBlockId}`,
        from: connecting,
        to: toBlockId,
      };
      
      setWorkflow(prev => ({
        ...prev,
        connections: [...prev.connections.filter(c => c.from !== connecting || c.to !== toBlockId), newConnection],
      }));
      
      updateExecutionOrder();
    }
    setConnecting(null);
  }, [connecting, workflow.blocks]);

  // Update execution order based on connections
  const updateExecutionOrder = useCallback(() => {
    const visited = new Set();
    const order = [];
    
    // Find trigger block (starting point)
    const triggerBlock = workflow.blocks.find(block => block.category === 'flows');
    if (!triggerBlock) return;
    
    const traverse = (blockId) => {
      if (visited.has(blockId)) return;
      visited.add(blockId);
      order.push(blockId);
      
      // Find connected blocks
      const connections = workflow.connections.filter(conn => conn.from === blockId);
      connections.forEach(conn => traverse(conn.to));
    };
    
    traverse(triggerBlock.id);
    
    setWorkflow(prev => ({
      ...prev,
      executionOrder: order
    }));
  }, [workflow.blocks, workflow.connections]);

  // Handle block drag start
  const handleBlockDragStart = useCallback((e, block) => {
    const rect = e.target.getBoundingClientRect();
    setDraggedBlock(block);
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  }, []);

  // Handle block drag
  const handleBlockDrag = useCallback((e) => {
    if (!draggedBlock || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const newPosition = {
      x: e.clientX - canvasRect.left - dragOffset.x,
      y: e.clientY - canvasRect.top - dragOffset.y
    };
    
    setWorkflow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block =>
        block.id === draggedBlock.id ? { ...block, position: newPosition } : block
      )
    }));
  }, [draggedBlock, dragOffset]);

  // Handle block drag end
  const handleBlockDragEnd = useCallback(() => {
    setDraggedBlock(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Calculate connection path
  const getConnectionPath = useCallback((fromBlock, toBlock) => {
    const fromX = fromBlock.position.x + 200; // Block width
    const fromY = fromBlock.position.y + 50; // Block height / 2
    const toX = toBlock.position.x;
    const toY = toBlock.position.y + 50;
    
    const midX = (fromX + toX) / 2;
    
    return `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`;
  }, []);

  // Save workflow to database
  const saveWorkflow = useCallback(async () => {
    if (!workflow.name.trim()) {
      alert('Please enter a workflow name before saving.');
      return;
    }
    
    setLoading(true);
    
    try {
      const workflowData = {
        ...workflow,
        updatedAt: new Date().toISOString(),
        enabled: true,
        collaborators: 0,
        executions: 0
      };
      
      if (workflow.databaseId) {
        // Update existing workflow
        await eventsAPI.update(workflow.databaseId, workflowData);
      } else {
        // Create new workflow
        const response = await eventsAPI.create(workflowData);
        setWorkflow(prev => ({ 
          ...prev, 
          databaseId: response.id,
          createdAt: response.created_at 
        }));
      }
      
      setHasUnsavedChanges(false);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [workflow]);

  // Auto-save every 30 seconds if there are changes
  const [lastSaved, setLastSaved] = useState(Date.now());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  
  React.useEffect(() => {
    if (workflow.blocks.length > 0) {
      setHasUnsavedChanges(true);
      setLastSaved(Date.now());
    }
  }, [workflow.blocks, workflow.connections, workflow.name, workflow.description]);

  React.useEffect(() => {
    if (hasUnsavedChanges && workflow.databaseId) {
      const autoSaveInterval = setInterval(async () => {
        if (Date.now() - lastSaved > 30000) { // 30 seconds
          try {
            await saveWorkflow();
            setHasUnsavedChanges(false);
          } catch (error) {
            console.error('Auto-save failed:', error);
          }
        }
      }, 5000); // Check every 5 seconds
      
      return () => clearInterval(autoSaveInterval);
    }
  }, [hasUnsavedChanges, lastSaved, saveWorkflow, workflow.databaseId]);

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

  // Validate workflow completeness
  const validateWorkflow = useCallback(() => {
    const triggerBlock = workflow.blocks.find(block => block.category === 'flows');
    if (!triggerBlock) {
      return { valid: false, message: 'Workflow needs a trigger block' };
    }
    
    const actionBlocks = workflow.blocks.filter(block => block.category === 'actions');
    if (actionBlocks.length === 0) {
      return { valid: false, message: 'Workflow needs at least one action block' };
    }
    
    // Check if all blocks are connected
    const connectedBlocks = new Set();
    connectedBlocks.add(triggerBlock.id);
    workflow.connections.forEach(conn => {
      connectedBlocks.add(conn.from);
      connectedBlocks.add(conn.to);
    });
    
    const disconnectedBlocks = workflow.blocks.filter(block => !connectedBlocks.has(block.id));
    if (disconnectedBlocks.length > 0) {
      return { valid: false, message: `Disconnected blocks: ${disconnectedBlocks.map(b => b.name).join(', ')}` };
    }
    
    return { valid: true, message: 'Workflow is complete and ready!' };
  }, [workflow]);

  const blocksByCategory = availableBlocks.reduce((acc, block) => {
    if (!acc[block.category]) {
      acc[block.category] = [];
    }
    acc[block.category].push(block);
    return acc;
  }, {});

  const validation = validateWorkflow();

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
              <span className="mr-2">
                {category === 'flows' && '⚡'}
                {category === 'conditions' && '🔀'}
                {category === 'actions' && '🎯'}
                {category === 'options' && '⚙️'}
              </span>
              {category.charAt(0).toUpperCase() + category.slice(1)}
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
              
              {/* Validation Status */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                validation.valid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {validation.valid ? '✅' : '❌'} {validation.message}
              </span>
              
              <span className="text-sm text-gray-500">
                {workflow.blocks.length} blocks • {workflow.connections.length} connections
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {connecting && (
              <span className="text-sm text-blue-600 font-medium">
                Click target block to connect
              </span>
            )}
            
            {/* Save Status Indicator */}
            {hasUnsavedChanges && (
              <span className="text-xs text-orange-600 font-medium">
                Unsaved changes
              </span>
            )}
            
            <button
              onClick={() => setConnecting(null)}
              className={`px-3 py-1 rounded text-sm ${
                connecting ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!connecting}
            >
              Cancel Connection
            </button>
            
            <button
              onClick={saveWorkflow}
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
              onClick={exportWorkflow}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div
          ref={canvasRef}
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
          onMouseMove={draggedBlock ? handleBlockDrag : undefined}
          onMouseUp={handleBlockDragEnd}
        >
          {/* Grid Background */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(#e5e7eb 1px, transparent 1px),
                linear-gradient(90deg, #e5e7eb 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
            }}
          />

          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {workflow.connections.map(connection => {
              const fromBlock = workflow.blocks.find(b => b.id === connection.from);
              const toBlock = workflow.blocks.find(b => b.id === connection.to);
              if (!fromBlock || !toBlock) return null;
              
              return (
                <path
                  key={connection.id}
                  d={getConnectionPath(fromBlock, toBlock)}
                  stroke="#3B82F6"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#3B82F6"
                />
              </marker>
            </defs>
          </svg>

          {/* Workflow Blocks */}
          {workflow.blocks.map((block, index) => (
            <div
              key={block.id}
              className={`absolute bg-white rounded-lg shadow-md border-2 cursor-move transition-all ${
                selectedBlock?.id === block.id 
                  ? 'border-blue-500 ring-2 ring-blue-200 z-20' 
                  : connecting === block.id
                  ? 'border-green-500 ring-2 ring-green-200 z-20'
                  : 'border-gray-200 z-10'
              } ${connecting && connecting !== block.id ? 'hover:border-blue-300' : ''}`}
              style={{
                left: block.position.x,
                top: block.position.y,
                width: '200px',
              }}
              onMouseDown={(e) => handleBlockDragStart(e, block)}
              onClick={(e) => {
                e.stopPropagation();
                if (connecting && connecting !== block.id) {
                  completeConnection(block.id);
                } else {
                  setSelectedBlock(block);
                }
              }}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-sm text-gray-900">{block.name}</div>
                  <div className="flex items-center space-x-1">
                    {/* Connect button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startConnection(block.id);
                      }}
                      className="text-blue-500 hover:text-blue-700 text-xs"
                      title="Connect to another block"
                    >
                      🔗
                    </button>
                    {/* Remove button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBlock(block.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      ×
                    </button>
                  </div>
                </div>
                
                <div className="text-xs text-gray-600 mb-2">{block.description}</div>
                
                <div className="flex items-center justify-between">
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    block.category === 'flows' ? 'bg-blue-100 text-blue-800' :
                    block.category === 'actions' ? 'bg-green-100 text-green-800' :
                    block.category === 'conditions' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {block.category}
                  </div>
                  
                  {/* Execution Order */}
                  {workflow.executionOrder.includes(block.id) && (
                    <div className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                      #{workflow.executionOrder.indexOf(block.id) + 1}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Help Text */}
          {workflow.blocks.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-lg font-medium mb-2">Start building your workflow</h3>
                <p className="text-sm">Drag a trigger block from the left panel to begin</p>
                <p className="text-xs mt-1">Flow: Trigger → Conditions → Actions</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Configuration Panel */}
      {selectedBlock && (
        <div className="w-96 bg-white shadow-lg overflow-y-auto">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Configure Block</h3>
            <p className="text-sm text-gray-600">{selectedBlock.name}</p>
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

export default ImprovedEventWorkflowBuilder;
