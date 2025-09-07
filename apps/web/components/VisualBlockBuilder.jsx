import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '../stores/ToastStore';
import { 
  MessageSquare, 
  Zap, 
  Users, 
  Shield, 
  Database, 
  Code,
  Play,
  Save,
  Download,
  Upload
} from 'lucide-react';

// Custom node types
const blockTypes = {
  trigger: {
    icon: Zap,
    color: 'bg-green-500',
    category: 'Triggers',
    blocks: [
      { id: 'message', label: 'On Message', description: 'Triggers when a message is sent' },
      { id: 'reaction', label: 'On Reaction', description: 'Triggers when a reaction is added' },
      { id: 'member_join', label: 'Member Join', description: 'Triggers when someone joins' },
      { id: 'button_click', label: 'Button Click', description: 'Triggers when a button is clicked' }
    ]
  },
  action: {
    icon: MessageSquare,
    color: 'bg-blue-500',
    category: 'Actions',
    blocks: [
      { id: 'send_message', label: 'Send Message', description: 'Send a message to a channel' },
      { id: 'dm_user', label: 'DM User', description: 'Send a direct message' },
      { id: 'add_role', label: 'Add Role', description: 'Give a role to a user' },
      { id: 'kick_user', label: 'Kick User', description: 'Remove user from server' }
    ]
  },
  condition: {
    icon: Shield,
    color: 'bg-yellow-500',
    category: 'Conditions',
    blocks: [
      { id: 'if_contains', label: 'If Contains', description: 'Check if text contains something' },
      { id: 'if_role', label: 'If Has Role', description: 'Check if user has a role' },
      { id: 'if_permission', label: 'If Permission', description: 'Check user permissions' },
      { id: 'if_channel', label: 'If Channel', description: 'Check specific channel' }
    ]
  },
  data: {
    icon: Database,
    color: 'bg-purple-500',
    category: 'Data',
    blocks: [
      { id: 'store_data', label: 'Store Data', description: 'Save data to database' },
      { id: 'load_data', label: 'Load Data', description: 'Load data from database' },
      { id: 'set_variable', label: 'Set Variable', description: 'Set a variable value' },
      { id: 'get_user_info', label: 'Get User Info', description: 'Get user information' }
    ]
  },
  utility: {
    icon: Code,
    color: 'bg-gray-500',
    category: 'Utilities',
    blocks: [
      { id: 'wait', label: 'Wait', description: 'Wait for specified time' },
      { id: 'random', label: 'Random', description: 'Generate random value' },
      { id: 'webhook', label: 'Webhook', description: 'Send webhook request' },
      { id: 'log', label: 'Log', description: 'Log information for debugging' }
    ]
  }
};

