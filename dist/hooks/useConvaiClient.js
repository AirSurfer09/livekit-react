import { useState, useEffect } from 'react';
import { ConnectionManager } from '../managers/ConnectionManager';
export const useConvaiClient = () => {
    const [room, setRoom] = useState(null);
    const [connectionManager, setConnectionManager] = useState(null);
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
    const connect = async (config) => {
        if (!connectionManager) {
            throw new Error("Connection manager not initialized");
        }
        setIsConnecting(true);
        try {
            const connectionData = await connectionManager.connect(config);
            setIsConnected(true);
            return connectionData;
        }
        catch (error) {
            console.error('Connection failed:', error);
            throw error;
        }
        finally {
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
