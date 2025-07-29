import { TrackReferenceOrPlaceholder } from "@livekit/components-react";
/**
 * Hook to get the local camera track reference from LiveKit.
 *
 * Returns a track reference that can be used with LiveKit components
 * to display the local participant's camera feed.
 *
 * @returns {TrackReferenceOrPlaceholder} Track reference for the local camera
 *
 * @example
 * ```tsx
 * function VideoComponent() {
 *   const cameraTrackRef = useLocalCameraTrack();
 *
 *   return (
 *     <VideoTrack trackRef={cameraTrackRef} />
 *   );
 * }
 * ```
 */
export declare const useLocalCameraTrack: () => TrackReferenceOrPlaceholder;
//# sourceMappingURL=useLocalCameraTrack.d.ts.map