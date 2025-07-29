import { Room } from "livekit-client";
export interface TemplateKeys {
    [key: string]: string;
}
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
export declare const useTemplateKeysUpdater: (room: Room, participantSid: string) => {
    updateTemplateKeys: (templateKeys: TemplateKeys) => void;
};
//# sourceMappingURL=useTemplateKeysUpdater.d.ts.map