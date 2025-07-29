import { useCallback } from "react";
import { logger } from "../utils/logger";
export const useUserTextMessageSender = (room, participantSid) => {
    const sendUserTextMessage = useCallback((text) => {
        if (room && room.localParticipant && text.trim()) {
            const message = {
                type: "user_text_message",
                data: {
                    text: text.trim(),
                    participant_sid: participantSid || room.localParticipant.sid,
                },
            };
            const encodedData = new TextEncoder().encode(JSON.stringify(message));
            room.localParticipant.publishData(encodedData, {
                reliable: true,
            });
            logger.log("💬 User text message sent:", text.trim(), "SID:", participantSid || room.localParticipant.sid);
        }
    }, [room, participantSid]);
    return {
        sendUserTextMessage,
    };
};
