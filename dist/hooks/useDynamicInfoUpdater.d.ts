import { Room } from "livekit-client";
export interface DynamicInfo {
    text: string;
}
export declare const useDynamicInfoUpdater: (room: Room | null) => {
    updateDynamicInfo: (dynamicInfo: DynamicInfo) => void;
};
