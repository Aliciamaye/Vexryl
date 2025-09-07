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
    data: { label: 'Member Join Event' },
    style: { background: '#f59e0b', color: 'white' }
  }
];

const initialEdges = [];

const eventTypes = [
  { value: 'guildMemberAdd', label: 'Member Join', desc: 'When a user joins the server' },
  { value: 'guildMemberRemove', label: 'Member Leave', desc: 'When a user leaves the server' },
  { value: 'messageCreate', label: 'Message Sent', desc: 'When a message is sent' },
  { value: 'messageDelete', label: 'Message Deleted', desc: 'When a message is deleted' },
  { value: 'messageReactionAdd', label: 'Reaction Added', desc: 'When a reaction is added to a message' },
  { value: 'guildBanAdd', label: 'User Banned', desc: 'When a user is banned from the server' },
  { value: 'channelCreate', label: 'Channel Created', desc: 'When a channel is created' },
  { value: 'roleCreate', label: 'Role Created', desc: 'When a role is created' },
  { value: 'voiceStateUpdate', label: 'Voice State Update', desc: 'When someone joins/leaves voice' }
];

const actionBlocks = [
  { type: 'send-message', label: 'Send Welcome Message', desc: 'Send a welcome message to a channel', color: '#3b82f6' },
  { type: 'add-role', label: 'Auto Assign Role', desc: 'Automatically assign a role to the user', color: '#3b82f6' },
  { type: 'direct-message', label: 'Send DM', desc: 'Send a direct message to the user', color: '#3b82f6' },
  { type: 'log-action', label: 'Log to Channel', desc: 'Log the event to a specific channel', color: '#3b82f6' },
  { type: 'kick-member', label: 'Auto Kick', desc: 'Automatically kick the user (for automod)', color: '#ef4444' },
  { type: 'ban-member', label: 'Auto Ban', desc: 'Automatically ban the user (for automod)', color: '#ef4444' },
  { type: 'delete-message', label: 'Delete Message', desc: 'Delete the triggering message', color: '#ef4444' },
  { type: 'react-message', label: 'React to Message', desc: 'React to the message with an emoji', color: '#3b82f6' }
];

const conditionBlocks = [
  { type: 'user-check', label: 'User Condition', desc: 'Check if user meets certain criteria', color: '#10b981' },
  { type: 'channel-check', label: 'Channel Condition', desc: 'Check if action happened in specific channel', color: '#10b981' },
  { type: 'message-filter', label: 'Message Filter', desc: 'Filter messages by content, length, etc.', color: '#10b981' },
  { type: 'role-check', label: 'Role Condition', desc: 'Check if user has specific roles', color: '#10b981' },
  { type: 'time-check', label: 'Time Condition', desc: 'Check if event happens at specific time', color: '#10b981' }
];

export default function EventBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedEventType, setSelectedEventType] = useState('guildMemberAdd');
  const [eventName, setEventName] = useState('');
  const [selectedTab, setSelectedTab] = useState('actions');

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

  const saveEvent = () => {
    if (!eventName) {
      alert('Please enter an event name');
      return;
    }
    
    const eventData = {
      name: eventName,
      eventType: selectedEventType,
      nodes,
      edges,
      timestamp: Date.now()
    };
    
    // Save to localStorage for demo
    const savedEvents = JSON.parse(localStorage.getItem('vexryl-events') || '[]');
    savedEvents.push(eventData);
    localStorage.setItem('vexryl-events', JSON.stringify(savedEvents));
    
    alert('Event listener saved successfully!');
  };

  const updateTrigger = () => {
    const selectedEvent = eventTypes.find(e => e.value === selectedEventType);
    setNodes(nds => nds.map(node => 
      node.id === 'trigger-1' 
        ? { ...node, data: { label: selectedEvent.label } }
        : node
    ));
  };

  React.useEffect(() => {
    updateTrigger();
  }, [selectedEventType]);

  const blocksByTab = {
    actions: actionBlocks,
    conditions: conditionBlocks
  };

  return (
    <div className="event-builder h-screen flex">
      {/* Left Sidebar - Block Library */}
      <div className="w-80 bg-neutral-900 border-r border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white mb-4">Event Builder</h2>
          <p className="text-sm text-gray-400 mb-4">
            Build automated responses to Discord events. Drag and drop blocks to create your flow.
          </p>
          
          {/* Event Type Selector */}
          <div className="mb-4">
            <label className="block text-gray-400 mb-2 text-sm">Event Type</label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded"
            >
              {eventTypes.map(event => (
                <option key={event.value} value={event.value}>
                  {event.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            {Object.keys(blocksByTab).map(tab => (
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
            {blocksByTab[selectedTab].map((block, i) => (
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
              placeholder="Event listener name (e.g., welcome-system, automod)"
              className="px-3 py-2 bg-neutral-800 text-white border border-gray-700 rounded"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <span className="text-gray-400 text-sm">
              Trigger: {eventTypes.find(e => e.value === selectedEventType)?.desc}
            </span>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary">Test Event</button>
            <button className="btn-primary" onClick={saveEvent}>Save Event</button>
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
                <strong>Tip:</strong> Connect action and condition blocks to the event trigger to build your automation
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
