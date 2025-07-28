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
export interface DataMessage {
    type: string;
    data: any;
    timestamp: string;
    participantId?: string;
    participantSid?: string;
}
export type AgentState = 'disconnected' | 'connecting' | 'listening' | 'thinking' | 'speaking';
export interface VideoTrackRef {
    participant: any;
    source: any;
    publication: any;
}
