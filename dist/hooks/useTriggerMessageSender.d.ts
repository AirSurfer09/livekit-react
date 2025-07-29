import { Room } from "livekit-client";
export declare const useTriggerMessageSender: (room: Room | null) => {
    sendTriggerMessage: (triggerName?: string, triggerMessage?: string) => void;
};
