import { VideoTrack } from "@livekit/components-react";
import { Room } from "livekit-client";
import { useState, useEffect } from "react";
import { Track } from "livekit-client";

export interface LocalVideoDisplayProps {
  room?: Room | null;
}

export function LocalVideoDisplay({ room }: LocalVideoDisplayProps) {
  const [cameraTrack, setCameraTrack] = useState<any>(null);

  useEffect(() => {
    if (room && room.localParticipant) {
      const localVideoTrack = room.localParticipant.getTrackPublication(Track.Source.Camera);
      if (localVideoTrack && localVideoTrack.isSubscribed) {
        setCameraTrack(localVideoTrack);
      }
    }
  }, [room]);

  if (!cameraTrack || !cameraTrack.isSubscribed) {
    return (
      <div className="w-48 h-36 bg-gray-800 rounded-lg flex items-center justify-center border-2 border-gray-600">
        <span className="text-gray-400 text-sm">Camera Off</span>
      </div>
    );
  }

  return (
    <div className="w-48 h-36 rounded-lg overflow-hidden border-2 border-gray-600 relative">
      <VideoTrack trackRef={cameraTrack} />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        You
      </div>
    </div>
  );
} 