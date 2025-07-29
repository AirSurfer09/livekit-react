import { useCallback } from "react";
import { logger } from "../utils/logger";
export const useTemplateKeysUpdater = (room, participantSid) => {
    const updateTemplateKeys = useCallback((templateKeys) => {
        if (room &&
            room.localParticipant &&
            Object.keys(templateKeys).length > 0) {
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
    }, [room, participantSid]);
    return {
        updateTemplateKeys,
    };
};
