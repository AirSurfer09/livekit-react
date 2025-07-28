import { Room } from 'livekit-client';
import { ConnectionManager } from '../managers/ConnectionManager';
import { ConvaiConfig, ConnectionData } from '../types';
export declare const useConvaiClient: () => {
    room: Room | null;
    connectionManager: ConnectionManager | null;
    isConnected: boolean;
    isConnecting: boolean;
    connect: (config: ConvaiConfig) => Promise<ConnectionData>;
    disconnect: () => void;
};
