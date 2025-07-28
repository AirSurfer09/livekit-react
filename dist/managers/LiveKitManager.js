import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent } from 'livekit-client';
import { RoomContext, useVoiceAssistant, RoomAudioRenderer, VoiceAssistantControlBar, DisconnectButton, BarVisualizer, VideoTrack } from '@livekit/components-react';
const LiveKitManagerContext = createContext(null);
export const useLiveKitManager = () => {
    const context = useContext(LiveKitManagerContext);
    if (!context) {
        throw new Error('useLiveKitManager must be used within a LiveKitManagerProvider');
    }
    return context;
};
export const LiveKitManagerProvider = ({ children }) => {
    const [room] = useState(new Room());
    const [state, setState] = useState({
        isConnected: false,
        isConnecting: false,
        agentState: 'disconnected',
        room: null,
        error: null,
    });
    const onDeviceFailure = useCallback((error) => {
        console.error(error);
        alert("Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab");
    }, []);
    const connect = useCallback(async (config) => {
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
            await room.connect(connectionData.room_url, connectionData.token, {
                rtcConfig: {
                    iceTransportPolicy: 'relay'
                }
            });
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
        }
        catch (error) {
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
    const contextValue = {
        state,
        connect,
        disconnect,
        onDeviceFailure,
    };
    return (_jsx(LiveKitManagerContext.Provider, { value: contextValue, children: _jsx(RoomContext.Provider, { value: room, children: children }) }));
};
// Components that use the LiveKit manager
export const LiveKitAudioRenderer = () => {
    return _jsx(RoomAudioRenderer, {});
};
export const LiveKitAgentVisualizer = () => {
    const { state: agentState, videoTrack, audioTrack } = useVoiceAssistant();
    if (videoTrack) {
        return (_jsx("div", { className: "h-[512px] w-[512px] rounded-lg overflow-hidden", children: _jsx(VideoTrack, { trackRef: videoTrack }) }));
    }
    return (_jsx("div", { className: "h-[300px] w-full", children: _jsx(BarVisualizer, { state: agentState, barCount: 5, trackRef: audioTrack, className: "agent-visualizer", options: { minHeight: 24 } }) }));
};
export const LiveKitControlBar = ({ onConnect }) => {
    const { state: agentState } = useVoiceAssistant();
    return (_jsxs("div", { className: "relative h-[60px]", children: [agentState === "disconnected" && (_jsx("button", { className: "uppercase absolute left-1/2 -translate-x-1/2 px-4 py-2 bg-white text-black rounded-md", onClick: onConnect, children: "Start a conversation" })), agentState !== "disconnected" && agentState !== "connecting" && (_jsxs("div", { className: "flex h-8 absolute left-1/2 -translate-x-1/2 justify-center items-center gap-2", children: [_jsx(VoiceAssistantControlBar, { controls: { leave: false } }), _jsx(DisconnectButton, { children: _jsx(CloseIcon, {}) })] }))] }));
};
// Re-export CloseIcon for convenience
const CloseIcon = () => (_jsx("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: _jsx("path", { d: "M3.16602 3.16666L12.8327 12.8333M12.8327 3.16666L3.16602 12.8333", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "square" }) }));
