import { useState, useEffect, useCallback, useMemo } from 'react';
import { Room, RoomEvent, Track } from 'livekit-client';
const DEFAULT_CORE_SERVICE_URL = "https://realtime-api.convai.com";
export const useConvaiClient = () => {
    const [room, setRoom] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [messages, setMessages] = useState([]);
    const [transcriptions, setTranscriptions] = useState([]);
    const [agentState, setAgentState] = useState('disconnected');
    const [videoTrack, setVideoTrack] = useState(null);
    const [audioTrack, setAudioTrack] = useState(null);
    // Create client state
    const state = useMemo(() => ({
        isConnected,
        isConnecting,
        isListening: agentState === 'listening',
        isThinking: agentState === 'thinking',
        isSpeaking: agentState === 'speaking',
        agentState
    }), [isConnected, isConnecting, agentState]);
    // Process transcriptions into chat messages
    useEffect(() => {
        const newMessages = transcriptions.map((segment) => ({
            [segment.role === 'user' ? 'user' : 'convai']: segment.text,
            timestamp: segment.firstReceivedTime,
            role: segment.role === 'assistant' ? 'convai' : segment.role
        }));
        setMessages(newMessages);
    }, [transcriptions]);
    // Handle data messages
    const handleDataReceived = useCallback((payload, participant) => {
        try {
            const decoder = new TextDecoder();
            const messageString = decoder.decode(payload);
            const messageData = JSON.parse(messageString);
            console.group('📨 WebRTC Data Message Received');
            console.log('From:', participant?.identity || 'Unknown participant');
            console.log('Message Type:', messageData.type || 'No type specified');
            console.log('Parsed Data:', messageData);
            console.groupEnd();
            // Handle transcription messages
            if (messageData.type === 'transcription') {
                const newTranscription = {
                    id: Date.now().toString(),
                    text: messageData.data.text || '',
                    role: messageData.data.role || 'assistant',
                    firstReceivedTime: Date.now()
                };
                setTranscriptions(prev => [...prev, newTranscription]);
            }
            // Handle agent state updates
            if (messageData.type === 'agent-state') {
                setAgentState(messageData.data.state || 'disconnected');
            }
        }
        catch (error) {
            console.error('Failed to parse data message:', error);
        }
    }, []);
    // Connect function
    const connect = useCallback(async (config) => {
        if (!config.apiKey || !config.characterId) {
            throw new Error('apiKey and characterId are required');
        }
        setIsConnecting(true);
        setAgentState('connecting');
        try {
            // Create new room instance
            const newRoom = new Room();
            setRoom(newRoom);
            // Set up room event listeners
            newRoom.on(RoomEvent.DataReceived, handleDataReceived);
            newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
                if (track.kind === Track.Kind.Video) {
                    setVideoTrack({ track, publication, participant });
                }
                else if (track.kind === Track.Kind.Audio) {
                    setAudioTrack({ track, publication, participant });
                }
            });
            // Prepare request body with defaults
            const requestBody = {
                character_id: config.characterId,
                transport: "livekit",
                connection_type: "audio",
                llm_provider: config.llmProvider || "gemini-baml",
                ...(config.actionConfig && { action_config: config.actionConfig })
            };
            // Call Core Service API
            const response = await fetch(`${config.url || DEFAULT_CORE_SERVICE_URL}/connect`, {
                method: "POST",
                headers: {
                    'x-api-key': config.apiKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const connectionData = await response.json();
            console.log('Connection data received:', connectionData);
            // Connect to room
            await newRoom.connect(connectionData.room_url, connectionData.token, {
                rtcConfig: {
                    iceTransportPolicy: 'relay'
                }
            });
            // Enable audio/video based on config
            if (config.enableAudio !== false) {
                await newRoom.localParticipant.setMicrophoneEnabled(true);
            }
            if (config.enableVideo !== false) {
                await newRoom.localParticipant.setCameraEnabled(true);
            }
            setIsConnected(true);
            setAgentState('listening');
            console.log('Connected to room:', connectionData.room_name);
            console.log('Session ID:', connectionData.session_id);
        }
        catch (error) {
            console.error('Connection failed:', error);
            setIsConnected(false);
            setAgentState('disconnected');
            throw error;
        }
        finally {
            setIsConnecting(false);
        }
    }, [handleDataReceived]);
    // Disconnect function
    const disconnect = useCallback(() => {
        if (room) {
            room.disconnect();
            setIsConnected(false);
            setAgentState('disconnected');
            setRoom(null);
            setVideoTrack(null);
            setAudioTrack(null);
            setTranscriptions([]);
            setMessages([]);
        }
    }, [room]);
    // RTVI trigger function
    const sendRTVI = useCallback((triggerName, message) => {
        if (!room || !isConnected) {
            console.warn('Cannot send RTVI: not connected');
            return;
        }
        const payload = {
            type: 'rtvi-trigger',
            data: {
                trigger_name: triggerName,
                trigger_message: message || ''
            }
        };
        try {
            const encoder = new TextEncoder();
            const bytes = encoder.encode(JSON.stringify(payload));
            room.localParticipant.publishData(bytes);
            console.log('RTVI trigger sent:', payload);
        }
        catch (error) {
            console.error('Failed to send RTVI trigger:', error);
        }
    }, [room, isConnected]);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (room) {
                room.disconnect();
            }
        };
    }, [room]);
    return {
        state,
        connect,
        disconnect,
        messages,
        transcriptions,
        room,
        videoTrack,
        audioTrack,
        sendRTVI
    };
};
