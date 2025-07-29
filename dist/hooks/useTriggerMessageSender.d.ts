import { Room } from "livekit-client";
export declare const useTriggerMessageSender: (room: Room | null, participantSid?: string) => {
    sendTriggerMessage: (triggerName?: string, triggerMessage?: string) => void;
};
