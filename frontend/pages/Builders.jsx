const commandBlockGroups = [
  {
    group: 'Commands',
    color: '#5865F2',
    blocks: [
      { type: 'Slash Command', icon: '⚡', desc: 'Create a custom slash command.' },
      { type: 'Prefix Command', icon: '!', desc: 'Create a command with a prefix.' },
      { type: 'Context Menu Command', icon: '📝', desc: 'Right-click context menu command.' },
    ]
  },
  {
    group: 'Actions',
    color: '#6C63FF',
    blocks: [
      { type: 'Send Message', icon: '💬', desc: 'Send a message or embed.' },
      { type: 'Add Role', icon: '➕', desc: 'Add a role to a user.' },
      { type: 'Remove Role', icon: '➖', desc: 'Remove a role from a user.' },
      { type: 'Kick Member', icon: '👢', desc: 'Kick a member.' },
      { type: 'Ban Member', icon: '🔨', desc: 'Ban a member.' },
      { type: 'Unban Member', icon: '🔓', desc: 'Unban a member.' },
      { type: 'Timeout Member', icon: '⏰', desc: 'Timeout a member.' },
      { type: 'Move Member', icon: '🎧', desc: 'Move a member in voice.' },
      { type: 'Edit Message', icon: '✏️', desc: 'Edit a message.' },
      { type: 'Delete Message', icon: '🗑️', desc: 'Delete a message.' },
      { type: 'DM User', icon: '📩', desc: 'Send a DM to a user.' },
      { type: 'Set Nickname', icon: '📝', desc: 'Set a user nickname.' },
      { type: 'Create Channel', icon: '📁', desc: 'Create a channel.' },
      { type: 'Create Role', icon: '🏷️', desc: 'Create a role.' },
      { type: 'Assign Variable', icon: '🔢', desc: 'Assign a variable.' },
    ]
  },
  {
    group: 'Conditions',
    color: '#F04747',
    blocks: [
      { type: 'If/Else', icon: '🔀', desc: 'Conditional logic.' },
      { type: 'Check User Permission', icon: '🛡️', desc: 'Check user permissions.' },
      { type: 'Check Channel', icon: '📺', desc: 'Check channel.' },
      { type: 'Check Role', icon: '🏷️', desc: 'Check role.' },
      { type: 'Check Message Content', icon: '🔍', desc: 'Check message content.' },
      { type: 'Check Variable', icon: '🔢', desc: 'Check variable value.' },
    ]
  },
  {
    group: 'Responses',
    color: '#B3B3FF',
    blocks: [
      { type: 'Reply to User', icon: '💬', desc: 'Reply to a user.' },
      { type: 'React to Message', icon: '😃', desc: 'React to a message.' },
      { type: 'Send File', icon: '📎', desc: 'Send a file or image.' },
      { type: 'Custom Response', icon: '🎯', desc: 'Custom response.' },
    ]
  },
  {
    group: 'Utilities',
    color: '#FAA61A',
    blocks: [
      { type: 'Wait/Delay', icon: '⏳', desc: 'Wait or delay.' },
      { type: 'Math/Random', icon: '🎲', desc: 'Math or random value.' },
      { type: 'Set Variable', icon: '📝', desc: 'Set a variable.' },
      { type: 'Get Variable', icon: '🔎', desc: 'Get a variable.' },
      { type: 'Loop/Repeat', icon: '🔁', desc: 'Loop or repeat.' },
      { type: 'API Request', icon: '🌐', desc: 'Make an API request.' },
    ]
  },
];

