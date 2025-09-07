import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ConditionNode = memo(({ data, selected }) => {
  return (
    <div className={`relative bg-gray-800 border-2 rounded-lg p-4 min-w-48 transition-colors ${
      selected ? 'border-orange-500 shadow-lg shadow-orange-500/20' : 'border-gray-600 hover:border-gray-500'
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#F59E0B',
          border: '2px solid #1F2937',
          width: 8,
          height: 8,
          left: -4
        }}
      />

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
        {data.type === 'user-has-permission' && data.config?.permission && (
          <div className="text-xs">
            <span className="text-gray-400">Permission: </span>
            <span className="text-orange-400 font-mono">{data.config.permission}</span>
          </div>
        )}
        {data.type === 'user-has-role' && data.config?.roleId && (
          <div className="text-xs">
            <span className="text-gray-400">Role: </span>
            <span className="text-orange-400 font-mono">{data.config.roleId}</span>
          </div>
        )}
        {data.type === 'cooldown' && data.config?.duration && (
          <div className="text-xs">
            <span className="text-gray-400">Cooldown: </span>
            <span className="text-orange-400">{data.config.duration}ms</span>
          </div>
        )}
        {data.type === 'random-chance' && data.config?.percentage && (
          <div className="text-xs">
            <span className="text-gray-400">Chance: </span>
            <span className="text-orange-400">{data.config.percentage}%</span>
          </div>
        )}
        {data.type === 'variable-check' && data.config?.variable && (
          <div className="text-xs">
            <span className="text-gray-400">Variable: </span>
            <span className="text-orange-400 font-mono">{data.config.variable}</span>
          </div>
        )}

        {data.config?.checkChannel && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
            📍 Channel Check
          </div>
        )}
        {data.config?.allowOwner && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
            👑 Owner Bypass
          </div>
        )}
      </div>

      {/* Outputs */}
      <div className="space-y-1">
        {data.outputs?.map((output, index) => (
          <div key={output} className="flex items-center justify-end gap-2">
            <span className={`text-xs ${
              output === 'true' || output === 'continue' ? 'text-green-400' : 
              output === 'false' || output === 'blocked' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              {output}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={output}
              style={{
                background: output === 'true' || output === 'continue' ? '#10B981' : 
                          output === 'false' || output === 'blocked' ? '#EF4444' : '#6B7280',
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

      {/* Diamond Shape Indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-3 h-3 bg-orange-400 transform rotate-45" />
      </div>
    </div>
  );
});

ConditionNode.displayName = 'ConditionNode';

export default ConditionNode;
