import { useLocalParticipant } from "@livekit/components-react";
import { useCallback } from "react";
/**
 * React hook for sending RTVI trigger messages through LiveKit data channel
 */
export function useRTVITriggerSender() {
    const { localParticipant } = useLocalParticipant();
    const sendTriggerMessage = useCallback(async (payload) => {
        if (!localParticipant) {
            throw new Error("Local participant is not available");
        }
        // Validate payload
        if (!payload.trigger_name && !payload.trigger_message) {
            throw new Error("Either trigger_name or trigger_message must be provided");
        }
        // Create RTVI message with trigger-message type
        const rtviMessage = {
            type: "trigger-message",
            data: payload
        };
        // Send the message through LiveKit's data channel
        const encoder = new TextEncoder();
        const data = encoder.encode(JSON.stringify(rtviMessage));
        await localParticipant.publishData(data);
        console.log('RTVI trigger message sent:', rtviMessage);
    }, [localParticipant]);
    const sendTriggerByName = useCallback(async (triggerName) => {
        await sendTriggerMessage({ trigger_name: triggerName });
    }, [sendTriggerMessage]);
    const sendTriggerByMessage = useCallback(async (triggerMessage) => {
        await sendTriggerMessage({ trigger_message: triggerMessage });
    }, [sendTriggerMessage]);
    return {
        sendTriggerMessage,
        sendTriggerByName,
        sendTriggerByMessage,
        isConnected: localParticipant !== null
    };
}
