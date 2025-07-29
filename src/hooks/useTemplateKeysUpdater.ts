import { useCallback } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

export interface TemplateKeys {
  [key: string]: string;
}

export const useTemplateKeysUpdater = (room: Room | null, participantSid?: string) => {
  const updateTemplateKeys = useCallback(
    (templateKeys: TemplateKeys) => {
      if (
        room &&
        room.localParticipant &&
        Object.keys(templateKeys).length > 0
      ) {
        const message = {
          type: "update-template-keys",
          data: {
            template_keys: templateKeys,
            participant_sid: participantSid || room.localParticipant.sid,
          },
        };

        const encodedData = new TextEncoder().encode(JSON.stringify(message));
        room.localParticipant.publishData(encodedData, {
          reliable: true,
        });

        logger.log("🔑 Template keys updated:", templateKeys, "SID:", participantSid || room.localParticipant.sid);
      }
    },
    [room, participantSid],
  );

  return {
    updateTemplateKeys,
  };
};

