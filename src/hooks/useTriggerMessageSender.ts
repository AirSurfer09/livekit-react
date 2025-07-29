import { useCallback } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

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
export const useTriggerMessageSender = (
  room: Room,
  participantSid: string,
) => {
  const sendTriggerMessage = useCallback(
    (triggerName?: string, triggerMessage?: string) => {
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
    },
    [room, participantSid],
  );

  return {
    sendTriggerMessage,
  };
};

