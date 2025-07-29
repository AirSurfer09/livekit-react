import { useCallback } from "react";
import { Room } from "livekit-client";

export const useTriggerMessageSender = (room: Room | null) => {
  const sendTriggerMessage = useCallback(
    (triggerName?: string, triggerMessage?: string) => {
      if (room && room.localParticipant) {
        const message = {
          type: "trigger-message",
          data: {
            ...(triggerName && { trigger_name: triggerName }),
            ...(triggerMessage && { trigger_message: triggerMessage }),
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
        });

        console.log("🎯 Trigger message sent:", { triggerName, triggerMessage });
      }
    },
    [room],
  );

  return {
    sendTriggerMessage,
  };
}; 