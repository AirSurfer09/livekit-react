import { useCallback } from "react";
import { Room } from "livekit-client";

export interface DynamicInfo {
  text: string;
}

export const useDynamicInfoUpdater = (room: Room | null) => {
  const updateDynamicInfo = useCallback(
    (dynamicInfo: DynamicInfo) => {
      if (room && room.localParticipant && dynamicInfo.text?.trim()) {
        const message = {
          type: "update-dynamic-info",
          data: {
            dynamic_info: {
              text: dynamicInfo.text.trim(),
            },
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
          destinationSids: [], // Send to all participants
        });

        console.log("🔄 Dynamic info updated:", dynamicInfo.text);
      }
    },
    [room],
  );

  return {
    updateDynamicInfo,
  };
};

