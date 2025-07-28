export interface LiveKitClientConfig {
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
export declare const useLiveKitClient: () => {
    isConnected: boolean;
    isConnecting: boolean;
    agentState: "disconnected" | "connecting" | "listening" | "thinking" | "speaking";
    room: import("livekit-client").Room | null;
    error: string | null;
    connect: (config: LiveKitClientConfig) => Promise<void>;
    disconnect: () => void;
};
