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
/**
 * Hook for managing video controls in LiveKit.
 *
 * Provides methods to enable/disable camera, manage video devices,
 * and control video visibility state.
 *
 * @param {Room | null} room - LiveKit room instance
 * @returns {VideoControls} Object containing video control methods and state
 *
 * @example
 * ```tsx
 * function VideoControls() {
 *   const videoControls = useVideoControls(room);
 *
 *   return (
 *     <div>
 *       <button onClick={videoControls.toggleVideo}>
 *         {videoControls.isVideoEnabled ? 'Disable Camera' : 'Enable Camera'}
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export declare const useVideoControls: (room: Room | null) => VideoControls;
//# sourceMappingURL=useVideoControls.d.ts.map