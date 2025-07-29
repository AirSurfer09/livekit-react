import { Room } from "livekit-client";
export declare const useUserTextMessageSender: (room: Room | null) => {
    sendUserTextMessage: (text: string) => void;
};
