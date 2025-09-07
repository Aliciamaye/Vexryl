import React, { useState } from "react";

const items = [];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="marketplace-bg min-h-screen p-8 flex flex-col">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        <input
          type="text"
          placeholder="Search items..."
          className="marketplace-search px-4 py-2 rounded bg-neutral-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </header>
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-2xl font-bold text-gray-400 mb-4">No items yet</div>
          <div className="text-gray-500 mb-6">Marketplace is empty. Be the first to upload and share your build!</div>
          <button className="btn-primary">Upload & Share Your Build</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((item, i) => (
            <MarketplaceItem key={i} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}

function MarketplaceItem({ name, desc, type, icon, featured, new: isNew }) {
  return (
    <div className="marketplace-item bg-neutral-900 border border-gray-800 rounded-xl p-6 flex flex-col items-center gap-3 shadow hover:shadow-lg transition relative">
      <img src={icon} alt={name} className="h-12 mb-2" />
      <div className="text-lg font-bold text-white flex items-center gap-2">
        {name}
        {featured && <span className="ml-2 px-2 py-0.5 text-xs bg-cyan-500 text-white rounded">Featured</span>}
        {isNew && <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded">New</span>}
      </div>
      <div className="text-gray-300 text-center text-sm">{desc}</div>
      <div className="text-xs text-cyan-400 font-semibold mt-2">{type}</div>
      <button className="btn-primary mt-4 w-full">Preview & Import</button>
    </div>
  );
}
