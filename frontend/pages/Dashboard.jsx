const bots = [
  { name: 'Bot 1', avatar: '', status: 'Online', modules: 5, commands: 10, events: 7 },
  { name: 'Bot 2', avatar: '', status: 'Offline', modules: 3, commands: 8, events: 4 },
];

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditName(bots[idx].name);
    setEditAvatar(bots[idx].avatar);
  };
  const saveEdit = () => {
    if (editIdx !== null) {
      bots[editIdx].name = editName;
      bots[editIdx].avatar = editAvatar;
      setEditIdx(null);
    }
  };

  return (
    <div className={darkMode ? 'dashboard-container' : 'dashboard-container light-mode'}>
      <button className="toggle-mode" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light Mode' : 'Dark Mode'}
      </button>
      <h2>Your Bots</h2>
      <div className="bot-list">
        {bots.map((bot, idx) => (
          <div className="bot-card" key={idx}>
            {editIdx === idx ? (
              <>
                <input className="bot-edit-input" value={editName} onChange={e => setEditName(e.target.value)} placeholder="Bot Name" />
                <input className="bot-edit-input" value={editAvatar} onChange={e => setEditAvatar(e.target.value)} placeholder="Avatar URL" />
                <button className="bot-save-btn" onClick={saveEdit}>Save</button>
                <button className="bot-cancel-btn" onClick={() => setEditIdx(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h3>{bot.name}</h3>
                {bot.avatar && <img src={bot.avatar} alt="Bot Avatar" className="bot-avatar" />}
                <span className={bot.status === 'Online' ? 'online' : 'offline'}>{bot.status}</span>
                <p>Modules: {bot.modules}</p>
                <p>Commands: {bot.commands}</p>
                <p>Events: {bot.events}</p>
                <button className="bot-edit-btn" onClick={() => startEdit(idx)}>Edit Bot</button>
              </>
            )}
          </div>
        ))}
      </div>
      <div className="hosting-section">
        <h2>Connect Hosting Services</h2>
        <p>Supported: <b>Railway</b>, <b>Heroku</b></p>
        <div className="hosting-list">
          <div className="hosting-card">
            <h4>Railway</h4>
            <button className="hosting-connect-btn">Connect Railway Account</button>
            <p>Status: Not Connected</p>
            <button className="hosting-create-btn">Create Bot Project</button>
            <button className="hosting-console-btn">Open Railway Console</button>
          </div>
          <div className="hosting-card">
            <h4>Heroku</h4>
            <button className="hosting-connect-btn">Connect Heroku Account</button>
            <p>Status: Not Connected</p>
            <button className="hosting-create-btn">Create Bot Project</button>
            <button className="hosting-console-btn">Open Heroku Console</button>
          </div>
        </div>
        <p className="hosting-note">You can manage your bot hosting directly from Vexryl. No need to visit Railway or Heroku—create, deploy, and control your bot here.</p>
      </div>
      <p>Welcome to your Vexryl dashboard. Manage up to 5 bots, commands, events, and modules here. You can edit your bot's name and avatar directly from this dashboard.</p>
    </div>
  );
};

export default Dashboard;
