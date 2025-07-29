import { useCallback } from "react";
import { Room } from "livekit-client";

export const useUserTextMessageSender = (room: Room | null) => {
  const sendUserTextMessage = useCallback(
    (text: string) => {
      if (room && room.localParticipant && text.trim()) {
        const message = {
          type: "user_text_message",
          data: {
            text: text.trim(),
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
          destinationSids: [], // Send to all participants
        });

        console.log("💬 User text message sent:", text.trim());
      }
    },
    [room],
  );

  return {
    sendUserTextMessage,
  };
};

