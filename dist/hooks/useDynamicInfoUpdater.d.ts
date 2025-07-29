import { Room } from "livekit-client";
export interface DynamicInfo {
    text: string;
}
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
export declare const useDynamicInfoUpdater: (room: Room, participantSid: string) => {
    updateDynamicInfo: (dynamicInfo: DynamicInfo) => void;
};
//# sourceMappingURL=useDynamicInfoUpdater.d.ts.map