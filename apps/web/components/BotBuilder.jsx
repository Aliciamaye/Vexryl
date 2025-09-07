import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  ConnectionMode,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Command, 
  Settings, 
  Users, 
  Share, 
  Save, 
  Play, 
  Download, 
  Upload,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  GitBranch,
  MessageSquare,
  Zap,
  Filter,
  Plus,
  Search
} from 'lucide-react';

import BlockLibrary from './BlockLibrary';
import BlockConfigPanel from './BlockConfigPanel';
import TeamCollaboration from './TeamCollaboration';
import MarketplaceIntegration from './MarketplaceIntegration';
import CodeGenerator from './CodeGenerator';
import VariableManager from './VariableManager';
import DeploymentManager from './DeploymentManager';

// Custom node types for different block categories
import CommandNode from './nodes/CommandNode';
import ConditionNode from './nodes/ConditionNode';
import ActionNode from './nodes/ActionNode';
import EventNode from './nodes/EventNode';

const nodeTypes = {
  command: CommandNode,
  condition: ConditionNode,
  action: ActionNode,
  event: EventNode
};

const BotBuilder = () => {
  // Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // UI state
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('commands');
  const [showLibrary, setShowLibrary] = useState(true);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [showTeamPanel, setShowTeamPanel] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [showVariables, setShowVariables] = useState(false);
  const [showCodeGenerator, setShowCodeGenerator] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);

  // Bot data
  const [botData, setBotData] = useState({
    id: 'bot_' + Date.now(),
    name: 'My Discord Bot',
    description: 'Created with Vexryl',
    commands: [],
    events: [],
    variables: {},
    settings: {},
    team: [],
    version: '1.0.0'
  });

  // Real-time collaboration
  const [collaborators, setCollaborators] = useState([]);
  const [isOnline, setIsOnline] = useState(true);

  // Initialize default nodes
  useEffect(() => {
    const defaultNodes = [
      {
        id: 'start',
        type: 'event',
        position: { x: 100, y: 100 },
        data: {
          label: 'Bot Ready',
          eventType: 'ready',
          description: 'Triggered when bot starts',
          config: {}
        }
      }
    ];
    setNodes(defaultNodes);
  }, [setNodes]);

  const onConnect = useCallback(
    (params) => {
      const edge = {
        ...params,
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        }
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const blockData = JSON.parse(event.dataTransfer.getData('application/reactflow'));

      if (typeof blockData === 'undefined' || !blockData) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode = {
        id: `${blockData.type}_${Date.now()}`,
        type: blockData.category,
        position,
        data: {
          ...blockData,
          config: { ...blockData.defaultConfig }
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowConfigPanel(true);
  }, []);

  const onSelectionChange = useCallback((elements) => {
    if (elements.nodes && elements.nodes.length === 1) {
      setSelectedNode(elements.nodes[0]);
      setShowConfigPanel(true);
    } else {
      setSelectedNode(null);
      setShowConfigPanel(false);
    }
  }, []);

  const updateNodeConfig = useCallback((nodeId, newConfig) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, config: newConfig } }
          : node
      )
    );
  }, [setNodes]);

  const deleteSelectedNode = useCallback(() => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id));
      setEdges((eds) => eds.filter((edge) => 
        edge.source !== selectedNode.id && edge.target !== selectedNode.id
      ));
      setSelectedNode(null);
      setShowConfigPanel(false);
    }
  }, [selectedNode, setNodes, setEdges]);

  const duplicateSelectedNode = useCallback(() => {
    if (selectedNode) {
      const newNode = {
        ...selectedNode,
        id: `${selectedNode.data.type}_${Date.now()}`,
        position: {
          x: selectedNode.position.x + 50,
          y: selectedNode.position.y + 50
        }
      };
      setNodes((nds) => nds.concat(newNode));
    }
  }, [selectedNode, setNodes]);

  const saveBotData = useCallback(async () => {
    const botDataToSave = {
      ...botData,
      nodes,
      edges,
      lastModified: new Date().toISOString()
    };

    // Save to localStorage for demo
    localStorage.setItem(`vexryl-bot-${botData.id}`, JSON.stringify(botDataToSave));
    
    // TODO: Save to actual backend
    console.log('Bot saved:', botDataToSave);
  }, [botData, nodes, edges]);

  const deployBot = useCallback(async () => {
    setShowDeployment(true);
  }, []);

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      {/* Left Sidebar - Block Library */}
      <div className={`bg-gray-800 border-r border-gray-700 transition-all duration-300 ${
        showLibrary ? 'w-80' : 'w-12'
      }`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className={`font-semibold ${showLibrary ? 'block' : 'hidden'}`}>
              Block Library
            </h2>
            <button
              onClick={() => setShowLibrary(!showLibrary)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {showLibrary ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {showLibrary && (
          <>
            {/* Category Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                onClick={() => setActiveTab('commands')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'commands'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Command className="w-4 h-4 mx-auto mb-1" />
                Commands
              </button>
              <button
                onClick={() => setActiveTab('conditions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'conditions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4 mx-auto mb-1" />
                Conditions
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'actions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Zap className="w-4 h-4 mx-auto mb-1" />
                Actions
              </button>
            </div>

            {/* Block Library Component */}
            <BlockLibrary 
              activeTab={activeTab}
              onBlockDrag={(blockData) => {
                // Block drag handling is done in onDrop
              }}
            />
          </>
        )}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar */}
        <div className="bg-gray-800 border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{botData.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <GitBranch className="w-4 h-4" />
                <span>v{botData.version}</span>
                {isOnline && (
                  <div className="flex items-center gap-1 text-green-400">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span>Online</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Variables"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowTeamPanel(!showTeamPanel)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Team Collaboration"
              >
                <Users className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowMarketplace(!showMarketplace)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Marketplace"
              >
                <Share className="w-5 h-5" />
              </button>

              <button
                onClick={() => setShowCodeGenerator(!showCodeGenerator)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                title="Code Generator"
              >
                <Play className="w-5 h-5" />
              </button>

              <div className="w-px h-6 bg-gray-600" />

              <button
                onClick={saveBotData}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={deployBot}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                Deploy
              </button>
            </div>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlowProvider>
            <div ref={reactFlowWrapper} className="w-full h-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onSelectionChange={onSelectionChange}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                defaultViewport={{ x: 0, y: 0, zoom: 1 }}
                className="bg-gray-900"
              >
                <Background color="#374151" />
                <Controls className="bg-gray-800 border border-gray-700" />
                <MiniMap 
                  className="bg-gray-800 border border-gray-700"
                  nodeColor="#4F46E5"
                />
                
                {/* Canvas Controls */}
                <Panel position="top-right" className="space-y-2">
                  {selectedNode && (
                    <div className="bg-gray-800 border border-gray-700 rounded-lg p-2 space-y-2">
                      <button
                        onClick={duplicateSelectedNode}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Duplicate
                      </button>
                      <button
                        onClick={deleteSelectedNode}
                        className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </Panel>
              </ReactFlow>
            </div>
          </ReactFlowProvider>
        </div>
      </div>

      {/* Right Sidebar - Configuration Panel */}
      {showConfigPanel && selectedNode && (
        <div className="w-80 bg-gray-800 border-l border-gray-700">
          <BlockConfigPanel
            node={selectedNode}
            onConfigChange={(config) => updateNodeConfig(selectedNode.id, config)}
            onClose={() => setShowConfigPanel(false)}
          />
        </div>
      )}

      {/* Modals and Overlays */}
      {showVariables && (
        <VariableManager
          variables={botData.variables}
          onVariablesChange={(variables) => setBotData(prev => ({ ...prev, variables }))}
          onClose={() => setShowVariables(false)}
        />
      )}

      {showTeamPanel && (
        <TeamCollaboration
          botData={botData}
          collaborators={collaborators}
          onTeamChange={(team) => setBotData(prev => ({ ...prev, team }))}
          onClose={() => setShowTeamPanel(false)}
        />
      )}

      {showMarketplace && (
        <MarketplaceIntegration
          botData={botData}
          nodes={nodes}
          onClose={() => setShowMarketplace(false)}
        />
      )}

      {showCodeGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Discord.js Code Generator</h2>
              <button
                onClick={() => setShowCodeGenerator(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <CodeGenerator 
                nodes={nodes} 
                edges={edges} 
                variables={botData.variables || []} 
              />
            </div>
          </div>
        </div>
      )}

      {showDeployment && (
        <DeploymentManager
          botData={botData}
          onClose={() => setShowDeployment(false)}
        />
      )}
    </div>
  );
};

export default BotBuilder;
