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
/**
 * Hook for managing audio controls in LiveKit.
 *
 * Provides methods to enable/disable microphone, manage audio devices,
 * and control audio visibility state.
 *
 * @param {Room | null} room - LiveKit room instance
 * @returns {AudioControls} Object containing audio control methods and state
 *
 * @example
 * ```tsx
 * function AudioControls() {
 *   const audioControls = useAudioControls(room);
 *
 *   return (
 *     <div>
 *       <button onClick={audioControls.toggleAudio}>
 *         {audioControls.isAudioEnabled ? 'Mute' : 'Unmute'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export declare const useAudioControls: (room: Room | null) => AudioControls;
//# sourceMappingURL=useAudioControls.d.ts.map