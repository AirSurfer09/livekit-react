import { Room } from "livekit-client";
/**
 * Hook for sending trigger messages to Convai.
 *
 * Sends system trigger messages that can activate specific behaviors
 * or responses from the AI assistant.
 *
 * @param {Room} room - LiveKit room instance
 * @param {string} participantSid - Participant session ID
 * @returns {Object} Object containing sendTriggerMessage function
 *
 * @example
 * ```tsx
 * function TriggerComponent() {
 *   const { sendTriggerMessage } = useTriggerMessageSender(room, participantSid);
 *
 *   const handleTrigger = () => {
 *     sendTriggerMessage("character_introduction", "User just entered the room");
 *   };
 *
 *   return <button onClick={handleTrigger}>Send Trigger</button>;
 * }
 * ```
 */
export declare const useTriggerMessageSender: (room: Room, participantSid: string) => {
    sendTriggerMessage: (triggerName?: string, triggerMessage?: string) => void;
};
//# sourceMappingURL=useTriggerMessageSender.d.ts.map