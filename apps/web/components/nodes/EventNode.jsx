import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const EventNode = memo(({ data, selected }) => {
  return (
    <div className={`relative bg-gray-800 border-2 rounded-lg p-4 min-w-48 transition-colors ${
      selected ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-gray-600 hover:border-gray-500'
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
        {data.type === 'messageCreate' && (
          <>
            {data.config?.ignoreBots && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                🤖 Ignore Bots
              </div>
            )}
            {data.config?.channelFilter?.length > 0 && (
              <div className="text-xs">
                <span className="text-gray-400">Channels: </span>
                <span className="text-emerald-400">{data.config.channelFilter.length} filtered</span>
              </div>
            )}
          </>
        )}

        {data.type === 'guildMemberAdd' && (
          <>
            {data.config?.welcomeMessage && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                👋 Welcome Message
              </div>
            )}
            {data.config?.autoRole && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs">
                🏷️ Auto Role
              </div>
            )}
          </>
        )}

        {data.type === 'guildMemberRemove' && data.config?.goodbyeMessage && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
            👋 Goodbye Message
          </div>
        )}

        {data.type === 'messageReactionAdd' && (
          <>
            {data.config?.specificEmoji && (
              <div className="text-xs">
                <span className="text-gray-400">Emoji: </span>
                <span className="text-emerald-400">{data.config.specificEmoji}</span>
              </div>
            )}
            {data.config?.specificMessage && (
              <div className="text-xs">
                <span className="text-gray-400">Message ID: </span>
                <span className="text-emerald-400 font-mono">
                  {data.config.specificMessage.substring(0, 8)}...
                </span>
              </div>
            )}
          </>
        )}

        {data.type === 'voiceStateUpdate' && (
          <div className="flex flex-wrap gap-1">
            {data.config?.trackJoins && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-600/20 text-green-400 rounded text-xs">
                ➡️ Joins
              </div>
            )}
            {data.config?.trackLeaves && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded text-xs">
                ⬅️ Leaves
              </div>
            )}
            {data.config?.trackMoves && (
              <div className="inline-flex items-center gap-1 px-2 py-1 bg-blue-600/20 text-blue-400 rounded text-xs">
                🔄 Moves
              </div>
            )}
          </div>
        )}

        {data.type === 'interactionCreate' && (
          <>
            {data.config?.interactionType && data.config.interactionType !== 'any' && (
              <div className="text-xs">
                <span className="text-gray-400">Type: </span>
                <span className="text-emerald-400">{data.config.interactionType}</span>
              </div>
            )}
            {data.config?.customId && (
              <div className="text-xs">
                <span className="text-gray-400">Custom ID: </span>
                <span className="text-emerald-400 font-mono">{data.config.customId}</span>
              </div>
            )}
          </>
        )}

        {data.config?.runOnce && (
          <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-600/20 text-yellow-400 rounded text-xs">
            1️⃣ Run Once
          </div>
        )}
      </div>

      {/* Outputs */}
      <div className="space-y-1">
        {data.outputs?.map((output, index) => (
          <div key={output} className="flex items-center justify-end gap-2">
            <span className="text-xs text-emerald-400">{output}</span>
            <Handle
              type="source"
              position={Position.Right}
              id={output}
              style={{
                background: '#10B981',
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

      {/* Event Type Indicator */}
      <div className="absolute top-2 right-2">
        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
      </div>

      {/* Event Badge */}
      <div className="absolute -top-2 -left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-medium">
        EVENT
      </div>
    </div>
  );
});

EventNode.displayName = 'EventNode';

export default EventNode;
