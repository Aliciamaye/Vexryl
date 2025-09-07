import React, { useEffect, useState } from 'react';

export default function StringOption({ config, onChange }) {
  const [value, setValue] = useState(config?.value || '');

  useEffect(() => {
    onChange && onChange({ value });
  }, [value, onChange]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">String Value</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter text..."
        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
      />
      <p className="text-xs text-gray-500">This value can be used in later blocks.</p>
    </div>
  );
}
