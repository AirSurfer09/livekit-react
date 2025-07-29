import { useCallback } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

export interface DynamicInfo {
  text: string;
}

export const useDynamicInfoUpdater = (room: Room | null, participantSid?: string) => {
  const updateDynamicInfo = useCallback(
    (dynamicInfo: DynamicInfo) => {
      if (room && room.localParticipant && dynamicInfo.text?.trim()) {
        const message = {
          type: "update-dynamic-info",
          data: {
            dynamic_info: {
              text: dynamicInfo.text.trim(),
            },
            participant_sid: participantSid || room.localParticipant.sid,
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
        });

        logger.log("🔄 Dynamic info updated:", dynamicInfo.text, "SID:", participantSid || room.localParticipant.sid);
      }
    },
    [room, participantSid],
  );

  return {
    updateDynamicInfo,
  };
};