// Custom Node Component
const CustomNode = ({ data, selected }) => {
  const blockInfo = Object.values(blockTypes)
    .flatMap(type => type.blocks)
    .find(block => block.id === data.blockType);
  
  const typeInfo = Object.values(blockTypes)
    .find(type => type.blocks.some(block => block.id === data.blockType));

  const Icon = typeInfo?.icon || Code;

  return (
    <div className={`px-4 py-2 shadow-md rounded-md bg-white border-2 ${
      selected ? 'border-blue-500' : 'border-gray-200'
    } min-w-[150px]`}>
      <div className="flex items-center">
        <div className={`rounded-full p-1 ${typeInfo?.color || 'bg-gray-500'} mr-2`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label || blockInfo?.label}</div>
          <div className="text-gray-500 text-xs">{blockInfo?.description}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  custom: CustomNode,
};

const VisualBlockBuilder = ({ workflow, onSave }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.edges || []);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [workflowName, setWorkflowName] = useState(workflow?.name || 'New Workflow');
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { toast } = { toast: (message) => console.log(message) }; // Temporary placeholder

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      
      const blockType = event.dataTransfer.getData('application/reactflow');
      const blockInfo = Object.values(blockTypes)
        .flatMap(type => type.blocks)
        .find(block => block.id === blockType);

      if (!blockInfo) return;

      const position = {
        x: event.clientX - event.currentTarget.getBoundingClientRect().left,
        y: event.clientY - event.currentTarget.getBoundingClientRect().top,
      };

      const newNode = {
        id: `${blockType}_${Date.now()}`,
        type: 'custom',
        position,
        data: { 
          label: blockInfo.label,
          blockType: blockType,
          config: {}
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragStart = (event, blockType) => {
    event.dataTransfer.setData('application/reactflow', blockType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const executeWorkflow = async () => {
    if (nodes.length === 0) {
      toast.error('Add some blocks to test the workflow');
      return;
    }

    setIsExecuting(true);
    try {
      const response = await fetch('/api/workflows/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nodes,
          edges,
          test: true
        })
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success('Workflow executed successfully!');
      } else {
        toast.error(`Execution failed: ${result.error}`);
      }
    } catch (error) {
      toast.error(`Failed to execute workflow: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const saveWorkflow = async () => {
    try {
      const workflowData = {
        name: workflowName,
        nodes,
        edges,
        description: 'Visual workflow created with block builder'
      };

      await onSave(workflowData);
      toast.success('Workflow saved successfully!');
    } catch (error) {
      toast.error(`Failed to save workflow: ${error.message}`);
    }
  };

  const exportWorkflow = () => {
    const workflowData = {
      name: workflowName,
      nodes,
      edges,
      version: '1.0'
    };

    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflowName.replace(/\s+/g, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importWorkflow = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        setWorkflowName(data.name || 'Imported Workflow');
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
        toast.success('Workflow imported successfully!');
      } catch (error) {
        toast.error('Failed to import workflow: Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-screen flex">
      {/* Block Palette */}
      <div className="w-80 bg-gray-50 border-r overflow-y-auto">
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-4">Block Palette</h3>
          
          {Object.entries(blockTypes).map(([typeKey, type]) => (
            <div key={typeKey} className="mb-6">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                <type.icon className="w-4 h-4" />
                {type.category}
              </h4>
              <div className="space-y-2">
                {type.blocks.map((block) => (
                  <div
                    key={block.id}
                    className="p-3 bg-white rounded border cursor-move hover:bg-gray-50 transition-colors"
                    draggable
                    onDragStart={(event) => onDragStart(event, block.id)}
                  >
                    <div className="font-medium text-sm">{block.label}</div>
                    <div className="text-xs text-gray-500">{block.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <Label>Workflow Name</Label>
              <Input
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="file"
              accept=".json"
              onChange={importWorkflow}
              className="hidden"
              id="import-workflow"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById('import-workflow').click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportWorkflow}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={executeWorkflow}
              disabled={isExecuting}
            >
              <Play className="w-4 h-4 mr-2" />
              {isExecuting ? 'Testing...' : 'Test'}
            </Button>
            
            <Button size="sm" onClick={saveWorkflow}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* ReactFlow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background variant="dots" gap={12} size={1} />
            
            <Panel position="top-left">
              <div className="bg-white p-2 rounded shadow text-sm">
                <div className="font-medium">Instructions:</div>
                <div>• Drag blocks from the palette to build your workflow</div>
                <div>• Connect blocks by dragging from output to input</div>
                <div>• Click a block to configure its properties</div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>

      {/* Properties Panel */}
      {selectedNode && (
        <div className="w-80 bg-gray-50 border-l p-4 overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle>Block Properties</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Block Type</Label>
                  <Input value={selectedNode.data.blockType} readOnly />
                </div>
                
                <div>
                  <Label>Label</Label>
                  <Input
                    value={selectedNode.data.label}
                    onChange={(e) => {
                      setNodes((nds) =>
                        nds.map((node) =>
                          node.id === selectedNode.id
                            ? { ...node, data: { ...node.data, label: e.target.value } }
                            : node
                        )
                      );
                    }}
                  />
                </div>

                {/* Add specific configuration options based on block type */}
                <div className="text-sm text-gray-500">
                  Block-specific configuration options will appear here based on the selected block type.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default VisualBlockBuilder;
