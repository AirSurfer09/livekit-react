import { useCallback } from "react";
import { Room, RoomEvent } from "livekit-client";
import { ChatMessage } from "../types";

export const useMessageHandler = (
  room: Room | null,
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>
) => {
  const handleDataReceived = useCallback(
    (payload: Uint8Array, participant: any) => {
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
          // User input messages (legacy support)
          case "user_text_message":
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

          // Bot LLM Text Messages
          case "bot-llm-text":
            if (messageData.data?.text) {
              const convaiMessage: ChatMessage = {
                id: messageId,
                type: "convai",
                content: messageData.data.text,
                timestamp,
              };
              setChatMessages((prev) => [...prev, convaiMessage]);
              console.log("🤖 Bot LLM Response:", messageData.data.text);
            }
            break;

          // User Transcription Messages
          case "user-transcription":
            if (messageData.data?.text && messageData.data?.final) {
              const userMessage: ChatMessage = {
                id: messageId,
                type: "user",
                content: messageData.data.text,
                timestamp: messageData.data.timestamp || timestamp,
              };
              setChatMessages((prev) => [...prev, userMessage]);
              console.log("🎤 User Transcription:", messageData.data.text);
            }
            break;

          // Bot Emotion Messages
          case "bot-emotion":
            if (messageData.data?.emotion) {
              const emotionMessage: ChatMessage = {
                id: messageId,
                type: "emotion",
                content: `${messageData.data.emotion} (scale: ${messageData.data.scale || 1})`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, emotionMessage]);
              console.log("😊 Bot Emotion:", messageData.data.emotion, "Scale:", messageData.data.scale);
            }
            break;

          // Action Response Messages
          case "action-response":
            if (messageData.data?.actions) {
              const actionMessage: ChatMessage = {
                id: messageId,
                type: "action",
                content: `Actions: ${messageData.data.actions.join(", ")}`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, actionMessage]);
              console.log("🎭 Action Response:", messageData.data.actions);
            }
            break;

          // Behavior Tree Response Messages
          case "behavior-tree-response":
            if (messageData.data?.narrative_section_id) {
              const behaviorMessage: ChatMessage = {
                id: messageId,
                type: "behavior-tree",
                content: `Narrative Section: ${messageData.data.narrative_section_id}`,
                timestamp,
              };
              setChatMessages((prev) => [...prev, behaviorMessage]);
              console.log("🌳 Behavior Tree Response:", {
                narrativeSection: messageData.data.narrative_section_id,
                btCode: messageData.data.bt_code,
                btConstants: messageData.data.bt_constants,
              });
            }
            break;

          // Moderation Response Messages
          case "moderation-response":
            console.log("🛡️ Moderation Response:", {
              result: messageData.data?.result,
              userInput: messageData.data?.user_input,
              reason: messageData.data?.reason,
            });
            break;

          // Trigger Messages
          case "trigger-message":
            console.log("🎯 Trigger message received:", messageData.data);
            break;

          // Template Keys Updates
          case "update-template-keys":
            console.log("🔑 Template keys update received:", messageData.data);
            break;

          // Dynamic Info Updates
          case "update-dynamic-info":
            console.log("🔄 Dynamic info update received:", messageData.data);
            break;
        }

        // Log any unhandled message types
        if (
          ![
            "user_text_message",
            "user-llm-text",
            "text-input",
            "user-input",
            "text-message",
            "chat-message",
            "input-text",
            "message",
            "bot-llm-text",
            "user-transcription",
            "bot-emotion",
            "action-response",
            "behavior-tree-response",
            "moderation-response",
            "trigger-message",
            "update-template-keys",
            "update-dynamic-info",
          ].includes(messageData.type)
        ) {
          console.log(
            "🔍 Unhandled message type:",
            messageData.type,
            messageData,
          );
        }
      } catch (error) {
        console.error("Failed to parse data message:", error);
      }
    },
    [setChatMessages],
  );

  const setupMessageListener = useCallback(() => {
    if (!room) return;

    // Listen for data received events
    room.on(RoomEvent.DataReceived, handleDataReceived);

    // Return cleanup function
    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room, handleDataReceived]);

  return {
    setupMessageListener,
  };
}; 