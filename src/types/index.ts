import { Room } from 'livekit-client';

export interface ConvaiConfig {
  apiKey: string;
  characterId: string;
  url?: string;
  enableAudio?: boolean;
  enableVideo?: boolean;
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

// Message types for chat display
export interface ChatMessage {
  id: string;
  type: 'user' | 'convai' | 'emotion' | 'behavior-tree';
  content: string;
  timestamp: string;
}

export interface ConvaiClientState {
  isConnected: boolean;
  isConnecting: boolean;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  agentState: 'disconnected' | 'connected' | 'listening' | 'thinking' | 'speaking';
}

export interface ConvaiClient {
  state: ConvaiClientState;
  connect: (config: ConvaiConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  messages: any[];
  transcriptions: any[];
  room: Room;
  videoTrack: any;
  audioTrack: any;
  sendRTVI: (triggerName: string, message?: string) => void;
  chatMessages: ChatMessage[];
} 