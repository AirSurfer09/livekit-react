import { Room } from "livekit-client";
import { ChatMessage } from "../types";
export declare const useMessageHandler: (room: Room | null, setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>) => {
    setupMessageListener: () => (() => void) | undefined;
};
