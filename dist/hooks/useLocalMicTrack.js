import { useLocalParticipant } from "@livekit/components-react";
import { Track } from "livekit-client";
import { useMemo } from "react";
export function useLocalMicTrack() {
    const { microphoneTrack, localParticipant } = useLocalParticipant();
    const micTrackRef = useMemo(() => {
        return {
            participant: localParticipant,
            source: Track.Source.Microphone,
            publication: microphoneTrack,
        };
    }, [localParticipant, microphoneTrack]);
    return micTrackRef;
}
