import { useState, useCallback, useMemo, useEffect } from "react";
import { Room, RoomEvent } from "livekit-client";
import {
  ConvaiConfig,
  ConvaiClient,
  ConvaiClientState,
  ChatMessage,
} from "../types";
import { useUserTextMessageSender } from "./useUserTextMessageSender";
import { useTriggerMessageSender } from "./useTriggerMessageSender";
import { useTemplateKeysUpdater } from "./useTemplateKeysUpdater";
import { useDynamicInfoUpdater } from "./useDynamicInfoUpdater";
import { useMessageHandler } from "./useMessageHandler";
import { useAudioControls } from "./useAudioControls";
import { useVideoControls } from "./useVideoControls";
import { logger } from "../utils/logger";

const DEFAULT_CORE_SERVICE_URL = "https://realtime-api.convai.com";

/**
 * Main hook for managing Convai client connection and functionality.
 * 
 * Provides a complete interface for connecting to Convai's AI-powered voice assistants,
 * managing real-time audio/video conversations, and handling various message types.
 * 
 * @returns {ConvaiClient & { activity: string; chatMessages: ChatMessage[] }} Complete client interface with connection state, methods, and message history
 * 
 * @example
 * ```tsx
 * function App() {
 *   const convaiClient = useConvaiClient();
 *   
 *   const connect = async () => {
 *     await convaiClient.connect({
 *       apiKey: 'your-api-key',
 *       characterId: 'your-character-id',
 *       enableVideo: true,
 *       enableAudio: true
 *     });
 *   };
 *   
 *   return (
 *     <div>
 *       <button onClick={connect}>Connect</button>
 *       <p>Status: {convaiClient.state.isConnected ? 'Connected' : 'Disconnected'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export const useConvaiClient = (): ConvaiClient & {
  activity: string;
  chatMessages: ChatMessage[];
} => {
  const [room] = useState(new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activity, setActivity] = useState<string>("Idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [participantSid, setParticipantSid] = useState<string>("");

  // Initialize message sender hooks
  const { sendUserTextMessage } = useUserTextMessageSender(room, participantSid);
  const { sendTriggerMessage } = useTriggerMessageSender(room, participantSid);
  const { updateTemplateKeys } = useTemplateKeysUpdater(room, participantSid);
  const { updateDynamicInfo } = useDynamicInfoUpdater(room, participantSid);

  // Initialize message handler
  const { setupMessageListener } = useMessageHandler(room, setChatMessages);

  // Initialize media controls
  const audioControls = useAudioControls(room);
  const videoControls = useVideoControls(room);

  // Data message listener effect
  useEffect(() => {
    const cleanup = setupMessageListener();
    return cleanup;
  }, [setupMessageListener]);

  // Create client state
  const state: ConvaiClientState = useMemo(
    () => ({
      isConnected,
      isConnecting,
      isListening: false,
      isThinking: false,
      isSpeaking: false,
      agentState: "disconnected" as const,
    }),
    [isConnected, isConnecting],
  );

  // Connect function
  const connect = useCallback(
    async (config: ConvaiConfig) => {
      if (!config.apiKey || !config.characterId) {
        throw new Error("apiKey and characterId are required");
      }

      setIsConnecting(true);
      setActivity("Connecting...");

      try {
        // Prepare request body with defaults
        const requestBody = {
          character_id: config.characterId,
          transport: "livekit",
          connection_type: "audio",
          llm_provider: config.llmProvider || "gemini-baml",
          ...(config.actionConfig && { action_config: config.actionConfig }),
        };

        logger.log("Connecting to Convai with config:", {
          url: config.url || DEFAULT_CORE_SERVICE_URL,
          characterId: config.characterId,
          llmProvider: config.llmProvider || "gemini-baml",
          hasActionConfig: !!config.actionConfig,
        });

        // Call Core Service API
        const response = await fetch(
          `${config.url || DEFAULT_CORE_SERVICE_URL}/connect`,
          {
            method: "POST",
            headers: {
              "x-api-key": config.apiKey,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          },
        );

        if (!response.ok) {
          const errorText = await response.text();
          logger.error("API Error Response:", {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });

          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            } else if (errorData.error) {
              errorMessage = errorData.error;
            }
          } catch (e) {
            // If we can't parse the error, use the raw text
            if (errorText) {
              errorMessage = `${errorMessage}: ${errorText}`;
            }
          }

          throw new Error(errorMessage);
        }

        const connectionData = await response.json();
        logger.log("Connection data received:", connectionData);

        // Connect to LiveKit room
        await room.connect(connectionData.room_url, connectionData.token, {
          rtcConfig: {
            iceTransportPolicy: "relay",
          },
        });

        // Enable mic/camera based on config
        if (config.enableAudio !== false) {
          await room.localParticipant.setMicrophoneEnabled(true);
        }
        if (config.enableVideo !== false) {
          await room.localParticipant.setCameraEnabled(true);
        }

        // Capture participant SID
        setParticipantSid(room.localParticipant.sid);
        setIsConnected(true);
        setActivity("Connected");

        logger.log("Connected to room:", connectionData.room_name);
        logger.log("Session ID:", connectionData.session_id);
        logger.log("Participant SID:", room.localParticipant.sid);
      } catch (error) {
        logger.error("Connection failed:", error);
        setIsConnected(false);
        setActivity("Connection failed");
        throw error;
      } finally {
        setIsConnecting(false);
      }
    },
    [room],
  );

  // Disconnect function
  const disconnect = useCallback(async () => {
    if (room) {
      await room.disconnect();
      setIsConnected(false);
      setActivity("Disconnected");
      setChatMessages([]);
    }
  }, [room]);

  // Send RTVI trigger
  const sendRTVI = useCallback(
    (triggerName: string, message?: string) => {
      if (room && room.localParticipant) {
        const data = {
          type: "rtvi-trigger",
          trigger: triggerName,
          message: message || "",
        };
        room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(data)),
          {
            reliable: true,
          },
        );
      }
    },
    [room],
  );



  // Return client object with activity and chat messages
  return {
    state,
    connect,
    disconnect,
    room,
    videoTrack: null,
    audioTrack: null,
    sendUserTextMessage,
    sendTriggerMessage,
    updateTemplateKeys,
    updateDynamicInfo,
    activity,
    chatMessages,
    audioControls,
    videoControls,
  };
};

