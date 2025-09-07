import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ActionNode = memo(({ data, selected }) => {
  return (
    <div className={`relative bg-gray-800 border-2 rounded-lg p-4 min-w-48 transition-colors ${
      selected ? 'border-green-500 shadow-lg shadow-green-500/20' : 'border-gray-600 hover:border-gray-500'
    }`}>
      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: '#10B981',
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
        {data.type === 'send-message' && (
          <>
            {data.config?.content && (
              <div className="text-xs">
                <span className="text-gray-400">Content: </span>
                <span className="text-green-400 line-clamp-1">
                  {data.config.content.substring(0, 30)}
                  {data.config.content.length > 30 ? '...' : ''}
                </span>
              </div>
            )}
            {data.config?.channel && data.config.channel !== 'current' && (
              <div className="text-xs">
                <span className="text-gray-400">Channel: </span>
                <span className="text-green-400">{data.config.channel}</span>
              </div>
            )}
            {data.config?.embed && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                📋 Embed
              </div>
            )}
            {data.config?.ephemeral && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                👁️ Ephemeral
              </div>
            )}
          </>
        )}

        {data.type === 'add-role' && data.config?.roleId && (
          <div className="text-xs">
            <span className="text-gray-400">Role: </span>
            <span className="text-green-400 font-mono">{data.config.roleId}</span>
          </div>
        )}

        {data.type === 'remove-role' && data.config?.roleId && (
          <div className="text-xs">
            <span className="text-gray-400">Role: </span>
            <span className="text-green-400 font-mono">{data.config.roleId}</span>
          </div>
        )}

        {data.type === 'kick-member' && (
          <div className="text-xs">
            <span className="text-gray-400">Action: </span>
            <span className="text-red-400">Kick Member</span>
          </div>
        )}

        {data.type === 'ban-member' && (
          <div className="text-xs">
            <span className="text-gray-400">Action: </span>
            <span className="text-red-400">Ban Member</span>
            {data.config?.deleteMessageDays > 0 && (
              <span className="text-gray-400"> ({data.config.deleteMessageDays}d)</span>
            )}
          </div>
        )}

        {data.type === 'timeout-member' && data.config?.duration && (
          <div className="text-xs">
            <span className="text-gray-400">Duration: </span>
            <span className="text-yellow-400">{Math.floor(data.config.duration / 1000)}s</span>
          </div>
        )}

        {data.type === 'create-channel' && data.config?.name && (
          <div className="text-xs">
            <span className="text-gray-400">Name: </span>
            <span className="text-green-400 font-mono">#{data.config.name}</span>
          </div>
        )}

        {data.type === 'set-variable' && (
          <>
            {data.config?.variable && (
              <div className="text-xs">
                <span className="text-gray-400">Variable: </span>
                <span className="text-green-400 font-mono">{data.config.variable}</span>
              </div>
            )}
            {data.config?.value && (
              <div className="text-xs">
                <span className="text-gray-400">Value: </span>
                <span className="text-green-400">{data.config.value}</span>
              </div>
            )}
          </>
        )}

        {data.type === 'wait' && data.config?.duration && (
          <div className="text-xs">
            <span className="text-gray-400">Duration: </span>
            <span className="text-green-400">{data.config.duration}{data.config.unit || 'ms'}</span>
          </div>
        )}

        {data.type === 'api-request' && data.config?.url && (
          <div className="text-xs">
            <span className="text-gray-400">URL: </span>
            <span className="text-green-400 line-clamp-1">{data.config.url}</span>
          </div>
        )}

        {data.config?.reason && (
          <div className="text-xs">
            <span className="text-gray-400">Reason: </span>
            <span className="text-yellow-400 line-clamp-1">{data.config.reason}</span>
          </div>
        )}
      </div>

      {/* Outputs */}
      <div className="space-y-1">
        {data.outputs?.map((output, index) => (
          <div key={output} className="flex items-center justify-end gap-2">
            <span className={`text-xs ${
              output === 'success' || output === 'continue' ? 'text-green-400' : 
              output === 'error' ? 'text-red-400' : 
              'text-gray-400'
            }`}>
              {output}
            </span>
            <Handle
              type="source"
              position={Position.Right}
              id={output}
              style={{
                background: output === 'success' || output === 'continue' ? '#10B981' : 
                          output === 'error' ? '#EF4444' : '#6B7280',
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
          data.config && Object.keys(data.config).length > 0 ? 'bg-green-400' : 'bg-yellow-400'
        }`} />
      </div>
    </div>
  );
});

ActionNode.displayName = 'ActionNode';

export default ActionNode;
