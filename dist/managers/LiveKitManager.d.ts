import React, { ReactNode } from 'react';
import { Room } from 'livekit-client';
export interface LiveKitConfig {
    apiKey: string;
    characterId: string;
    coreServiceUrl?: string;
    enableVideo?: boolean;
    enableAudio?: boolean;
    llmProvider?: string;
    actionConfig?: {
        actions: string[];
        characters: Array<{
            name: string;
            bio: string;
        }>;
        objects: Array<{
            name: string;
            description: string;
        }>;
        currentAttentionObject?: string;
    };
}
export interface LiveKitState {
    isConnected: boolean;
    isConnecting: boolean;
    agentState: 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';
    room: Room | null;
    error: string | null;
}
export interface LiveKitManagerContextType {
    state: LiveKitState;
    connect: (config: LiveKitConfig) => Promise<void>;
    disconnect: () => void;
    onDeviceFailure: (error: Error) => void;
}
export declare const useLiveKitManager: () => LiveKitManagerContextType;
interface LiveKitManagerProviderProps {
    children: ReactNode;
}
export declare const LiveKitManagerProvider: React.FC<LiveKitManagerProviderProps>;
export declare const LiveKitAudioRenderer: React.FC;
export declare const LiveKitAgentVisualizer: React.FC;
export declare const LiveKitControlBar: React.FC<{
    onConnect: () => void;
}>;
export {};
