import { useCallback } from 'react';
import { useLiveKitManager, LiveKitConfig } from '../managers/LiveKitManager';

export interface LiveKitClientConfig {
  apiKey: string;
  characterId: string;
  coreServiceUrl?: string;
  enableVideo?: boolean;
  enableAudio?: boolean;
  llmProvider?: string;
  actionConfig?: {
    actions: string[];
    characters: Array<{ name: string; bio: string }>;
    objects: Array<{ name: string; description: string }>;
    currentAttentionObject?: string;
  };
}

export const useLiveKitClient = () => {
  const { state, connect, disconnect } = useLiveKitManager();

  const connectToConvai = useCallback(async (config: LiveKitClientConfig) => {
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