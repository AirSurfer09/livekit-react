import { useContext, useEffect } from "react";
import { RoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
/**
 * Hook to listen for incoming data messages from the WebRTC connection
 * Parses bytes to JSON and logs to console
 */
export function useDataMessageListener() {
    const room = useContext(RoomContext);
    useEffect(() => {
        if (!room)
            return;
        const handleDataReceived = (payload, participant) => {
            try {
                // Decode bytes to string
                const decoder = new TextDecoder();
                const messageString = decoder.decode(payload);
                // Parse JSON
                const messageData = JSON.parse(messageString);
                // Enhanced logging with more context
                console.group('📨 WebRTC Data Message Received');
                console.log('From:', participant?.identity || 'Unknown participant');
                console.log('Participant SID:', participant?.sid || 'Unknown');
                console.log('Message Type:', messageData.type || 'No type specified');
                console.log('Timestamp:', new Date().toISOString());
                console.log('Raw bytes length:', payload.length);
                console.log('Parsed Data:', messageData);
                console.groupEnd();
                // Special handling for RTVI messages
                if (messageData.type && messageData.type.includes('rtvi')) {
                    console.log('🤖 RTVI Message:', messageData);
                }
                // Special handling for trigger messages
                if (messageData.type === 'trigger-message') {
                    console.log('🎯 Trigger Message Response:', messageData);
                }
            }
            catch (error) {
                console.group('❌ Failed to parse incoming data message');
                console.error('Parse Error:', error);
                console.log('Raw bytes length:', payload.length);
                // Try to decode as string even if JSON parsing fails
                try {
                    const decoder = new TextDecoder();
                    const messageString = decoder.decode(payload);
                    console.log('Raw string content:', messageString);
                }
                catch (decodeError) {
                    console.error('Failed to decode as string:', decodeError);
                    console.log('Raw bytes (first 100):', Array.from(payload.slice(0, 100)));
                }
                console.groupEnd();
            }
        };
        // Listen for data received events
        room.on(RoomEvent.DataReceived, handleDataReceived);
        console.log('🔄 Data message listener initialized');
        // Cleanup listener on unmount
        return () => {
            room.off(RoomEvent.DataReceived, handleDataReceived);
            console.log('🔄 Data message listener cleaned up');
        };
    }, [room]);
    return {
        isListening: room !== null
    };
}
