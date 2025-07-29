import { useCallback, useState, useEffect } from "react";
import { logger } from "../utils/logger";
export const useAudioControls = (room) => {
    const [isAudioEnabled, setIsAudioEnabled] = useState(false);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [audioLevel, setAudioLevel] = useState(0);
    // Update audio state when room changes
    useEffect(() => {
        if (!room) {
            setIsAudioEnabled(false);
            setIsAudioMuted(false);
            setAudioLevel(0);
            return;
        }
        const localParticipant = room.localParticipant;
        // Set initial state
        setIsAudioEnabled(localParticipant.isMicrophoneEnabled);
        setIsAudioMuted(false); // LiveKit doesn't have a direct muted state
        // Listen for audio state changes
        const handleTrackMuted = (track) => {
            if (track.source === 'microphone') {
                setIsAudioMuted(true);
                logger.log("🔇 Audio muted");
            }
        };
        const handleTrackUnmuted = (track) => {
            if (track.source === 'microphone') {
                setIsAudioMuted(false);
                logger.log("🎤 Audio unmuted");
            }
        };
        const handleTrackEnabled = (track) => {
            if (track.source === 'microphone') {
                setIsAudioEnabled(true);
                logger.log("🎤 Audio enabled");
            }
        };
        const handleTrackDisabled = (track) => {
            if (track.source === 'microphone') {
                setIsAudioEnabled(false);
                logger.log("🔇 Audio disabled");
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
    // Enable audio
    const enableAudio = useCallback(async () => {
        if (!room) {
            logger.warn("Cannot enable audio: no room connection");
            return;
        }
        try {
            await room.localParticipant.setMicrophoneEnabled(true);
            logger.log("🎤 Audio enabled successfully");
        }
        catch (error) {
            logger.error("Failed to enable audio:", error);
            throw error;
        }
    }, [room]);
    // Disable audio
    const disableAudio = useCallback(async () => {
        if (!room) {
            logger.warn("Cannot disable audio: no room connection");
            return;
        }
        try {
            await room.localParticipant.setMicrophoneEnabled(false);
            logger.log("🔇 Audio disabled successfully");
        }
        catch (error) {
            logger.error("Failed to disable audio:", error);
            throw error;
        }
    }, [room]);
    // Mute audio
    const muteAudio = useCallback(async () => {
        if (!room) {
            logger.warn("Cannot mute audio: no room connection");
            return;
        }
        try {
            // For now, we'll just disable the microphone as LiveKit doesn't have a direct mute method
            await room.localParticipant.setMicrophoneEnabled(false);
            logger.log("🔇 Audio muted successfully");
        }
        catch (error) {
            logger.error("Failed to mute audio:", error);
            throw error;
        }
    }, [room]);
    // Unmute audio
    const unmuteAudio = useCallback(async () => {
        if (!room) {
            logger.warn("Cannot unmute audio: no room connection");
            return;
        }
        try {
            await room.localParticipant.setMicrophoneEnabled(true);
            logger.log("🎤 Audio unmuted successfully");
        }
        catch (error) {
            logger.error("Failed to unmute audio:", error);
            throw error;
        }
    }, [room]);
    // Toggle audio
    const toggleAudio = useCallback(async () => {
        if (isAudioEnabled) {
            await disableAudio();
        }
        else {
            await enableAudio();
        }
    }, [isAudioEnabled, enableAudio, disableAudio]);
    // Set audio device
    const setAudioDevice = useCallback(async (deviceId) => {
        if (!room) {
            logger.warn("Cannot set audio device: no room connection");
            return;
        }
        try {
            await room.localParticipant.setMicrophoneEnabled(true, { deviceId });
            logger.log("🎤 Audio device changed to:", deviceId);
        }
        catch (error) {
            logger.error("Failed to set audio device:", error);
            throw error;
        }
    }, [room]);
    // Get available audio devices
    const getAudioDevices = useCallback(async () => {
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const audioDevices = devices.filter(device => device.kind === 'audioinput');
            logger.log("🎤 Available audio devices:", audioDevices);
            return audioDevices;
        }
        catch (error) {
            logger.error("Failed to get audio devices:", error);
            throw error;
        }
    }, []);
    // Start audio level monitoring
    const startAudioLevelMonitoring = useCallback(() => {
        if (!room) {
            logger.warn("Cannot start audio monitoring: no room connection");
            return;
        }
        logger.log("🎤 Audio level monitoring not implemented yet");
        // TODO: Implement audio level monitoring when LiveKit provides the API
    }, [room]);
    // Stop audio level monitoring
    const stopAudioLevelMonitoring = useCallback(() => {
        if (!room) {
            logger.warn("Cannot stop audio monitoring: no room connection");
            return;
        }
        setAudioLevel(0);
        logger.log("🎤 Audio level monitoring stopped");
    }, [room]);
    return {
        // Audio state
        isAudioEnabled,
        isAudioMuted,
        audioLevel,
        // Audio controls
        enableAudio,
        disableAudio,
        muteAudio,
        unmuteAudio,
        toggleAudio,
        // Audio settings
        setAudioDevice,
        getAudioDevices,
        // Audio monitoring
        startAudioLevelMonitoring,
        stopAudioLevelMonitoring,
    };
};
