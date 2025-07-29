import { useCallback } from "react";
import { Room } from "livekit-client";

export interface TemplateKeys {
  [key: string]: string;
}

export const useTemplateKeysUpdater = (room: Room | null) => {
  const updateTemplateKeys = useCallback(
    (templateKeys: TemplateKeys) => {
      if (room && room.localParticipant && Object.keys(templateKeys).length > 0) {
        const message = {
          type: "update-template-keys",
          data: {
            template_keys: templateKeys,
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
        });

        console.log("🔑 Template keys updated:", templateKeys);
      }
    },
    [room],
  );

  return {
    updateTemplateKeys,
  };
}; 