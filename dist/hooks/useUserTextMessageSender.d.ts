import { Room } from "livekit-client";
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
export declare const useUserTextMessageSender: (room: Room, participantSid: string) => {
    sendUserTextMessage: (text: string) => void;
};
//# sourceMappingURL=useUserTextMessageSender.d.ts.map