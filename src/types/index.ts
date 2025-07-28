// Export types here
export interface ConvaiConfig {
  // Required fields
  apiKey: string;
  characterId: string;
  
  // Optional fields with defaults
  enableVideo?: boolean;
  enableAudio?: boolean;
  url?: string;
  llmProvider?: string;
  
  // Action configuration
  actionConfig?: {
    actions?: string[];
    characters?: Array<{
      name: string;
      bio: string;
    }>;
    objects?: Array<{
      name: string;
      description: string;
    }>;
    currentAttentionObject?: string;
  };
}

export interface RoomState {
  isConnected: boolean;
  participants: any[];
}

export interface ConnectionData {
  room_url: string;
  token: string;
  room_name: string;
  session_id: string;
}

// RTVI Message structure for trigger messages
export interface RTVIMessage {
  type: string;
  data: any;
}

export interface TriggerPayload {
  trigger_name?: string;
  trigger_message?: string;
}

export interface TranscriptionSegment {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  firstReceivedTime: number;
}

// Data message types
export interface DataMessage {
  type: string;
  data: any;
  timestamp: string;
  participantId?: string;
  participantSid?: string;
}

// Agent state types (re-export from LiveKit)
export type AgentState = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'initializing';

// Video track reference type
export interface VideoTrackRef {
  participant: any;
  source: any;
  publication: any;
} 

// Chat message types for better formatting
export interface ChatMessage {
  user?: string;
  convai?: string;
  timestamp: number;
  role: 'user' | 'convai' | 'assistant';
}

// Client state interface
export interface ConvaiClientState {
  isConnected: boolean;
  isConnecting: boolean;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  agentState: AgentState;
}

// Client interface
export interface ConvaiClient {
  // State
  state: ConvaiClientState;
  
  // Connection methods
  connect: (config: ConvaiConfig) => Promise<void>;
  disconnect: () => void;
  
  // Data
  messages: ChatMessage[];
  transcriptions: TranscriptionSegment[];
  
  // Room and tracks
  room: any;
  videoTrack: any;
  audioTrack: any;
  
  // RTVI controls
  sendRTVI: (triggerName: string, message?: string) => void;
} 