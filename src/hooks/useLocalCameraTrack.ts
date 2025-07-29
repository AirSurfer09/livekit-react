import {
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo } from "react";

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
export const useLocalCameraTrack = () => {
  const { cameraTrack, localParticipant } = useLocalParticipant();

  const cameraTrackRef: TrackReferenceOrPlaceholder = useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Camera,
      publication: cameraTrack,
    };
  }, [localParticipant, cameraTrack]);

  return cameraTrackRef;
};
