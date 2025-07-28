import { useCallback } from 'react';
import { useLiveKitManager } from '../managers/LiveKitManager';
export const useLiveKitClient = () => {
    const { state, connect, disconnect } = useLiveKitManager();
    const connectToConvai = useCallback(async (config) => {
        await connect(config);
    }, [connect]);
    return {
        // State
        isConnected: state.isConnected,
        isConnecting: state.isConnecting,
        agentState: state.agentState,
        room: state.room,
        error: state.error,
        // Actions
        connect: connectToConvai,
        disconnect,
    };
};
