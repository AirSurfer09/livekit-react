import { useState, useEffect } from 'react';
import { Room } from 'livekit-client';
import { ConnectionManager } from '../managers/ConnectionManager';
import { ConvaiConfig, ConnectionData } from '../types';

export const useConvaiClient = () => {
  const [room, setRoom] = useState<Room | null>(null);
  const [connectionManager, setConnectionManager] = useState<ConnectionManager | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const manager = new ConnectionManager();
    setConnectionManager(manager);
    
    const room = manager.getRoom();
    if (room) {
      setRoom(room);
    }
  }, []);

  const connect = async (config: ConvaiConfig): Promise<ConnectionData> => {
    if (!connectionManager) {
      throw new Error("Connection manager not initialized");
    }

    setIsConnecting(true);
    try {
      const connectionData = await connectionManager.connect(config);
      setIsConnected(true);
      return connectionData;
    } catch (error) {
      console.error('Connection failed:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    if (connectionManager) {
      connectionManager.disconnect();
      setIsConnected(false);
    }
  };

  return { 
    room, 
    connectionManager,
    isConnected,
    isConnecting,
    connect,
    disconnect
  };
}; 