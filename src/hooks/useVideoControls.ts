import { useCallback, useState, useEffect } from "react";
import { Room } from "livekit-client";
import { logger } from "../utils/logger";

export interface VideoControls {
  // Video state
  isVideoEnabled: boolean;
  isVideoHidden: boolean;
  
  // Video controls
  enableVideo: () => Promise<void>;
  disableVideo: () => Promise<void>;
  hideVideo: () => Promise<void>;
  showVideo: () => Promise<void>;
  toggleVideo: () => Promise<void>;
  
  // Video settings
  setVideoDevice: (deviceId: string) => Promise<void>;
  getVideoDevices: () => Promise<MediaDeviceInfo[]>;
  
  // Video quality
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
export const useVideoControls = (room: Room | null): VideoControls => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isVideoHidden, setIsVideoHidden] = useState(false);

  // Update video state when room changes
  useEffect(() => {
    if (!room) {
      setIsVideoEnabled(false);
      setIsVideoHidden(false);
      return;
    }

    const localParticipant = room.localParticipant;
    
    // Set initial state
    setIsVideoEnabled(localParticipant.isCameraEnabled);
    setIsVideoHidden(false); // LiveKit doesn't have a direct hidden state for video

    // Listen for video state changes
    const handleTrackMuted = (track: any) => {
      if (track.source === 'camera') {
        setIsVideoHidden(true);
        logger.log("📹 Video hidden");
      }
    };

    const handleTrackUnmuted = (track: any) => {
      if (track.source === 'camera') {
        setIsVideoHidden(false);
        logger.log("📹 Video shown");
      }
    };

    // Subscribe to events
    localParticipant.on('trackMuted', handleTrackMuted);
    localParticipant.on('trackUnmuted', handleTrackUnmuted);

    return () => {
      localParticipant.off('trackMuted', handleTrackMuted);
      localParticipant.off('trackUnmuted', handleTrackUnmuted);
    };
  }, [room]);

  // Enable video
  const enableVideo = useCallback(async () => {
    if (!room) {
      logger.warn("Cannot enable video: no room connection");
      return;
    }

    try {
      await room.localParticipant.setCameraEnabled(true);
      logger.log("📹 Video enabled successfully");
    } catch (error) {
      logger.error("Failed to enable video:", error);
      throw error;
    }
  }, [room]);

  // Disable video
  const disableVideo = useCallback(async () => {
    if (!room) {
      logger.warn("Cannot disable video: no room connection");
      return;
    }

    try {
      await room.localParticipant.setCameraEnabled(false);
      logger.log("📹 Video disabled successfully");
    } catch (error) {
      logger.error("Failed to disable video:", error);
      throw error;
    }
  }, [room]);

  // Hide video
  const hideVideo = useCallback(async () => {
    if (!room) {
      logger.warn("Cannot hide video: no room connection");
      return;
    }

    try {
      // For now, we'll just disable the camera as LiveKit doesn't have a direct hide method
      await room.localParticipant.setCameraEnabled(false);
      logger.log("📹 Video hidden successfully");
    } catch (error) {
      logger.error("Failed to hide video:", error);
      throw error;
    }
  }, [room]);

  // Show video
  const showVideo = useCallback(async () => {
    if (!room) {
      logger.warn("Cannot show video: no room connection");
      return;
    }

    try {
      await room.localParticipant.setCameraEnabled(true);
      logger.log("📹 Video shown successfully");
    } catch (error) {
      logger.error("Failed to show video:", error);
      throw error;
    }
  }, [room]);

  // Toggle video
  const toggleVideo = useCallback(async () => {
    if (isVideoEnabled) {
      await disableVideo();
    } else {
      await enableVideo();
    }
  }, [isVideoEnabled, enableVideo, disableVideo]);

  // Set video device
  const setVideoDevice = useCallback(async (deviceId: string) => {
    if (!room) {
      logger.warn("Cannot set video device: no room connection");
      return;
    }

    try {
      await room.localParticipant.setCameraEnabled(true, { deviceId });
      logger.log("📹 Video device changed to:", deviceId);
    } catch (error) {
      logger.error("Failed to set video device:", error);
      throw error;
    }
  }, [room]);

  // Get available video devices
  const getVideoDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      logger.log("📹 Available video devices:", videoDevices);
      return videoDevices;
    } catch (error) {
      logger.error("Failed to get video devices:", error);
      throw error;
    }
  }, []);

  // Set video quality
  const setVideoQuality = useCallback(async (quality: 'low' | 'medium' | 'high') => {
    if (!room) {
      logger.warn("Cannot set video quality: no room connection");
      return;
    }

    try {
      // TODO: Implement video quality settings when LiveKit provides the API
      logger.log("📹 Video quality set to:", quality);
      logger.log("📹 Video quality settings not implemented yet");
    } catch (error) {
      logger.error("Failed to set video quality:", error);
      throw error;
    }
  }, [room]);

  return {
    // Video state
    isVideoEnabled,
    isVideoHidden,
    
    // Video controls
    enableVideo,
    disableVideo,
    hideVideo,
    showVideo,
    toggleVideo,
    
    // Video settings
    setVideoDevice,
    getVideoDevices,
    
    // Video quality
    setVideoQuality,
  };
}; 