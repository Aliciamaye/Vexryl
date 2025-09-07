import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const CommandNode = memo(({ data, selected }) => {
  return (
    <div className={`relative bg-gray-800 border-2 rounded-lg p-4 min-w-48 transition-colors ${
      selected ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-gray-600 hover:border-gray-500'
    }`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div 
          className="w-8 h-8 rounded flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: data.color + '20', color: data.color }}
        >
          {data.icon}
        </div>
        <div>
          <h3 className="font-medium text-white text-sm">{data.name}</h3>
          <p className="text-xs text-gray-400">{data.type}</p>
        </div>
      </div>

      {/* Configuration Preview */}
      <div className="space-y-2 mb-3">
        {data.config?.name && (
          <div className="text-xs">
            <span className="text-gray-400">Command: </span>
            <span className="text-blue-400 font-mono">/{data.config.name}</span>
          </div>
        )}
        {data.config?.description && (
          <div className="text-xs text-gray-300 line-clamp-2">
            {data.config.description}
          </div>
        )}
        {data.config?.guildOnly && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
            🏰 Guild Only
          </div>
        )}
        {data.config?.ownerOnly && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
            👑 Owner Only
          </div>
        )}
      </div>

      {/* Outputs */}
      <div className="space-y-1">
        {data.outputs?.map((output, index) => (
          <div key={output} className="flex items-center justify-end gap-2">
            <span className="text-xs text-gray-400">{output}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output}
              style={{
                background: '#4F46E5',
                border: '2px solid #1F2937',
                width: 8,
                height: 8,
                right: -4,
                top: 70 + index * 20
              }}
            />
          </div>
        ))}
      </div>

      {/* Status Indicator */}
      <div className="absolute top-2 right-2">
        <div className={`w-2 h-2 rounded-full ${
          data.config?.name ? 'bg-green-400' : 'bg-yellow-400'
        }`} />
      </div>
    </div>
  );
});

CommandNode.displayName = 'CommandNode';

export default CommandNode;
