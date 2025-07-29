import { Room } from "livekit-client";
export declare const useUserTextMessageSender: (room: Room | null, participantSid?: string) => {
    sendUserTextMessage: (text: string) => void;
};
