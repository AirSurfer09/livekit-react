import { Room } from "livekit-client";
export interface VideoControls {
    isVideoEnabled: boolean;
    isVideoHidden: boolean;
    enableVideo: () => Promise<void>;
    disableVideo: () => Promise<void>;
    hideVideo: () => Promise<void>;
    showVideo: () => Promise<void>;
    toggleVideo: () => Promise<void>;
    setVideoDevice: (deviceId: string) => Promise<void>;
    getVideoDevices: () => Promise<MediaDeviceInfo[]>;
    setVideoQuality: (quality: 'low' | 'medium' | 'high') => Promise<void>;
}
export declare const useVideoControls: (room: Room | null) => VideoControls;
