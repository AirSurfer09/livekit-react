import { ConvaiClient, ChatMessage } from "../types";
/**
 * Main hook for managing Convai client connection and functionality.
 *
 * Provides a complete interface for connecting to Convai's AI-powered voice assistants,
 * managing real-time audio/video conversations, and handling various message types.
 *
 * @returns {ConvaiClient & { activity: string; chatMessages: ChatMessage[] }} Complete client interface with connection state, methods, and message history
 *
 * @example
 * ```tsx
 * function App() {
 *   const convaiClient = useConvaiClient();
 *
 *   const connect = async () => {
 *     await convaiClient.connect({
 *       apiKey: 'your-api-key',
 *       characterId: 'your-character-id',
 *       enableVideo: true,
 *       enableAudio: true
 *     });
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={connect}>Connect</button>
 *       <p>Status: {convaiClient.state.isConnected ? 'Connected' : 'Disconnected'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export declare const useConvaiClient: () => ConvaiClient & {
    activity: string;
    chatMessages: ChatMessage[];
};
//# sourceMappingURL=useConvaiClient.d.ts.map