import { useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo } from "react";
export function useLocalCameraTrack() {
    const { cameraTrack, localParticipant } = useLocalParticipant();
    const cameraTrackRef = useMemo(() => {
        return {
            participant: localParticipant,
            source: Track.Source.Camera,
            publication: cameraTrack,
        };
    }, [localParticipant, cameraTrack]);
    return cameraTrackRef;
}
