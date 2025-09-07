import React, { useState, useCallback } from "react";
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Panel
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: 'trigger-1',
    type: 'input',
    position: { x: 250, y: 25 },
    data: { label: 'Slash Command Trigger' },
    style: { background: '#f59e0b', color: 'white' }
  }
];

const initialEdges = [];

const blockTypes = {
  options: [
    { type: 'text', label: 'Text Option', desc: 'A plain text option', color: '#8b5cf6' },
    { type: 'number', label: 'Number Option', desc: 'A number option', color: '#8b5cf6' },
    { type: 'user', label: 'User Option', desc: 'Select a member from the server', color: '#8b5cf6' },
    { type: 'channel', label: 'Channel Option', desc: 'Select a channel from the server', color: '#8b5cf6' },
    { type: 'role', label: 'Role Option', desc: 'Select a role from the server', color: '#8b5cf6' },
    { type: 'choice', label: 'Choice Option', desc: 'A true or false option', color: '#8b5cf6' },
    { type: 'attachment', label: 'Attachment Option', desc: 'An attachment option', color: '#8b5cf6' }
  ],
  actions: [
    { type: 'send-message', label: 'Send or Edit a Message', desc: 'Send or edit a message with optional buttons and select menus', color: '#3b82f6' },
    { type: 'plain-reply', label: 'Plain Text Reply', desc: 'Bot replies with a plain text response', color: '#3b82f6' },
    { type: 'embed-reply', label: 'Embed Reply', desc: 'Bot replies with an embed response', color: '#3b82f6' },
    { type: 'random-reply', label: 'Random Reply', desc: 'Bot responds with a random response', color: '#3b82f6' },
    { type: 'send-channel', label: 'Send a message to a Channel', desc: 'Bot sends a message to a specific channel', color: '#3b82f6' },
    { type: 'direct-message', label: 'Direct Message a User', desc: 'Bot sends a direct message to a member', color: '#3b82f6' },
    { type: 'add-role', label: 'Add Roles', desc: 'Adds one or more roles to a user', color: '#3b82f6' },
    { type: 'remove-role', label: 'Remove Role', desc: 'Remove a role from a user', color: '#3b82f6' },
    { type: 'kick-member', label: 'Kick Member', desc: 'Kick a member from the server', color: '#3b82f6' },
    { type: 'ban-member', label: 'Ban Member', desc: 'Ban a member from the server', color: '#3b82f6' },
    { type: 'react-message', label: 'React to a Message', desc: 'React to a message', color: '#3b82f6' }
  ],
  conditions: [
    { type: 'comparison', label: 'Comparison Condition', desc: 'Run actions based on the difference between two values', color: '#10b981' },
    { type: 'permissions', label: 'Permissions Condition', desc: 'Run actions based on the server permissions of a user', color: '#10b981' },
    { type: 'chance', label: 'Chance Condition', desc: 'Set a percent chance for actions to run', color: '#10b981' },
    { type: 'channel', label: 'Channel Condition', desc: 'Run actions based on the channel the command was used in', color: '#10b981' },
    { type: 'role', label: 'Role Condition', desc: 'Run actions based on the roles of the user', color: '#10b981' },
    { type: 'user', label: 'User Condition', desc: 'Run actions based on who triggered the event', color: '#10b981' }
  ]
};

export default function CommandBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedTab, setSelectedTab] = useState('options');
  const [commandName, setCommandName] = useState('');
  const [commandDesc, setCommandDesc] = useState('');

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const onDragStart = (event, nodeType, blockData) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('blockData', JSON.stringify(blockData));
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const blockData = JSON.parse(event.dataTransfer.getData('blockData'));

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };
      
      const newNode = {
        id: `${type}-${Date.now()}`,
        type: 'default',
        position,
        data: { 
          label: blockData.label,
          type: blockData.type,
          desc: blockData.desc
        },
        style: { 
          background: blockData.color, 
          color: 'white',
          border: `2px solid ${blockData.color}`,
          borderRadius: '8px'
        }
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const saveCommand = () => {
    if (!commandName) {
      alert('Please enter a command name');
      return;
    }
    
    const commandData = {
      name: commandName,
      description: commandDesc,
      nodes,
      edges,
      timestamp: Date.now()
    };
    
    // Save to localStorage for demo
    const savedCommands = JSON.parse(localStorage.getItem('vexryl-commands') || '[]');
    savedCommands.push(commandData);
    localStorage.setItem('vexryl-commands', JSON.stringify(savedCommands));
    
    alert('Command saved successfully!');
  };

  return (
    <div className="command-builder h-screen flex">
      {/* Left Sidebar - Block Library */}
      <div className="w-80 bg-neutral-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Blocks</h2>
          <p className="text-sm text-gray-400 mb-4">
            Drag and drop <span className="text-purple-400">Options</span>, <span className="text-blue-400">Actions</span>, and <span className="text-green-400">Conditions</span> to add them to your command.
          </p>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {Object.keys(blockTypes).map(tab => (
              <button
                key={tab}
                className={`px-3 py-2 rounded text-sm font-medium capitalize ${
                  selectedTab === tab 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-neutral-800 text-gray-400 hover:text-white'
                }`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Block List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {blockTypes[selectedTab].map((block, i) => (
              <div
                key={i}
                className="block-item p-3 bg-neutral-800 rounded-lg border border-gray-700 cursor-grab hover:bg-neutral-700 transition"
                draggable
                onDragStart={(e) => onDragStart(e, block.type, block)}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: block.color }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-white font-medium text-sm">{block.label}</div>
                    <div className="text-gray-400 text-xs">{block.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-neutral-900 border-b border-gray-800 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Command name (e.g., ban, welcome)"
              className="px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded"
              value={commandName}
              onChange={(e) => setCommandName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Command description"
              className="px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded"
              value={commandDesc}
              onChange={(e) => setCommandDesc(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Test Command</button>
            <button className="btn-primary" onClick={saveCommand}>Save Command</button>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            className="bg-neutral-800"
            fitView
          >
            <Controls className="bg-neutral-800 border border-gray-700" />
            <MiniMap className="bg-neutral-800 border border-gray-700" />
            <Background variant="dots" gap={20} size={1} color="#374151" />
            <Panel position="top-center">
              <div className="bg-neutral-900 border border-gray-800 rounded-lg p-3 text-white text-sm">
                <strong>Tip:</strong> Drag blocks from the sidebar and connect them to build your command flow
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
