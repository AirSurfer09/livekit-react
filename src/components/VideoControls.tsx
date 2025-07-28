import { Room } from "livekit-client";
import { useState, useEffect } from "react";

export interface VideoControlsProps {
  room?: Room | null;
}

export function VideoControls({ room }: VideoControlsProps) {
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  useEffect(() => {
    if (room && room.localParticipant) {
      setIsCameraEnabled(room.localParticipant.isCameraEnabled);
    }
  }, [room]);

  const toggleCamera = async () => {
    if (room && room.localParticipant) {
      try {
        await room.localParticipant.setCameraEnabled(!isCameraEnabled);
        setIsCameraEnabled(!isCameraEnabled);
      } catch (error) {
        console.error('Failed to toggle camera:', error);
      }
    }
  };

  return (
    <button
      onClick={toggleCamera}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        isCameraEnabled 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-gray-600 hover:bg-gray-700 text-white'
      }`}
    >
      {isCameraEnabled ? (
        <span className="flex items-center gap-1">
          📹 Camera On
        </span>
      ) : (
        <span className="flex items-center gap-1">
          📹 Camera Off
        </span>
      )}
    </button>
  );
} 