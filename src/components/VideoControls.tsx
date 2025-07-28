import { useLocalParticipant } from "@livekit/components-react";
import { useState, useEffect } from "react";

export function VideoControls() {
  const { localParticipant } = useLocalParticipant();
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);

  useEffect(() => {
    if (localParticipant) {
      setIsCameraEnabled(localParticipant.isCameraEnabled);
    }
  }, [localParticipant]);

  const toggleCamera = async () => {
    if (localParticipant) {
      try {
        await localParticipant.setCameraEnabled(!isCameraEnabled);
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