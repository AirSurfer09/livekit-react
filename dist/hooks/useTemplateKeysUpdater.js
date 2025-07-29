import { useCallback } from "react";
import { logger } from "../utils/logger";
/**
 * Hook for updating template keys in Convai.
 *
 * Updates dynamic template variables that can be used in AI responses
 * to provide personalized and contextual information.
 *
 * @param {Room} room - LiveKit room instance
 * @param {string} participantSid - Participant session ID
 * @returns {Object} Object containing updateTemplateKeys function
 *
 * @example
 * ```tsx
 * function TemplateComponent() {
 *   const { updateTemplateKeys } = useTemplateKeysUpdater(room, participantSid);
 *
 *   const handleUpdate = () => {
 *     updateTemplateKeys({
 *       user_name: "John",
 *       location: "New York",
 *       mood: "happy"
 *     });
 *   };
 *
 *   return <button onClick={handleUpdate}>Update Templates</button>;
 * }
 * ```
 */
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
//# sourceMappingURL=useTemplateKeysUpdater.js.map