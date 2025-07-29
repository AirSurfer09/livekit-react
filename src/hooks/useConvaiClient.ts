import { useState, useCallback, useMemo, useEffect } from "react";
import { Room, RoomEvent } from "livekit-client";
import {
  ConvaiConfig,
  ConvaiClient,
  ConvaiClientState,
  ChatMessage,
} from "../types";

const DEFAULT_CORE_SERVICE_URL = "https://realtime-api.convai.com";

export const useConvaiClient = (): ConvaiClient & {
  activity: string;
  chatMessages: ChatMessage[];
} => {
  const [room] = useState(new Room());
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [activity, setActivity] = useState<string>("Idle");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // Data message listener effect
  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (payload: Uint8Array, participant: any) => {
      try {
        // Decode bytes to string
        const decoder = new TextDecoder();
        const messageString = decoder.decode(payload);

        // Parse JSON
        const messageData = JSON.parse(messageString);

        console.log("📨 Data message received:", messageData);

        // Extract and categorize messages for chat display
        const timestamp = new Date().toISOString();
        const messageId = `${messageData.type}-${Date.now()}-${Math.random()}`;

        // Handle different message types
        switch (messageData.type) {
          case "user-llm-text":
          case "text-input":
          case "user-input":
          case "text-message":
          case "chat-message":
          case "input-text":
          case "message":
            // User chat message
            if (
              messageData.data?.text ||
              messageData.message ||
              messageData.text ||
              messageData.content
            ) {
              const userMessage: ChatMessage = {
                id: messageId,
                type: "user",
                content:
                  messageData.data?.text ||
                  messageData.message ||
                  messageData.text ||
                  messageData.content,
                timestamp,
              };
              setChatMessages((prev) => [...prev, userMessage]);
            }
            break;

          case "bot-llm-text":
            // Convai response
            if (messageData.data?.text) {
              const convaiMessage: ChatMessage = {
                id: messageId,
                type: "convai",
                content: messageData.data.text,
                timestamp,
              };
              setChatMessages((prev) => [...prev, convaiMessage]);
              console.log("🤖 Convai Response:", messageData.data.text);
            }
            break;

          case "server-message":
            // Handle server messages
            if (messageData.data?.emotion) {
              // Emotion display
              const emotionMessage: ChatMessage = {
                id: messageId,
                type: "emotion",
                content: messageData.data.emotion,
                timestamp,
              };
              setChatMessages((prev) => [...prev, emotionMessage]);
              console.log("😊 Emotion:", messageData.data.emotion);
            } else if (
              messageData.data?.type === "behavior-tree-response" &&
              messageData.data?.narrative_section_id
            ) {
              // Behavior tree response
              const behaviorMessage: ChatMessage = {
                id: messageId,
                type: "behavior-tree",
                content: messageData.data.narrative_section_id,
                timestamp,
              };
              setChatMessages((prev) => [...prev, behaviorMessage]);
              console.log(
                "🌳 Behavior Tree:",
                messageData.data.narrative_section_id,
              );
            }
            break;
        }

        // Special handling for RTVI messages
        if (messageData.type && messageData.type.includes("rtvi")) {
          console.log("🤖 RTVI Message:", messageData);
        }

        // Special handling for trigger messages
        if (messageData.type === "trigger-message") {
          console.log("🎯 Trigger Message Response:", messageData);
        }

        // Log any unhandled message types
        if (
          ![
            "user-llm-text",
            "text-input",
            "user-input",
            "text-message",
            "chat-message",
            "input-text",
            "message",
            "bot-llm-text",
            "server-message",
            "trigger-message",
          ].includes(messageData.type)
        ) {
          console.log(
            "🔍 Unhandled message type:",
            messageData.type,
            messageData,
          );
        }
      } catch (error) {
        console.group("❌ Failed to parse incoming data message");
        console.error("Parse Error:", error);
        console.log("Raw bytes length:", payload.length);

        // Try to decode as string even if JSON parsing fails
        try {
          const decoder = new TextDecoder();
          const messageString = decoder.decode(payload);
          console.log("Raw string content:", messageString);
        } catch (decodeError) {
          console.error("Failed to decode as string:", decodeError);
          console.log(
            "Raw bytes (first 100):",
            Array.from(payload.slice(0, 100)),
          );
        }

        console.groupEnd();
      }
    };

    // Listen for data received events
    room.on(RoomEvent.DataReceived, handleDataReceived);

    // Cleanup listener on unmount
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

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

        console.log("Connecting to Convai with config:", {
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
          console.error("API Error Response:", {
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
        console.log("Connection data received:", connectionData);

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

        setIsConnected(true);
        setActivity("Connected");

        console.log("Connected to room:", connectionData.room_name);
        console.log("Session ID:", connectionData.session_id);
      } catch (error) {
        console.error("Connection failed:", error);
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
      // Clear chat messages on disconnect
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

  // Send text message
  const sendTextMessage = useCallback(
    (text: string) => {
      if (room && room.localParticipant && text.trim()) {
        // Add user message to chat immediately
        const timestamp = new Date().toISOString();
        const messageId = `user-${Date.now()}-${Math.random()}`;
        const userMessage: ChatMessage = {
          id: messageId,
          type: "user",
          content: text.trim(),
          timestamp,
        };
        setChatMessages((prev) => [...prev, userMessage]);

        // Send only the string data without any type wrapper
        const encodedData = new TextEncoder().encode(text.trim());
        room.localParticipant.publishData(encodedData, {
          reliable: true,
        });

        console.log("💬 Text message sent:", text.trim());
      }
    },
    [room],
  );

  // Return client object with activity and chat messages
  return {
    state,
    connect,
    disconnect,
    messages: [],
    transcriptions: [],
    room,
    videoTrack: null,
    audioTrack: null,
    sendRTVI: () => {}, // Placeholder for unused function
    sendTextMessage,
    activity,
    chatMessages,
  };
};

