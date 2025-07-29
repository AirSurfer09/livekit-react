import {
  TrackReferenceOrPlaceholder,
  useLocalParticipant,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo } from "react";

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
