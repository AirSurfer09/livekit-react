import { useTrackTranscription, useVoiceAssistant } from "@livekit/components-react";
import { useMemo } from "react";
import { useLocalMicTrack } from "./useLocalMicTrack";
import { TranscriptionSegment } from "../types";

export default function useCombinedTranscriptions(): TranscriptionSegment[] {
  const { agentTranscriptions } = useVoiceAssistant();

  const micTrackRef = useLocalMicTrack();
  const { segments: userTranscriptions } = useTrackTranscription(micTrackRef);

  const combinedTranscriptions = useMemo(() => {
    return [
      ...agentTranscriptions.map((val) => {
        return { ...val, role: "assistant" as const };
      }),
      ...userTranscriptions.map((val) => {
        return { ...val, role: "user" as const };
      }),
    ].sort((a, b) => a.firstReceivedTime - b.firstReceivedTime);
  }, [agentTranscriptions, userTranscriptions]);

  return combinedTranscriptions;
} 