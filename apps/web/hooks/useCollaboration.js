import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Real-time Collaboration Hook
 * Manages WebSocket connection for live collaboration features
 */
export function useCollaboration(roomId, user) {
  const [connected, setConnected] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const maxReconnectAttempts = 5;
  const reconnectDelay = 1000;

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!roomId || !user) return;

    try {
      const wsUrl = `ws://localhost:3001?room=${roomId}&user=${encodeURIComponent(JSON.stringify(user))}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('🔗 Connected to collaboration server');
        setConnected(true);
        setIsReconnecting(false);
        reconnectAttempts.current = 0;

        // Join room
        ws.send(JSON.stringify({
          type: 'join_room',
          payload: { roomId, user }
        }));
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          handleMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('🔌 Disconnected from collaboration server');
        setConnected(false);
        
        // Attempt reconnection
        if (reconnectAttempts.current < maxReconnectAttempts) {
          setIsReconnecting(true);
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, reconnectDelay * Math.pow(2, reconnectAttempts.current));
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Failed to connect to collaboration server:', error);
    }
  }, [roomId, user]);

  // Disconnect from WebSocket
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    setConnected(false);
    setIsReconnecting(false);
  }, []);

  // Send message
  const sendMessage = useCallback((type, payload) => {
    if (wsRef.current && connected) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    }
  }, [connected]);

  // Handle incoming messages
  const handleMessage = useCallback((message) => {
    const { type, data } = message;

    switch (type) {
      case 'room_joined':
        setCollaborators(data.users || []);
        break;

      case 'user_joined':
        setCollaborators(prev => {
          const exists = prev.find(u => u.userId === data.user.userId);
          if (exists) return prev;
          return [...prev, data.user];
        });
        break;

      case 'user_left':
        setCollaborators(prev => prev.filter(u => u.userId !== data.userId));
        break;

      case 'node_updated':
        // Emit to parent component
        window.dispatchEvent(new CustomEvent('collaboration:node_updated', { detail: data }));
        break;

      case 'edge_updated':
        // Emit to parent component
        window.dispatchEvent(new CustomEvent('collaboration:edge_updated', { detail: data }));
        break;

      case 'cursor_moved':
        setCollaborators(prev => prev.map(user => 
          user.userId === data.userId 
            ? { ...user, cursor: data.cursor }
            : user
        ));
        break;

      case 'user_typing':
        setCollaborators(prev => prev.map(user => 
          user.userId === data.userId 
            ? { ...user, isTyping: data.isTyping }
            : user
        ));
        break;

      case 'error':
        console.error('Collaboration error:', data);
        break;

      default:
        console.log('Unknown message type:', type, data);
    }
  }, []);

  // Send node update
  const updateNode = useCallback((node) => {
    sendMessage('node_update', { roomId, node });
  }, [sendMessage, roomId]);

  // Send edge update
  const updateEdge = useCallback((edge) => {
    sendMessage('edge_update', { roomId, edge });
  }, [sendMessage, roomId]);

  // Send cursor position
  const updateCursor = useCallback((cursor) => {
    sendMessage('cursor_move', { roomId, cursor });
  }, [sendMessage, roomId]);

  // Send typing status
  const setTyping = useCallback((isTyping) => {
    sendMessage('user_typing', { roomId, isTyping });
  }, [sendMessage, roomId]);

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return disconnect;
  }, [connect, disconnect]);

  // Cleanup on room or user change
  useEffect(() => {
    disconnect();
    if (roomId && user) {
      connect();
    }
  }, [roomId, user?.userId]);

  return {
    connected,
    isReconnecting,
    collaborators,
    updateNode,
    updateEdge,
    updateCursor,
    setTyping,
    sendMessage,
    connect,
    disconnect
  };
}

/**
 * Hook for managing collaborative cursors
 */
export function useCollaborativeCursors(collaboration) {
  const [cursors, setCursors] = useState({});
  const cursorTimeouts = useRef({});

  // Update cursor position
  const updateCursor = useCallback((position) => {
    if (collaboration.connected) {
      collaboration.updateCursor(position);
    }
  }, [collaboration]);

  // Handle collaborator cursor updates
  useEffect(() => {
    const handleCursorUpdate = (event) => {
      const { userId, cursor } = event.detail;
      
      setCursors(prev => ({ ...prev, [userId]: cursor }));

      // Clear timeout for this user
      if (cursorTimeouts.current[userId]) {
        clearTimeout(cursorTimeouts.current[userId]);
      }

      // Hide cursor after inactivity
      cursorTimeouts.current[userId] = setTimeout(() => {
        setCursors(prev => {
          const newCursors = { ...prev };
          delete newCursors[userId];
          return newCursors;
        });
      }, 5000);
    };

    window.addEventListener('collaboration:cursor_moved', handleCursorUpdate);
    return () => window.removeEventListener('collaboration:cursor_moved', handleCursorUpdate);
  }, []);

  // Cleanup timeouts
  useEffect(() => {
    return () => {
      Object.values(cursorTimeouts.current).forEach(timeout => {
        clearTimeout(timeout);
      });
    };
  }, []);

  return {
    cursors,
    updateCursor
  };
}

/**
 * Hook for real-time node synchronization
 */
export function useRealtimeNodes(initialNodes, collaboration) {
  const [nodes, setNodes] = useState(initialNodes);
  const localUpdateRef = useRef(false);

  // Handle local node updates
  const updateNode = useCallback((nodeId, updates) => {
    localUpdateRef.current = true;
    
    setNodes(prev => prev.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));

    // Send to collaborators
    if (collaboration.connected) {
      const updatedNode = nodes.find(n => n.id === nodeId);
      if (updatedNode) {
        collaboration.updateNode({ ...updatedNode, ...updates });
      }
    }

    // Reset flag after a short delay
    setTimeout(() => {
      localUpdateRef.current = false;
    }, 100);
  }, [nodes, collaboration]);

  // Handle remote node updates
  useEffect(() => {
    const handleRemoteUpdate = (event) => {
      if (localUpdateRef.current) return; // Ignore our own updates

      const { node } = event.detail;
      setNodes(prev => prev.map(n => n.id === node.id ? node : n));
    };

    window.addEventListener('collaboration:node_updated', handleRemoteUpdate);
    return () => window.removeEventListener('collaboration:node_updated', handleRemoteUpdate);
  }, []);

  return {
    nodes,
    setNodes,
    updateNode
  };
}

/**
 * Hook for presence indicators
 */
export function usePresenceIndicators(collaboration) {
  const [activeUsers, setActiveUsers] = useState({});

  useEffect(() => {
    const indicators = {};
    
    collaboration.collaborators.forEach(user => {
      indicators[user.userId] = {
        username: user.username,
        color: generateUserColor(user.userId),
        isActive: user.isActive,
        isTyping: user.isTyping,
        cursor: user.cursor
      };
    });

    setActiveUsers(indicators);
  }, [collaboration.collaborators]);

  return activeUsers;
}

/**
 * Generate a consistent color for a user
 */
function generateUserColor(userId) {
  const colors = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'
  ];
  
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export default useCollaboration;
