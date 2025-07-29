import { useCallback } from "react";
import { logger } from "../utils/logger";
/**
 * Hook for sending user text messages to Convai.
 *
 * Sends programmatic text messages that are processed by the AI assistant
 * but not displayed in the chat interface.
 *
 * @param {Room} room - LiveKit room instance
 * @param {string} participantSid - Participant session ID
 * @returns {Object} Object containing sendUserTextMessage function
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const { sendUserTextMessage } = useUserTextMessageSender(room, participantSid);
 *
 *   const handleSendMessage = () => {
 *     sendUserTextMessage("Hello, how are you?");
 *   };
 *
 *   return <button onClick={handleSendMessage}>Send Message</button>;
 * }
 * ```
 */
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
//# sourceMappingURL=useUserTextMessageSender.js.map