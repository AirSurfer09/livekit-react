import { Room } from "livekit-client";
export interface DynamicInfo {
    text: string;
}
export declare const useDynamicInfoUpdater: (room: Room | null, participantSid?: string) => {
    updateDynamicInfo: (dynamicInfo: DynamicInfo) => void;
};
