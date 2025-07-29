import { useCallback } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

export const useTriggerMessageSender = (room: Room | null, participantSid?: string) => {
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

