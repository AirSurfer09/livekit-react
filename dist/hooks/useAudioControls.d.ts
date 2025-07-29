import { Room } from "livekit-client";
export interface AudioControls {
    isAudioEnabled: boolean;
    isAudioMuted: boolean;
    audioLevel: number;
    enableAudio: () => Promise<void>;
    disableAudio: () => Promise<void>;
    muteAudio: () => Promise<void>;
    unmuteAudio: () => Promise<void>;
    toggleAudio: () => Promise<void>;
    setAudioDevice: (deviceId: string) => Promise<void>;
    getAudioDevices: () => Promise<MediaDeviceInfo[]>;
    startAudioLevelMonitoring: () => void;
    stopAudioLevelMonitoring: () => void;
}
export declare const useAudioControls: (room: Room | null) => AudioControls;
