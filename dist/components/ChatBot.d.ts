import React from "react";
import { ConvaiClient } from "../types";
interface ChatBotProps {
    convaiClient: ConvaiClient & {
        activity?: string;
    };
    onConnect: () => void;
}
/**
 * ChatBot component for real-time conversation with Convai AI assistants.
 *
 * Provides a complete chat interface with message history, typing indicators,
 * connection status, and audio controls. Supports both text and voice interactions.
 *
 * @param {ChatBotProps} props - Component props
 * @param {ConvaiClient} props.convaiClient - Convai client instance with activity status
 * @param {Function} props.onConnect - Callback function to handle connection
 *
 * @example
 * ```tsx
 * function App() {
 *   const convaiClient = useConvaiClient();
 *
 *   const handleConnect = async () => {
 *     await convaiClient.connect({
 *       apiKey: 'your-api-key',
 *       characterId: 'your-character-id'
 *     });
 *   };
 *
 *   return (
 *     <ChatBot
 *       convaiClient={convaiClient}
 *       onConnect={handleConnect}
 *     />
 *   );
 * }
 * ```
 */
export declare const ChatBot: React.FC<ChatBotProps>;
export {};
//# sourceMappingURL=ChatBot.d.ts.map