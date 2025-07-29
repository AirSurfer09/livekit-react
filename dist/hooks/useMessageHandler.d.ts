import { Room } from "livekit-client";
import { ChatMessage } from "../types";
/**
 * Hook for handling incoming messages from Convai.
 *
 * Sets up data message listeners to process various message types
 * from the AI assistant and updates the chat message history.
 *
 * @param {Room} room - LiveKit room instance
 * @param {Function} setChatMessages - Function to update chat messages state
 * @returns {Function} Cleanup function to remove message listeners
 *
 * @example
 * ```tsx
 * function ChatComponent() {
 *   const [chatMessages, setChatMessages] = useState([]);
 *   const cleanup = useMessageHandler(room, setChatMessages);
 *
 *   useEffect(() => {
 *     return cleanup;
 *   }, []);
 * }
 * ```
 */
export declare const useMessageHandler: (room: Room, setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    setupMessageListener: () => (() => void) | undefined;
};
//# sourceMappingURL=useMessageHandler.d.ts.map