const eventBlockGroups = [
  {
    group: 'Events',
    color: '#43B581',
    blocks: [
      { type: 'Message Create', icon: '💬', desc: 'On message sent.' },
      { type: 'Message Delete', icon: '❌', desc: 'On message deleted.' },
      { type: 'Message Update', icon: '✏️', desc: 'On message edited.' },
      { type: 'Reaction Add', icon: '➕', desc: 'On reaction added.' },
      { type: 'Reaction Remove', icon: '➖', desc: 'On reaction removed.' },
      { type: 'Guild Member Add', icon: '👤', desc: 'On member joins.' },
      { type: 'Guild Member Remove', icon: '🚪', desc: 'On member leaves.' },
      { type: 'Voice State Update', icon: '🎤', desc: 'On voice state change.' },
      { type: 'Channel Create', icon: '📁', desc: 'On channel created.' },
      { type: 'Channel Delete', icon: '🗑️', desc: 'On channel deleted.' },
      { type: 'Role Create', icon: '🏷️', desc: 'On role created.' },
      { type: 'Role Delete', icon: '❎', desc: 'On role deleted.' },
      { type: 'Invite Create', icon: '🔗', desc: 'On invite created.' },
      { type: 'Invite Delete', icon: '🔗', desc: 'On invite deleted.' },
      { type: 'User Update', icon: '👤', desc: 'On user updated.' },
      { type: 'Presence Update', icon: '🟢', desc: 'On presence updated.' },
      { type: 'Interaction Create', icon: '🖱️', desc: 'On button/select used.' },
    ]
  },
  {
    group: 'Actions',
    color: '#6C63FF',
    blocks: [
      { type: 'Send Message', icon: '💬', desc: 'Send a message or embed.' },
      { type: 'Add Role', icon: '➕', desc: 'Add a role to a user.' },
      { type: 'Remove Role', icon: '➖', desc: 'Remove a role from a user.' },
      { type: 'Kick Member', icon: '👢', desc: 'Kick a member.' },
      { type: 'Ban Member', icon: '🔨', desc: 'Ban a member.' },
      { type: 'Unban Member', icon: '🔓', desc: 'Unban a member.' },
      { type: 'Timeout Member', icon: '⏰', desc: 'Timeout a member.' },
      { type: 'Move Member', icon: '🎧', desc: 'Move a member in voice.' },
      { type: 'Edit Message', icon: '✏️', desc: 'Edit a message.' },
      { type: 'Delete Message', icon: '🗑️', desc: 'Delete a message.' },
      { type: 'DM User', icon: '📩', desc: 'Send a DM to a user.' },
      { type: 'Set Nickname', icon: '📝', desc: 'Set a user nickname.' },
      { type: 'Create Channel', icon: '📁', desc: 'Create a channel.' },
      { type: 'Create Role', icon: '🏷️', desc: 'Create a role.' },
      { type: 'Assign Variable', icon: '🔢', desc: 'Assign a variable.' },
    ]
  },
  {
    group: 'Conditions',
    color: '#F04747',
    blocks: [
      { type: 'If/Else', icon: '🔀', desc: 'Conditional logic.' },
      { type: 'Check User Permission', icon: '🛡️', desc: 'Check user permissions.' },
      { type: 'Check Channel', icon: '📺', desc: 'Check channel.' },
      { type: 'Check Role', icon: '🏷️', desc: 'Check role.' },
      { type: 'Check Message Content', icon: '🔍', desc: 'Check message content.' },
      { type: 'Check Variable', icon: '🔢', desc: 'Check variable value.' },
    ]
  },
  {
    group: 'Responses',
    color: '#B3B3FF',
    blocks: [
      { type: 'Reply to User', icon: '💬', desc: 'Reply to a user.' },
      { type: 'React to Message', icon: '😃', desc: 'React to a message.' },
      { type: 'Send File', icon: '📎', desc: 'Send a file or image.' },
      { type: 'Custom Response', icon: '🎯', desc: 'Custom response.' },
    ]
  },
  {
    group: 'Utilities',
    color: '#FAA61A',
    blocks: [
      { type: 'Wait/Delay', icon: '⏳', desc: 'Wait or delay.' },
      { type: 'Math/Random', icon: '🎲', desc: 'Math or random value.' },
      { type: 'Set Variable', icon: '📝', desc: 'Set a variable.' },
      { type: 'Get Variable', icon: '🔎', desc: 'Get a variable.' },
      { type: 'Loop/Repeat', icon: '🔁', desc: 'Loop or repeat.' },
      { type: 'API Request', icon: '🌐', desc: 'Make an API request.' },
    ]
  },
];

