import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/marketplace.css';

export default function Marketplace() {
  const [builds, setBuilds] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    // Fetch marketplace builds from backend
    axios.get('/api/marketplace')
      .then(res => setBuilds(res.data.builds || []))
      .catch(() => setBuilds([]));
  }, []);

  const handleImport = async (buildId) => {
    setImporting(true);
    try {
      await axios.post('/api/marketplace/import', { buildId });
      alert('Build imported to your bots!');
    } catch {
      alert('Failed to import build.');
    }
    setImporting(false);
  };

  const filteredBuilds = builds.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="marketplace-container">
      <h1>Marketplace</h1>
      <input
        type="text"
        placeholder="Search builds..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="marketplace-search"
      />
      <div className="build-list">
        {filteredBuilds.length === 0 && <div className="empty">No builds found.</div>}
        {filteredBuilds.map(build => (
          <div key={build.id} className="build-card" onClick={() => setSelectedBuild(build)}>
            <h2>{build.name}</h2>
            <p>{build.description}</p>
            <div className="tags">{build.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
            <button
              className="import-btn"
              disabled={importing}
              onClick={e => { e.stopPropagation(); handleImport(build.id); }}
            >Import</button>
          </div>
        ))}
      </div>
      {selectedBuild && (
        <div className="build-modal">
          <div className="modal-content">
            <button className="close-btn" onClick={() => setSelectedBuild(null)}>×</button>
            <h2>{selectedBuild.name}</h2>
            <p>{selectedBuild.description}</p>
            <div className="tags">{selectedBuild.tags?.map(tag => <span key={tag}>{tag}</span>)}</div>
            <pre className="code-block">{selectedBuild.code}</pre>
            <button
              className="import-btn"
              disabled={importing}
              onClick={() => handleImport(selectedBuild.id)}
            >Import to My Bots</button>
          </div>
        </div>
      )}
    </div>
  );
}
