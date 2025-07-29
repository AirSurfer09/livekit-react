import { useCallback } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

export const useUserTextMessageSender = (room: Room | null, participantSid?: string) => {
  const sendUserTextMessage = useCallback(
    (text: string) => {
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
    },
    [room, participantSid],
  );

  return {
    sendUserTextMessage,
  };
};