const Builders = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [tab, setTab] = useState('Commands');
  const [selectedGroup, setSelectedGroup] = useState(commandBlockGroups[0]);
  const [selectedBlock, setSelectedBlock] = useState(commandBlockGroups[0].blocks[0]);
  const [commandBlocks, setCommandBlocks] = useState([]);
  const [eventBlocks, setEventBlocks] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  // Block editing state
  const [blockConfig, setBlockConfig] = useState({
    trigger: '',
    description: '',
    cooldown: 'No Cooldown',
    buttonLabel: '',
    selectMenuOptions: '',
    modalTitle: '',
    modalFields: '',
    variables: '',
  });

  const blockGroups = tab === 'Commands' ? commandBlockGroups : eventBlockGroups;
  const builderBlocks = tab === 'Commands' ? commandBlocks : eventBlocks;
  const setBuilderBlocks = tab === 'Commands' ? setCommandBlocks : setEventBlocks;

  const handleTab = (newTab) => {
    setTab(newTab);
    const groups = newTab === 'Commands' ? commandBlockGroups : eventBlockGroups;
    setSelectedGroup(groups[0]);
    setSelectedBlock(groups[0].blocks[0]);
  };

  const addBlock = (block) => {
    setBuilderBlocks([...builderBlocks, { ...block, color: selectedGroup.color }]);
  };

  const removeBlock = (idx) => {
    setBuilderBlocks(builderBlocks.filter((_, i) => i !== idx));
  };

  const moveBlock = (idx, dir) => {
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === builderBlocks.length - 1)) return;
    const newBlocks = [...builderBlocks];
    const temp = newBlocks[idx];
    newBlocks[idx] = newBlocks[idx + dir];
    newBlocks[idx + dir] = temp;
    setBuilderBlocks(newBlocks);
  };


  return (
    <div className={darkMode ? 'builders-container' : 'builders-container light-mode'}>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <div className="builder-tabs">
        <button className={tab === 'Commands' ? 'builder-tab selected' : 'builder-tab'} onClick={() => handleTab('Commands')}>Commands</button>
        <button className={tab === 'Events' ? 'builder-tab selected' : 'builder-tab'} onClick={() => handleTab('Events')}>Events</button>
      </div>
      <div className="builder-layout">
        {/* Left: Block Library */}
        <div className="builder-left">
          <h3>Blocks</h3>
          <input className="block-search" placeholder="Search blocks..." />
          <div className="block-group-tabs">
            {blockGroups.map((group, idx) => (
              <button
                key={group.group}
                className={selectedGroup.group === group.group ? 'group-tab selected' : 'group-tab'}
                style={{ borderBottom: `3px solid ${group.color}` }}
                onClick={() => {
                  setSelectedGroup(group);
                  setSelectedBlock(group.blocks[0]);
                }}
              >
                {group.group}
              </button>
            ))}
          </div>
          <div className="block-list">
            {selectedGroup.blocks.map((block, idx) => (
              <div
                key={block.type}
                className={selectedBlock.type === block.type ? 'block-btn selected' : 'block-btn'}
                style={{ background: selectedGroup.color, color: '#fff' }}
                onClick={() => setSelectedBlock(block)}
              >
                <span className="block-icon">{block.icon}</span> {block.type}
              </div>
            ))}
          </div>
        </div>
        {/* Center: Canvas */}
        <div className="builder-center">
          <h4>Your {tab} Flow</h4>
          {builderBlocks.length === 0 && <p className="empty-canvas">No blocks added yet. Start building your {tab.toLowerCase()}!</p>}
          <div className="canvas-blocks">
            {builderBlocks.map((block, idx) => (
              <div key={idx} className="canvas-block" style={{ background: block.color }}>
                <span className="block-icon">{block.icon}</span> {block.type}
                <button className="remove-block-btn" onClick={() => removeBlock(idx)} title="Remove">✖</button>
                <button className="move-block-btn" onClick={() => moveBlock(idx, -1)} title="Move Up">▲</button>
                <button className="move-block-btn" onClick={() => moveBlock(idx, 1)} title="Move Down">▼</button>
              </div>
            ))}
          </div>
        </div>
        {/* Right: Block Config */}
        <div className="builder-right">
          <h3>Block Editing Area</h3>
          <div className="block-details">
            <h4>{selectedBlock.icon} {selectedBlock.type}</h4>
            <p>{selectedBlock.desc}</p>
            <label className="block-label">Trigger</label>
            <input className="block-input" value={blockConfig.trigger} onChange={e => setBlockConfig({ ...blockConfig, trigger: e.target.value })} placeholder="Trigger name..." />
            <label className="block-label">Description</label>
            <input className="block-input" value={blockConfig.description} onChange={e => setBlockConfig({ ...blockConfig, description: e.target.value })} placeholder="Description..." />
            <label className="block-label">Cooldown</label>
            <select className="block-input" value={blockConfig.cooldown} onChange={e => setBlockConfig({ ...blockConfig, cooldown: e.target.value })}>
              <option>No Cooldown</option>
              <option>User Cooldown</option>
              <option>Server Cooldown</option>
            </select>
            {/* Discord block extras */}
            <label className="block-label">Button Label</label>
            <input className="block-input" value={blockConfig.buttonLabel} onChange={e => setBlockConfig({ ...blockConfig, buttonLabel: e.target.value })} placeholder="Button label..." />
            <label className="block-label">Select Menu Options (comma separated)</label>
            <input className="block-input" value={blockConfig.selectMenuOptions} onChange={e => setBlockConfig({ ...blockConfig, selectMenuOptions: e.target.value })} placeholder="Option1,Option2,..." />
            <label className="block-label">Modal Title</label>
            <input className="block-input" value={blockConfig.modalTitle} onChange={e => setBlockConfig({ ...blockConfig, modalTitle: e.target.value })} placeholder="Modal title..." />
            <label className="block-label">Modal Fields (comma separated)</label>
            <input className="block-input" value={blockConfig.modalFields} onChange={e => setBlockConfig({ ...blockConfig, modalFields: e.target.value })} placeholder="Field1,Field2,..." />
            <label className="block-label">Variables (comma separated)</label>
            <input className="block-input" value={blockConfig.variables} onChange={e => setBlockConfig({ ...blockConfig, variables: e.target.value })} placeholder="var1,var2,..." />
            <button className="add-block-btn" onClick={() => addBlock(selectedBlock)}>
              Add to Builder
            </button>
          </div>
          <button className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
            {showAdvanced ? 'Hide Advanced Script Editor' : 'Show Advanced Script Editor'}
          </button>
          {showAdvanced && (
            <div className="advanced-editor">
              <h4>Advanced Script Editor (Static Example)</h4>
              <textarea className="block-script" placeholder="Edit your advanced script here..." style={{ minHeight: 180 }} />
            </div>
          )}
          <div className="block-listing">
            <h4>All Discord Blocks & Features</h4>
            <ul>
              <li>Send/Edit Message</li>
              <li>Message with Button</li>
              <li>Message with Select Menu</li>
              <li>Modal (custom form)</li>
              <li>Embed Message</li>
              <li>Reply Actions</li>
              <li>Role Management</li>
              <li>Channel Management</li>
              <li>Kick/Ban/Timeout</li>
              <li>Variable Assignment & Usage</li>
              <li>API/Webhook Request</li>
              <li>Conditionals (If/Else, Check Permission, etc.)</li>
              <li>Loop/Repeat</li>
              <li>Custom Response</li>
              <li>Advanced Script Editor</li>
            </ul>
          </div>
        </div>
      </div>
      {tab === 'Events' && (
        <div className="event-list-section">
          <h4>All Supported Discord Events</h4>
          <ul className="event-list">
            {eventBlockGroups[0].blocks.map((block, idx) => (
              <li key={block.type}>{block.type.replace(/ /g, '')}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="builder-instructions">
        <p>Tip: Drag, reorder, and remove blocks to customize your bot's flow. Use the advanced editor for script-level control (per builder).</p>
      </div>
      <p>Build and customize your Discord bot with all available blocks and events. Advanced mode lets you edit scripts for selected builders.</p>
    </div>
  );
};

export default Builders;
