import { useCallback } from "react";
import { logger } from "../utils/logger";
export const useTriggerMessageSender = (room, participantSid) => {
    const sendTriggerMessage = useCallback((triggerName, triggerMessage) => {
        if (room && room.localParticipant) {
            const message = {
                type: "trigger-message",
                data: {
                    ...(triggerName && { trigger_name: triggerName }),
                    ...(triggerMessage && { trigger_message: triggerMessage }),
                    participant_sid: participantSid || room.localParticipant.sid,
                },
            };
            const encodedData = new TextEncoder().encode(JSON.stringify(message));
            room.localParticipant.publishData(encodedData, {
                reliable: true,
            });
            logger.log("🎯 Trigger message sent:", {
                triggerName,
                triggerMessage,
                sid: participantSid || room.localParticipant.sid,
            });
        }
    }, [room, participantSid]);
    return {
        sendTriggerMessage,
    };
};
