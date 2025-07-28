// Export types here
export interface ConvaiConfig {
  url?: string;
  token: string;
  character_id?: string;
  transport?: string;
  connection_type?: string;
  llm_provider?: string;
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
export type AgentState = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';

// Video track reference type
export interface VideoTrackRef {
  participant: any;
  source: any;
  publication: any;
} 