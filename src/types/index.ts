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

export interface ChatMessage {
  id: string;
  type: 'user' | 'convai' | 'emotion' | 'behavior-tree' | 'action' | 'user-llm-text' | 'bot-llm-text' | 'bot-emotion';
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

import { AudioControls } from "../hooks/useAudioControls";
import { VideoControls } from "../hooks/useVideoControls";

export interface ConvaiClient {
  state: ConvaiClientState;
  connect: (config: ConvaiConfig) => Promise<void>;
  disconnect: () => Promise<void>;
  room: Room;
  videoTrack: any;
  audioTrack: any;
  sendUserTextMessage: (text: string) => void;
  sendTriggerMessage: (triggerName?: string, triggerMessage?: string) => void;
  updateTemplateKeys: (templateKeys: { [key: string]: string }) => void;
  updateDynamicInfo: (dynamicInfo: { text: string }) => void;
  chatMessages: ChatMessage[];
  audioControls: AudioControls;
  videoControls: VideoControls;
} 