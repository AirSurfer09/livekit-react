import React, { ReactNode, createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { 
  RoomContext, 
  useVoiceAssistant, 
  RoomAudioRenderer,
  VoiceAssistantControlBar,
  DisconnectButton,
  BarVisualizer,
  VideoTrack
} from '@livekit/components-react';

export interface LiveKitConfig {
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

const LiveKitManagerContext = createContext<LiveKitManagerContextType | null>(null);

export const useLiveKitManager = () => {
  const context = useContext(LiveKitManagerContext);
  if (!context) {
    throw new Error('useLiveKitManager must be used within a LiveKitManagerProvider');
  }
  return context;
};

interface LiveKitManagerProviderProps {
  children: ReactNode;
}

export const LiveKitManagerProvider: React.FC<LiveKitManagerProviderProps> = ({ children }) => {
  const [room] = useState(new Room());
  const [state, setState] = useState<LiveKitState>({
    isConnected: false,
    isConnecting: false,
    agentState: 'disconnected',
    room: null,
    error: null,
  });

  const onDeviceFailure = useCallback((error: Error) => {
    console.error(error);
    alert(
      "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
    );
  }, []);

  const connect = useCallback(async (config: LiveKitConfig) => {
    const coreServiceUrl = config.coreServiceUrl || "https://realtime-api.convai.com";
    
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      const response = await fetch(`${coreServiceUrl}/connect`, {
        method: "POST",
        headers: {
          'x-api-key': config.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          character_id: config.characterId,
          transport: "livekit",
          connection_type: "audio",
          llm_provider: config.llmProvider || "gemini-baml",
          action_config: config.actionConfig,
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const connectionData = await response.json();
      console.log('Connection data received:', connectionData);
      
      await room.connect(
        connectionData.room_url,
        connectionData.token,
        {
          rtcConfig: {
            iceTransportPolicy: 'relay'
          }
        }
      );
      
      // Enable microphone and camera based on config
      if (config.enableAudio !== false) {
        await room.localParticipant.setMicrophoneEnabled(true);
      }
      if (config.enableVideo !== false) {
        await room.localParticipant.setCameraEnabled(true);
      }
      
      console.log('Connected to room:', connectionData.room_name);
      console.log('Session ID:', connectionData.session_id);
      
      setState(prev => ({
        ...prev,
        isConnected: true,
        isConnecting: false,
        room,
        agentState: 'connecting'
      }));
      
    } catch (error) {
      console.error('Connection failed:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      }));
      throw error;
    }
  }, [room]);

  const disconnect = useCallback(() => {
    room.disconnect();
    setState({
      isConnected: false,
      isConnecting: false,
      agentState: 'disconnected',
      room: null,
      error: null,
    });
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room, onDeviceFailure]);

  const contextValue: LiveKitManagerContextType = {
    state,
    connect,
    disconnect,
    onDeviceFailure,
  };

  return (
    <LiveKitManagerContext.Provider value={contextValue}>
      <RoomContext.Provider value={room}>
        {children}
      </RoomContext.Provider>
    </LiveKitManagerContext.Provider>
  );
};

// Components that use the LiveKit manager
export const LiveKitAudioRenderer: React.FC = () => {
  return <RoomAudioRenderer />;
};

export const LiveKitAgentVisualizer: React.FC = () => {
  const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();

  if (videoTrack) {
    return (
      <div className="h-[512px] w-[512px] rounded-lg overflow-hidden">
        <VideoTrack trackRef={videoTrack} />
      </div>
    );
  }
  return (
    <div className="h-[300px] w-full">
      <BarVisualizer
        state={agentState}
        barCount={5}
        trackRef={audioTrack}
        className="agent-visualizer"
        options={{ minHeight: 24 }}
      />
    </div>
  );
};

export const LiveKitControlBar: React.FC<{ onConnect: () => void }> = ({ onConnect }) => {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="relative h-[60px]">
      {agentState === "disconnected" && (
        <button
          className="uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md"
          onClick={onConnect}
        >
          Start a conversation
        </button>
      )}
      {agentState !== "disconnected" && agentState !== "connecting" && (
        <div className="flex h-8 absolute left-1/2 -translate-x-1/2 justify-center items-center gap-2">
          <VoiceAssistantControlBar controls={{ leave: false }} />
          <DisconnectButton>
            <CloseIcon />
          </DisconnectButton>
        </div>
      )}
    </div>
  );
};

// Re-export CloseIcon for convenience
const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.16602 3.16666L12.8327 12.8333M12.8327 3.16666L3.16602 12.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
); 