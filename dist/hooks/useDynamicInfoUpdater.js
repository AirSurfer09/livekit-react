import { useCallback } from "react";
import { logger } from "../utils/logger";
/**
 * Hook for updating dynamic information in Convai.
 *
 * Updates contextual information that can be used by the AI assistant
 * to provide more relevant and up-to-date responses.
 *
 * @param {Room} room - LiveKit room instance
 * @param {string} participantSid - Participant session ID
 * @returns {Object} Object containing updateDynamicInfo function
 *
 * @example
 * ```tsx
 * function DynamicInfoComponent() {
 *   const { updateDynamicInfo } = useDynamicInfoUpdater(room, participantSid);
 *
 *   const handleUpdate = () => {
 *     updateDynamicInfo({
 *       text: "The user is now exploring a virtual museum"
 *     });
 *   };
 *
 *   return <button onClick={handleUpdate}>Update Info</button>;
 * }
 * ```
 */
export const useDynamicInfoUpdater = (room, participantSid) => {
    const updateDynamicInfo = useCallback((dynamicInfo) => {
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
    }, [room, participantSid]);
    return {
        updateDynamicInfo,
    };
};
//# sourceMappingURL=useDynamicInfoUpdater.js.map