import React, { useState, useEffect } from 'react';

/**
 * Lightweight Discord-style embed builder used inside BlockConfigPanel
 * Props:
 *  - embedData: {
 *      title?, description?, color?, url?, timestamp?, footer?: { text, icon_url },
 *      author?: { name, icon_url, url }, fields?: [{ name, value, inline }]
 *    }
 *  - onChange: (embedData) => void
 */
export default function EmbedBuilder({ embedData = {}, onChange }) {
  const [data, setData] = useState(() => ({
    title: '',
    description: '',
    color: '#5865F2',
    url: '',
    timestamp: false,
    footer: { text: '', icon_url: '' },
    author: { name: '', icon_url: '', url: '' },
    fields: [],
    ...embedData,
    footer: { text: '', icon_url: '', ...(embedData.footer || {}) },
    author: { name: '', icon_url: '', url: '', ...(embedData.author || {}) },
    fields: embedData.fields || []
  }));

  useEffect(() => {
    onChange && onChange(data);
  }, [data, onChange]);

  const update = (patch) => setData(prev => ({ ...prev, ...patch }));
  const updateNested = (section, patch) => setData(prev => ({ ...prev, [section]: { ...prev[section], ...patch } }));

  const addField = () => {
    setData(prev => ({ ...prev, fields: [...prev.fields, { name: 'Field name', value: 'Field value', inline: false }] }));
  };
  const updateField = (index, patch) => {
    setData(prev => ({
      ...prev,
      fields: prev.fields.map((f,i) => i === index ? { ...f, ...patch } : f)
    }));
  };
  const removeField = (index) => {
    setData(prev => ({ ...prev, fields: prev.fields.filter((_,i) => i !== index) }));
  };

  return (
    <div className="space-y-6">
      {/* Basic */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={e => update({ title: e.target.value })}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            placeholder="Embed title"
            maxLength={256}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-white mb-1">Description</label>
            <textarea
              value={data.description}
              onChange={e => update({ description: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Embed description"
              maxLength={4096}
            />
            <p className="text-xs text-gray-400 mt-1">{data.description?.length || 0}/4096</p>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Color</label>
            <input
              type="color"
              value={data.color}
              onChange={e => update({ color: e.target.value })}
              className="w-16 h-10 bg-gray-700 border border-gray-600 rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-white mb-1">URL (optional)</label>
            <input
              type="text"
              value={data.url}
              onChange={e => update({ url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="pt-6 flex items-center gap-2">
            <input
              id="timestamp"
              type="checkbox"
              checked={!!data.timestamp}
              onChange={e => update({ timestamp: e.target.checked })}
              className="h-4 w-4 text-blue-600 rounded border-gray-600 bg-gray-700"
            />
            <label htmlFor="timestamp" className="text-sm text-gray-300">Timestamp</label>
          </div>
        </div>
      </div>

      {/* Author */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Author</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            type="text"
            value={data.author.name}
            onChange={e => updateNested('author', { name: e.target.value })}
            placeholder="Name"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            maxLength={256}
          />
          <input
            type="text"
            value={data.author.url}
            onChange={e => updateNested('author', { url: e.target.value })}
            placeholder="URL"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={data.author.icon_url}
            onChange={e => updateNested('author', { icon_url: e.target.value })}
            placeholder="Icon URL"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Fields</h4>
          <button
            type="button"
            onClick={addField}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 rounded text-white"
          >Add Field</button>
        </div>
        {data.fields.length === 0 && (
          <p className="text-xs text-gray-400">No fields added.</p>
        )}
        <div className="space-y-4">
          {data.fields.map((f, i) => (
            <div key={i} className="p-3 bg-gray-700/40 border border-gray-600 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={f.name}
                  onChange={e => updateField(i, { name: e.target.value })}
                  placeholder="Field name"
                  className="flex-1 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  maxLength={256}
                />
                <button
                  type="button"
                  onClick={() => removeField(i)}
                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-500 rounded text-white"
                >Remove</button>
              </div>
              <textarea
                value={f.value}
                onChange={e => updateField(i, { value: e.target.value })}
                placeholder="Field value"
                rows={2}
                className="w-full px-2 py-1 bg-gray-800 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                maxLength={1024}
              />
              <label className="flex items-center gap-2 text-xs text-gray-300">
                <input
                  type="checkbox"
                  checked={!!f.inline}
                  onChange={e => updateField(i, { inline: e.target.checked })}
                  className="h-3 w-3 text-blue-600 rounded border-gray-600 bg-gray-700"
                />
                Inline
              </label>
              <p className="text-[10px] text-gray-500">{f.value?.length || 0}/1024</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-white uppercase tracking-wide">Footer</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-3">
            <input
              type="text"
              value={data.footer.text}
              onChange={e => updateNested('footer', { text: e.target.value })}
              placeholder="Footer text"
              maxLength={2048}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <p className="text-[10px] text-gray-500 mt-1">{data.footer.text?.length || 0}/2048</p>
          </div>
          <input
            type="text"
            value={data.footer.icon_url}
            onChange={e => updateNested('footer', { icon_url: e.target.value })}
            placeholder="Icon URL"
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div>
        <h4 className="text-sm font-semibold text-white uppercase tracking-wide mb-2">Preview</h4>
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800 text-sm space-y-2">
          {data.author.name && (
            <div className="flex items-center gap-2 text-gray-300">
              {data.author.icon_url && <img src={data.author.icon_url} alt="" className="w-4 h-4 rounded-full" />}
              <span className="font-medium">{data.author.name}</span>
            </div>
          )}
          {data.title && <div className="text-white font-semibold">{data.title}</div>}
          {data.description && <div className="text-gray-300 whitespace-pre-wrap">{data.description}</div>}
          {data.fields.length > 0 && (
            <div className="grid md:grid-cols-2 gap-3 pt-2">
              {data.fields.map((f,i) => (
                <div key={i} className={`bg-gray-900/40 p-2 rounded ${f.inline ? 'md:col-span-1' : 'md:col-span-2'}`}>
                  <div className="text-[11px] uppercase text-blue-400 font-semibold">{f.name}</div>
                  <div className="text-gray-300 text-xs whitespace-pre-wrap">{f.value}</div>
                </div>
              ))}
            </div>
          )}
          {(data.footer.text || data.timestamp) && (
            <div className="pt-2 border-t border-gray-700 text-[11px] text-gray-400 flex items-center gap-2">
              {data.footer.icon_url && <img src={data.footer.icon_url} alt="" className="w-3 h-3 rounded" />}
              <span>{data.footer.text}</span>
              {data.timestamp && <span>• {new Date().toLocaleString()}</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
